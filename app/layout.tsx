import Provider from "@/app/provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/app/header";
import { Image } from "@nextui-org/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hospital",
  description: "Hospital app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Provider>
          <Header />
          <main className="relative container mx-auto max-w-7xl z-10 px-6 min-h-[calc(100vh_-_64px_-_108px)] my-12 flex-grow">
            {children}
          </main>
          <div
            aria-hidden="true"
            className="fixed hidden dark:md:block dark:opacity-70 -bottom-[40%] -left-[20%] z-0"
          >
            <Image
              removeWrapper
              alt="docs left background"
              src="/gradients/docs-left.png"
            />
          </div>
          <div
            aria-hidden="true"
            className="fixed hidden dark:md:block dark:opacity-70 -top-[80%] -right-[60%] 2xl:-top-[60%] 2xl:-right-[45%] z-0 rotate-12"
          >
            <Image
              removeWrapper
              alt="docs right background"
              src="/gradients/docs-right.png"
            />
          </div>
        </Provider>
      </body>
    </html>
  );
}
