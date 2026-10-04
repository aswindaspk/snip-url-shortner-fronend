import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Snip — Small links. Big possibilities.",
    template: "%s · Snip",
  },
  description:
    "Turn long URLs into clean, memorable links. Create, copy, and share with Snip.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:p-4"
          >
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
