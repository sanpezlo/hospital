import { NextResponse, type NextRequest } from "next/server";
import { errorHandler } from "@/lib/error-hanlder";
import colombia from "@/app/api/department/colombia.min.json";

export function GET(request: NextRequest) {
  return errorHandler(async () => {
    return NextResponse.json(colombia);
  });
}
