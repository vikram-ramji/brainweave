/*
  Warnings:

  - Added the required column `textContent` to the `note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "note" ADD COLUMN     "textContent" TEXT NOT NULL;
