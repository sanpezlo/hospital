// export { default } from "next-auth/middleware";

// export const config = { matcher: ["/dashboard"] };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
