/*
  Warnings:

  - Added the required column `type` to the `MedicalAppointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalAppointment" ADD COLUMN     "type" TEXT NOT NULL;
