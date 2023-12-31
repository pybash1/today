import "~/styles/globals.css";

import localFont from "next/font/local";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

const condenso = localFont({
  src: "./Condenso.woff2",
  display: "swap",
});

export const metadata = {
  title: "Today",
  description: "Get sh*t done.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${condenso.className}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
