-- This migration creates the functions and triggers necessary to keep the
-- denormalized `notes.tags_text` column perfectly in sync with the actual tags.
-- This logic is now guaranteed by the database, removing any risk of
-- application-level logic forgetting to perform the update.

-- Drop existing objects if they exist, to make this script idempotent.
DROP TRIGGER IF EXISTS trigger_update_tags_text_on_tag_rename ON tags;
DROP FUNCTION IF EXISTS update_tags_text_on_tag_rename();
DROP TRIGGER IF EXISTS trigger_update_note_tags_text ON notes_to_tags;
DROP FUNCTION IF EXISTS update_note_tags_text();

-- FUNCTION 1: Update tags_text for a single note.
-- This function is designed to be called when a note-tag link is created or deleted.
CREATE OR REPLACE FUNCTION update_note_tags_text()
RETURNS TRIGGER AS $$
DECLARE
    note_id_to_update TEXT;
BEGIN
    -- Determine the note_id from the operation (INSERT or DELETE)
    IF TG_OP = 'INSERT' THEN
        note_id_to_update := NEW.note_id;
    ELSIF TG_OP = 'DELETE' THEN
        note_id_to_update := OLD.note_id;
    END IF;

    -- Perform the update on the notes table
    UPDATE notes n
    SET tags_text = (
        SELECT COALESCE(STRING_AGG(t.name, ' '), '')
        FROM notes_to_tags ntt
        JOIN tags t ON ntt.tag_id = t.id
        WHERE ntt.note_id = note_id_to_update
    )
    WHERE n.id = note_id_to_update;

    RETURN NULL; -- The result is ignored for AFTER triggers
END;
$$ LANGUAGE plpgsql;

-- TRIGGER 1: Fire the function after a tag is added to or removed from a note.
CREATE TRIGGER trigger_update_note_tags_text
AFTER INSERT OR DELETE ON notes_to_tags
FOR EACH ROW EXECUTE FUNCTION update_note_tags_text();


-- FUNCTION 2: Handle the cascading update when a tag is renamed.
CREATE OR REPLACE FUNCTION update_tags_text_on_tag_rename()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if the tag's name has actually changed.
    IF NEW.name IS DISTINCT FROM OLD.name THEN
        -- This is a cascading update. We must find all notes linked to the
        -- renamed tag and trigger their `tags_text` to be recomputed.
        -- We do this by simulating an update on the notes_to_tags table,
        -- which will cause our first trigger to fire for each affected note.
        UPDATE notes_to_tags
        SET tag_id = NEW.id -- This is a no-op update just to fire the trigger
        WHERE tag_id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER 2: Fire the function after a tag's name is updated.
CREATE TRIGGER trigger_update_tags_text_on_tag_rename
AFTER UPDATE ON tags
FOR EACH ROW EXECUTE FUNCTION update_tags_text_on_tag_rename();
