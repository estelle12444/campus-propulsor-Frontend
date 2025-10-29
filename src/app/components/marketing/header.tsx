'use client';
import Link from "next/link";


import { useModal } from "@/app/context/ModalContext";

export default function Header() {

  return (
    <>
      <header id="header" className="header d-flex align-items-center sticky-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">

          <a href="home" className="logo d-flex align-items-center">
            {/* Uncomment the line below if you also wish to use an image logo
     <img src="assets/img/logo.webp" alt="">  */}
            <i className="bi bi-buildings"></i>
            <h6 className="sitename">Campus & Professional Propul'Sor</h6>
          </a>

          <Nav />

        </div>
      </header>
    </>
  );
}


export function Nav() {

  const { openRegisterModal, openLoginModal } = useModal();
  return (
    <nav id="navmenu" className="navmenu">
      <ul>
        <li><a href="home" className="active">Accueil</a></li>
        {/* <li className="dropdown"><a href="about.html"><span>About</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
            <ul>
              <li><a href="about.html">About Us</a></li>
              <li><a href="admissions.html">Admissions</a></li>
              <li><a href="academics.html">Academics</a></li>
              <li><a href="faculty-staff.html">Faculty &amp; Staff</a></li>
              <li><a href="campus-facilities.html">Campus &amp; Facilities</a></li>
            </ul>
          </li>

          <li><a href="students-life.html">Students Life</a></li>
          <li><a href="news.html">News</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="alumni.html">Alumni</a></li> */}
        {/* <li className="dropdown"><a href="#"><span>More Pages</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
            <ul>
              <li><a href="news-details.html">News Details</a></li>
              <li><a href="event-details.html">Event Details</a></li>
              <li><a href="privacy.html">Privacy</a></li>
              <li><a href="terms-of-service.html">Terms of Service</a></li>
              <li><a href="404.html">Error 404</a></li>
              <li><a href="starter-page.html">Starter Page</a></li>
            </ul>
          </li>

          <li className="dropdown"><a href="#"><span>Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
            <ul>
              <li><a href="#">Dropdown 1</a></li>
              <li className="dropdown"><a href="#"><span>Deep Dropdown</span> <i className="bi bi-chevron-down toggle-dropdown"></i></a>
                <ul>
                  <li><a href="#">Deep Dropdown 1</a></li>
                  <li><a href="#">Deep Dropdown 2</a></li>
                  <li><a href="#">Deep Dropdown 3</a></li>
                  <li><a href="#">Deep Dropdown 4</a></li>
                  <li><a href="#">Deep Dropdown 5</a></li>
                </ul>
              </li>
              <li><a href="#">Dropdown 2</a></li>
              <li><a href="#">Dropdown 3</a></li>
              <li><a href="#">Dropdown 4</a></li>
            </ul>
          </li> */}
        <li><a href="partenaire">Nos partenaires</a></li>
        <li><a href="contact">Contact</a></li>

        <li className="btn-register2" >
          <button
            onClick={openRegisterModal}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Inscription
          </button>

        </li>
        <li>
          <button
            onClick={openLoginModal}
            className="text-gray-700 hover:text-blue-600 px-4 py-2 font-medium transition-colors"
          >
            Connexion
          </button>
        </li>

      </ul>
      <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
    </nav>
  );
}

