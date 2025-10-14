import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// Import du CSS global
import "./evaluation.css"; 
import Script from "next/script";


// import "./main.js";
// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Campus & Professional Propul'Sor",
    description: 'Accompagnement personnalisé pour les étudiants ivoiriens souhaitant étudier en France',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <head>
                {/* Autres balises meta ou Link ici */}


                {/* <!-- Favicons --> */}
                <link href="../assets/img/favicon.png" rel="icon" />
                <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" />


                <link href="https://fonts.googleapis.com" rel="preconnect" />
                <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />

                {/* <!-- Vendor CSS Files --> */}
                <link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
                <link href="../assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
                <link href="../assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />
                <link href="../assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet" />


                <link href="../assets/css/main.css" rel="stylesheet" />
                {/* Vendor JS */}

            </head>

            <body className="index-page" >
                {children}

                <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>

                {/* <!-- Preloader --> */}
                {/* <div id="preloader"></div> */}
                <Script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
                <Script src="../assets/vendor/php-email-form/validate.js" strategy="afterInteractive" />
                <Script src="../assets/vendor/swiper/swiper-bundle.min.js" strategy="afterInteractive" />
                <Script src="../assets/vendor/purecounter/purecounter_vanilla.js" strategy="afterInteractive" />
                <Script src="../assets/vendor/glightbox/js/glightbox.min.js" strategy="afterInteractive" />

                {/* Main JS */}
                <Script src="../assets/js/main.js" strategy="afterInteractive" />

            </body>
        </html>
    );
}
