import Footer from "@/app/components/student/footer";
import Header from "@/app/components/student/header";
import Sidebar from "@/app/components/student/sidebar";
import type { Metadata } from "next";
import Script from "next/script";

// 

import { Public_Sans } from 'next/font/google';

const publicSans = Public_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
    title: "Campus & Professional Propul'Sor",
    description: 'Accompagnement personnalisé pour les étudiants ivoiriens souhaitant étudier en France',
};

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>

                <div className="wrapper">
                    {/* Sidebar */}
                    <Sidebar />
                    {/* End Sidebar */}
                    <div className="main-panel">
                        <Header />
                        <div className="container" >
                            {children}
                        </div>
                        <Footer />
                    </div>
                    
                    {/* Custom template | don't include it in your project! */}
                    <div className="custom-template">
                        <div className="title">Paramètre</div>
                        <div className="custom-content">
                            <div className="switcher">
                                <div className="switch-block">
                                    <h4>Logo Header</h4>
                                    <div className="btnSwitch">
                                        <button
                                            type="button"
                                            className="selected changeLogoHeaderColor"
                                            data-color="dark"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="blue"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="purple"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="light-blue"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="green"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="orange"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="red"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="white"
                                        />
                                        <br />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="dark2"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="blue2"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="purple2"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="light-blue2"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="green2"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="orange2"
                                        />
                                        <button
                                            type="button"
                                            className="changeLogoHeaderColor"
                                            data-color="red2"
                                        />
                                    </div>
                                </div>
                                <div className="switch-block">
                                    <h4>Navbar Header</h4>
                                    <div className="btnSwitch">
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="dark"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="blue"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="purple"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="light-blue"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="green"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="orange"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="red"
                                        />
                                        <button
                                            type="button"
                                            className="selected changeTopBarColor"
                                            data-color="white"
                                        />
                                        <br />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="dark2"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="blue2"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="purple2"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="light-blue2"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="green2"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="orange2"
                                        />
                                        <button
                                            type="button"
                                            className="changeTopBarColor"
                                            data-color="red2"
                                        />
                                    </div>
                                </div>
                                <div className="switch-block">
                                    <h4>Sidebar</h4>
                                    <div className="btnSwitch">
                                        <button
                                            type="button"
                                            className="changeSideBarColor"
                                            data-color="white"
                                        />
                                        <button
                                            type="button"
                                            className="selected changeSideBarColor"
                                            data-color="dark"
                                        />
                                        <button
                                            type="button"
                                            className="changeSideBarColor"
                                            data-color="dark2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="custom-toggle">
                            <i className="icon-settings" />
                        </div>
                    </div>
                    {/* End Custom template */}
                </div>

                {/* Scripts avec Next.js Script component pour meilleure performance */}
                <Script src="/assets/student/js/core/jquery-3.7.1.min.js" strategy="beforeInteractive" />
                <Script src="/assets/student/js/core/popper.min.js" strategy="beforeInteractive" />
                <Script src="/assets/student/js/core/bootstrap.min.js" strategy="beforeInteractive" />

                {/* <!-- jQuery Scrollbar --> */}
                <Script src="/assets/student/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js" strategy="afterInteractive" />

                {/* <!--  Chart JS --> */}
                <Script src="/assets/student/js/plugin/chart.js/chart.min.js" strategy="afterInteractive" />

                {/* <!--  jQuery Sparkline --> */}
                <Script src="/assets/student/js/plugin/jquery.sparkline/jquery.sparkline.min.js" strategy="afterInteractive" />

                {/* <!--  Chart Circle --> */}
                <Script src="/assets/student/js/plugin/chart-circle/circles.min.js" strategy="afterInteractive" />

                {/* <!--  Datatables --> */}
                <Script src="/assets/student/js/plugin/datatables/datatables.min.js" strategy="afterInteractive" />

                {/* <!--  Bootstrap Notify --> */}
                <Script src="/assets/student/js/plugin/bootstrap-notify/bootstrap-notify.min.js" strategy="afterInteractive" />

                {/* <!--  jQuery Vector Maps --> */}
                <Script src="/assets/student/js/plugin/jsvectormap/jsvectormap.min.js" strategy="afterInteractive" />
                <Script src="/assets/student/js/plugin/jsvectormap/world.js" strategy="afterInteractive" />

                {/* <!--  Sweet Alert --> */}
                <Script src="/assets/student/js/plugin/sweetalert/sweetalert.min.js" strategy="afterInteractive" />

                {/* <!--  Kaiadmin JS --> */}
                <Script src="/assets/student/js/kaiadmin.min.js" strategy="afterInteractive" />

                {/* <!--  Kaiadmin DEMO methods, don't include it in your project! --> */}
                <Script src="/assets/student/js/setting-demo.js" strategy="afterInteractive" />
                <Script src="/assets/student/js/demo.js" strategy="afterInteractive" />
                
                <Script id="sparkline-charts" strategy="afterInteractive">
                    {`
                        $(document).ready(function() {
                            $("#lineChart").sparkline([102, 109, 120, 99, 110, 105, 115], {
                                type: "line",
                                height: "70",
                                width: "100%",
                                lineWidth: "2",
                                lineColor: "#177dff",
                                fillColor: "rgba(23, 125, 255, 0.14)",
                            });

                            $("#lineChart2").sparkline([99, 125, 122, 105, 110, 124, 115], {
                                type: "line",
                                height: "70",
                                width: "100%",
                                lineWidth: "2",
                                lineColor: "#f3545d",
                                fillColor: "rgba(243, 84, 93, .14)",
                            });

                            $("#lineChart3").sparkline([105, 103, 123, 100, 95, 105, 115], {
                                type: "line",
                                height: "70",
                                width: "100%",
                                lineWidth: "2",
                                lineColor: "#ffa534",
                                fillColor: "rgba(255, 165, 52, .14)",
                            });
                        });
                    `}
                </Script>
       

        </>
    );
}