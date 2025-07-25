/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `verification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "session_userId_idx";

-- DropIndex
DROP INDEX "tag_userId_idx";

-- DropIndex
DROP INDEX "verification_identifier_value_key";

-- CreateIndex
CREATE INDEX "session_userId_token_idx" ON "session"("userId", "token");

-- CreateIndex
CREATE INDEX "tag_userId_name_idx" ON "tag"("userId", "name");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_key" ON "verification"("identifier");
