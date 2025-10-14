import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";


// import "./main.js";
// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "Campus & Professional Propul'Sor",
    template: "%s | Campus Propul'Sor"
  },
  description: "Votre guide complet pour réussir vos études et votre carrière en France. Évaluation des chances d'admission, accompagnement Campus France et intégration professionnelle.",
  keywords: "études France, admission université, Campus France, étudiants ivoiriens, intégration professionnelle",
  authors: [{ name: "Campus Propul'Sor" }],
  openGraph: {
    title: "Campus & Professional Propul'Sor",
    description: "Votre guide vers les études en France",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Autres balises meta ou Link ici */}

        <link
          rel="icon"
          href="/assets/student/img/kaiadmin/favicon.ico"
          type="image/x-icon"
        />

        {/* <!-- Fonts and icons --> */}
        <Script
          src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
          strategy="beforeInteractive"
        />

        {/* <!-- CSS Files --> */}
        <link rel="stylesheet" href="/assets/student/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/student/css/plugins.min.css" />
        <link rel="stylesheet" href="/assets/student/css/kaiadmin.min.css" />

        {/* <!-- CSS Just for demo purpose, don't include it in your project --> */}
        <link rel="stylesheet" href="/assets/student/css/demo.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/css/simple-line-icons.min.css"
        />

        <script src="../assets/js/plugin/webfont/webfont.min.js"></script>

        <link rel="stylesheet" href="../assets/student/css/fonts.min.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
