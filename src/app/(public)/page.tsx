import type { Metadata } from "next";
import { LandingPage } from "@/features/marketing";

export const metadata: Metadata = {
  title: "Home",
};


export default function Home() {
  return <LandingPage />;
}
