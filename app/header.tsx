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

// import SignOut from "@/app/auth/signout/signout";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll isBordered>
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

        {session?.user.role === "ADMIN" ? (
          <NavbarItem>
            <Link as={NextLink} color="foreground" href="/dashboard">
              Panel de control
            </Link>
          </NavbarItem>
        ) : (
          <></>
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>

        {status === "loading" ? (
          <NavbarItem>
            <Spinner />
          </NavbarItem>
        ) : (
          <></>
        )}

        {status === "authenticated" ? (
          <NavbarItem>
            <Avatar
              src="https://i.pravatar.cc/150"
              isBordered
              color="primary"
            />
          </NavbarItem>
        ) : (
          <></>
        )}

        {status === "unauthenticated" ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link as={NextLink} href="/auth/signin">
                Iniciar sesión
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={NextLink}
                color="primary"
                href="/auth/signup"
                variant="flat"
              >
                Registrarse
              </Button>
            </NavbarItem>
          </>
        ) : (
          <></>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
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
