import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Homeverse — Find a place to call home", template: "%s | Homeverse" },
  description: "Search verified homes, contact trusted agents, and manage every step of your property journey.",
  openGraph: { title: "Homeverse", description: "A trusted property marketplace for buyers, renters and agents.", type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
