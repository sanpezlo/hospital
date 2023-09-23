"use client";

import { useSession } from "next-auth/react";

export default function Self() {
  const { data: session, status } = useSession();
  return (
    <div>
      {status === "loading" && <p>Loading...</p>}
      {status === "authenticated" && (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      )}
      {status === "unauthenticated" && (
        <p>
          <a href="/api/auth/signin">Sign in</a>
        </p>
      )}
    </div>
  );
}
