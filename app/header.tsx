"use client";

import { useState } from "react";
import NextLink from "next/link";
import {
  Navbar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Link,
  Button,
  Spinner,
  Avatar,
  VisuallyHidden,
  useSwitch,
  SwitchProps,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Tooltip,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Role } from "@prisma/client";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const unauthenticatedItems = [
    {
      title: "Iniciar sesión",
      link: "/auth/signin",
    },
    {
      title: "Registrarse",
      link: "/auth/signup",
    },
  ];

  const authenticatedItems = [
    {
      section: true,
      title: "Mi cuenta",
      link: "/self",
      items: [
        {
          roles: "ANY" as const,
          title: "Información básica",
          link: "/self#basic-info",
        },
        {
          roles: [Role.PATIENT, Role.DOCTOR, Role.DIRECTOR],
          title: "Mis citas",
          link: "/self#appointments",
        },
      ],
    },
    {
      section: false,
      title: "Cerrar sesión",
      link: "/auth/signout",
      items: [],
    },
  ];

  const adminItems = [
    {
      title: "Panel de control",
      link: "/dashboard",
    },
  ];

  const directorItems = [
    {
      title: "Panel de control",
      link: "/dashboard",
    },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      shouldHideOnScroll
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NextLink href="/">
            <p className="font-bold text-inherit">HOSPITAL</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {session?.user.role === "ADMIN" &&
          adminItems.map((item, index) => (
            <NavbarItem key={`${item.title}-${index}`}>
              <Link as={NextLink} color="foreground" href={item.link}>
                {item.title}
              </Link>
            </NavbarItem>
          ))}

        {session?.user.role === "DIRECTOR" &&
          directorItems.map((item, index) => (
            <NavbarItem key={`${item.title}-${index}`}>
              <Link as={NextLink} color="foreground" href={item.link}>
                {item.title}
              </Link>
            </NavbarItem>
          ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>

        {status === "loading" && (
          <NavbarItem>
            <Spinner />
          </NavbarItem>
        )}

        {status === "authenticated" && (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  name={session?.user.name || ""}
                  isBordered
                  as="button"
                  color={
                    session?.user.role === "ADMIN"
                      ? "danger"
                      : session?.user.role === "DIRECTOR"
                      ? "success"
                      : session?.user.role === "DOCTOR"
                      ? "primary"
                      : session?.user.role === "SECRETARY"
                      ? "warning"
                      : "default"
                  }
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Acciones de usuario"
                variant="flat"
                onAction={(key) => {
                  if (
                    key ===
                    authenticatedItems[authenticatedItems.length - 1].link
                  )
                    signOut();

                  router.push(`${key}`);
                }}
              >
                {authenticatedItems.map((item, index) =>
                  item.section ? (
                    <DropdownSection
                      title={item.title}
                      key={item.title}
                      showDivider
                    >
                      {item.items
                        .filter((item) =>
                          item.roles !== "ANY"
                            ? item.roles.some(
                                (role) => role === session.user.role
                              )
                            : true
                        )
                        .map((item, index) => (
                          <DropdownItem key={item.link}>
                            {item.title}
                          </DropdownItem>
                        ))}
                    </DropdownSection>
                  ) : authenticatedItems.length - 1 !== index ? (
                    <DropdownItem key={item.link}>{item.title}</DropdownItem>
                  ) : (
                    <DropdownItem
                      key={item.link}
                      color="danger"
                      className="text-danger"
                    >
                      {item.title}
                    </DropdownItem>
                  )
                )}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}

        {status === "unauthenticated" &&
          unauthenticatedItems.map((item, index) => (
            <NavbarItem key={`${item.title}-${index}`}>
              {index !== unauthenticatedItems.length - 1 ? (
                <Link as={NextLink} href={item.link}>
                  {item.title}
                </Link>
              ) : (
                <Button
                  as={NextLink}
                  color="primary"
                  href={item.link}
                  variant="flat"
                >
                  {item.title}
                </Button>
              )}
            </NavbarItem>
          ))}
      </NavbarContent>
      <NavbarMenu>
        {session?.user.role === "ADMIN" &&
          adminItems.map((item, index) => (
            <NavbarItem key={`${item.title}-${index}`}>
              <Link
                as={NextLink}
                color="foreground"
                className="w-full"
                href={item.link}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            </NavbarItem>
          ))}

        {session?.user.role === "DIRECTOR" &&
          directorItems.map((item, index) => (
            <NavbarItem key={`${item.title}-${index}`}>
              <Link
                as={NextLink}
                color="foreground"
                className="w-full"
                href={item.link}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            </NavbarItem>
          ))}

        {status === "unauthenticated" &&
          unauthenticatedItems.map((item, index) => (
            <NavbarMenuItem key={`${item.title}-${index}`}>
              <Link
                as={NextLink}
                color="foreground"
                className="w-full"
                href={item.link}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  );
}
const ThemeSwitch = (props: SwitchProps) => {
  const { setTheme } = useTheme();
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    onClick: () => {
      setTheme(isSelected ? "dark" : "light");
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Tooltip
        content={isSelected ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
      >
        <Component {...getBaseProps()}>
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
          <div
            {...getWrapperProps()}
            className={slots.wrapper({
              className: [
                "w-8 h-8",
                "flex items-center justify-center",
                "rounded-lg bg-default-100 hover:bg-default-200",
              ],
            })}
          >
            {isSelected ? (
              <SunIcon className="w-4" />
            ) : (
              <MoonIcon className="w-4" />
            )}
          </div>
        </Component>
      </Tooltip>
    </div>
  );
};
