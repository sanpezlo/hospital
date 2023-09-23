"use client";

import { signOut } from "next-auth/react";
import { Link, type LinkProps } from "@nextui-org/react";

export default function SignOut(props: LinkProps) {
  return (
    <Link as="button" onClick={() => signOut()} color="danger" {...props}>
      Cerrar sesión
    </Link>
  );
}
