import "./globals.css";
import Providers from "@/app/providers";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space"
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus"
});

export const metadata = {
  title: "Dockyard Docs",
  description: "Training app (intentionally insecure)."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  if (process.env.TRAINING_MODE !== "true") {
    throw new Error(
      "TRAINING_MODE=true is required. This app is intentionally insecure and should not run outside training."
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}
      >
        <div className="banner">
          TRAINING / INTENTIONALLY INSECURE — DO NOT DEPLOY
        </div>
        <Providers>
          <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
