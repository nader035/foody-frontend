import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { QueryProvider } from "@/lib/query-provider";
import { RouteGuard } from "@/platform/auth/route-guard";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Foody",
    template: "Foody | %s",
  },
  description:
    "Connects Restaurants, Branches, Charities, and Customers to manage restaurant food surplus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <RouteGuard />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
