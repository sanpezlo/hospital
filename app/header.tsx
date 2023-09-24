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
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(isMenuOpen);
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

  const authenticatedItems = [];

  const adminItems = [
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
        {/* <NavbarItem>
          <Link color="foreground">Features</Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page">Customers</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground">Integrations</Link>
        </NavbarItem> */}

        {session?.user.role === "ADMIN" &&
          adminItems.map((item, index) => (
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
            <Avatar
              src="https://i.pravatar.cc/150"
              isBordered
              color="primary"
            />
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
    </div>
  );
};
