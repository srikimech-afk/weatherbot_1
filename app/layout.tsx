import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather Travel Companion | Compare weather. Travel prepared.",
  description: "Compare five-day weather forecasts for home and destination locations, understand travel conditions, and get practical packing suggestions.",
  openGraph: {
    title: "Weather Travel Companion",
    description: "Compare weather. Travel prepared.",
    type: "website"
  },
  icons: { icon: "/favicon.svg" }
};
export const viewport: Viewport = { themeColor: "#0284c7", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
