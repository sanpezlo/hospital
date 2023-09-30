-- CreateEnum
CREATE TYPE "MedicalAppointmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED');

-- AlterTable
ALTER TABLE "MedicalAppointment" ADD COLUMN     "status" "MedicalAppointmentStatus" NOT NULL DEFAULT 'PENDING';
