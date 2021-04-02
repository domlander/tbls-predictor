/*
  Warnings:

  - Added the required column `kickoff` to the `fixtures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fixtures" ADD COLUMN     "kickoff" TIMESTAMP(3) NOT NULL;
