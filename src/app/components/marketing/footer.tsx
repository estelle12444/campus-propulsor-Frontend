import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer id="footer" className="footer-16 footer position-relative dark-background">

                <div className="container">

                    <div className="footer-main">
                        <div className="row align-items-start">

                            <div className="col-lg-5">
                                <div className="brand-section">
                                    <a href="index.html" className="logo d-flex align-items-center mb-4">
                                        <span className="sitename">Campus & Professional Propul'Sor</span>
                                    </a>
                                    <p className="brand-description">Crafting exceptional digital experiences through thoughtful design and innovative solutions that elevate your brand presence.</p>

                                    <div className="contact-info mt-5">
                                        <div className="contact-item">
                                            <i className="bi bi-geo-alt"></i>
                                            <span>123 Creative Boulevard, Design District, NY 10012</span>
                                        </div>
                                        <div className="contact-item">
                                            <i className="bi bi-telephone"></i>
                                            <span>+1 (555) 987-6543</span>
                                        </div>
                                        <div className="contact-item">
                                            <i className="bi bi-envelope"></i>
                                            <span>hello@designstudio.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <div className="footer-nav-wrapper">
                                    <div className="row">

                                        {/* <div className="col-6 col-lg-3">
                                            <div className="nav-column">
                                                <h6>Studio</h6>
                                                <nav className="footer-nav">
                                                    <a href="#">Our Story</a>
                                                    <a href="#">Design Process</a>
                                                    <a href="#">Portfolio</a>
                                                    <a href="#">Case Studies</a>
                                                    <a href="#">Awards</a>
                                                </nav>
                                            </div>
                                        </div> */}

                                        <div className="col-6 col-lg-3">
                                            <div className="nav-column">
                                                <h6>Services</h6>
                                                <nav className="footer-nav">
                                                    <a href="#">Accueil</a>
                                                    <a href="#">Contact</a>
                                                   
                                                </nav>
                                            </div>
                                        </div>

                                       

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* <div className="footer-social">
                        <div className="row align-items-center">

                            <div className="col-lg-6">
                                <div className="newsletter-section">
                                    <h5>Stay Inspired</h5>
                                    <p>Subscribe to receive design insights and creative inspiration delivered monthly.</p>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="social-section">
                                    <div className="social-links">
                                        <a href="#" aria-label="Dribbble" className="social-link">
                                            <i className="bi bi-dribbble"></i>
                                            <span>Dribbble</span>
                                        </a>
                                        <a href="#" aria-label="Behance" className="social-link">
                                            <i className="bi bi-behance"></i>
                                            <span>Behance</span>
                                        </a>
                                        <a href="#" aria-label="Instagram" className="social-link">
                                            <i className="bi bi-instagram"></i>
                                            <span>Instagram</span>
                                        </a>
                                        <a href="#" aria-label="LinkedIn" className="social-link">
                                            <i className="bi bi-linkedin"></i>
                                            <span>LinkedIn</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div> */}

                </div>

                 <div className="footer-bottom">
                    <div className="container">
                        <div className="bottom-content">
                            <div className="row align-items-center">

                                <div className="col-lg-6">
                                    <div className="copyright">
                                        <p>© <span className="sitename">MyWebsite</span>. All rights reserved.</p>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="legal-links">
                                        <a href="#">Privacy Policy</a>
                                        <a href="#">Terms of Service</a>
                                        <a href="#">Cookie Policy</a>
                                        <div className="credits">
                                             {/* <!-- All the links in the footer should remain intact. -->
                  <!-- You can delete the links only if you've purchased the pro version. -->
                  <!-- Licensing information: https://bootstrapmade.com/license/ -->
                  <!-- Purchase the pro version with working PHP/AJAX contact form: [buy-url] -->
                  Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a> */}
                                        </div>
                                    </div>
                                </div> 

                            </div>
                        </div>
                    </div>
                </div>

            </footer>
        </>
    );
}