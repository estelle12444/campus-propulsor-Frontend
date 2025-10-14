"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import './sidebar.css'

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const [openMenus, setOpenMenus] = useState({});

  const isMenuOpen = (menuId: string) => {
    return openMenus[menuId] || false;
  };

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  useEffect(() => {
    const initiallyOpenMenus: { [key: string]: boolean } = {};
    // Menu Admission
    if (isActive('/dashboard/admission')) {
      initiallyOpenMenus.admission = true;
    }
    // Menu Installation
    if (isActive('/dashboard/installation')) {
      initiallyOpenMenus.installation = true;
    }
    // Menu Carrière
    if (isActive('/dashboard/carriere')) {
      initiallyOpenMenus.carriere = true;
    }
    // Menu Compte
    if (isActive('/dashboard/profil')) {
      initiallyOpenMenus.compte = true;
    }
    setOpenMenus(initiallyOpenMenus);
  }, [pathname]);

  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        {/* Logo Header */}
        <div className="logo-header" data-background-color="dark">
          <Link href="/dashboard" className="logo">
            <div className="navbar-brand text-white fw-bold">
              <i className="fas fa-graduation-cap me-2"></i>
              Campus & Professional
            </div>
          </Link>
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
              <i className="gg-menu-right" />
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left" />
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt" />
          </button>
        </div>
        {/* End Logo Header */}
      </div>

      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">

            {/* Dashboard Principal */}
            <li className="nav-item">
              <Link
                href="/dashboard"
                className={`nav-link ${isActive('/dashboard') && !pathname.includes('/dashboard/') ? 'active' : ''}`}
              >
                <i className="fas fa-home" />
                <p>Tableau de Bord</p>
              </Link>
            </li>

            {/* Section Admission */}
            <li className="nav-section">
              <span className="sidebar-mini-icon">
                <i className="fa fa-ellipsis-h" />
              </span>
              <h4 className="text-section">Admission en France</h4>
            </li>

            {/* Menu Admission */}
            <li className="nav-item">
              <a
                data-bs-toggle="collapse"
                href="#admission"
                className={`nav-link ${isMenuOpen('admission') ? '' : 'collapsed'}`}
                aria-expanded={isMenuOpen('admission')}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu('admission');
                }}
              >
                <i className="fas fa-university" />
                <p>Admission Success</p>
                <span className="caret" />
              </a>
              <div className={`collapse ${isMenuOpen('admission') ? 'show' : ''}`} id="admission">
                <ul className="nav nav-collapse">
                  <li>
                    <Link
                      href="/dashboard/admission"
                      className={`nav-link ${isActive('/dashboard/admission') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Évaluation des Chances</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/admission/guide"
                      className={`nav-link ${isActive('/dashboard/admission/guide') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Guide Campus France</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/admission/documents"
                      className={`nav-link ${isActive('/dashboard/admission/documents') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Mes Documents</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/admission/calendrier"
                      className={`nav-link ${isActive('/dashboard/admission/calendrier') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Calendrier</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Menu Installation */}
            <li className="nav-item">
              <a
                data-bs-toggle="collapse"
                href="#installation"
                className={`nav-link ${isMenuOpen('installation') ? '' : 'collapsed'}`}
                aria-expanded={isMenuOpen('installation')}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu('installation');
                }}
              >
                <i className="fas fa-home" />
                <p>First Job Propul'Sor</p>
                <span className="caret" />
              </a>
              <div className={`collapse ${isMenuOpen('installation') ? 'show' : ''}`} id="installation">
                <ul className="nav nav-collapse">
                  <li>
                    <Link
                      href="/dashboard/installation"
                      className={`nav-link ${isActive('/dashboard/installation') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Guide d'Installation</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/installation/logement"
                      className={`nav-link ${isActive('/dashboard/installation/logement') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Recherche Logement</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/installation/administratif"
                      className={`nav-link ${isActive('/dashboard/installation/administratif') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Démarches Administratives</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Menu Carrière */}
            <li className="nav-item">
              <a
                data-bs-toggle="collapse"
                href="#carriere"
                className={`nav-link ${isMenuOpen('carriere') ? '' : 'collapsed'}`}
                aria-expanded={isMenuOpen('carriere')}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu('carriere');
                }}
              >
                <i className="fas fa-briefcase" />
                <p>Enterprise Integration</p>
                <span className="caret" />
              </a>
              <div className={`collapse ${isMenuOpen('carriere') ? 'show' : ''}`} id="carriere">
                <ul className="nav nav-collapse">
                  <li>
                    <Link
                      href="/dashboard/carriere"
                      className={`nav-link ${isActive('/dashboard/carriere') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Mon Profil Professionnel</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/carriere/cv"
                      className={`nav-link ${isActive('/dashboard/carriere/cv') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Générateur de CV</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/carriere/entretiens"
                      className={`nav-link ${isActive('/dashboard/carriere/entretiens') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Préparation Entretiens</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/carriere/reseau"
                      className={`nav-link ${isActive('/dashboard/carriere/reseau') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Réseautage</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Section Ressources */}
            <li className="nav-section">
              <span className="sidebar-mini-icon">
                <i className="fa fa-ellipsis-h" />
              </span>
              <h4 className="text-section">Ressources</h4>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/ressources"
                className={`nav-link ${isActive('/dashboard/ressources') ? 'active' : ''}`}
              >
                <i className="fas fa-book" />
                <p>Guides & Ressources</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/forum"
                className={`nav-link ${isActive('/dashboard/forum') ? 'active' : ''}`}
              >
                <i className="fas fa-comments" />
                <p>Forum Communautaire</p>
                <span className="badge badge-success">New</span>
              </Link>
            </li>

            {/* Section Mon Compte */}
            <li className="nav-section">
              <span className="sidebar-mini-icon">
                <i className="fa fa-ellipsis-h" />
              </span>
              <h4 className="text-section">Mon Compte</h4>
            </li>

            {/* Menu Compte */}
            <li className="nav-item">
              <a
                data-bs-toggle="collapse"
                href="#compte"
                className={`nav-link ${isMenuOpen('compte') ? '' : 'collapsed'}`}
                aria-expanded={isMenuOpen('compte')}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu('compte');
                }}
              >
                <i className="fas fa-user" />
                <p>Mon Profil</p>
                <span className="caret" />
              </a>
              <div className={`collapse ${isMenuOpen('compte') ? 'show' : ''}`} id="compte">
                <ul className="nav nav-collapse">
                  <li>
                    <Link
                      href="/dashboard/profil"
                      className={`nav-link ${isActive('/dashboard/profil') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Informations Personnelles</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/profil/parametres"
                      className={`nav-link ${isActive('/dashboard/profil/parametres') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Paramètres</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/profil/securite"
                      className={`nav-link ${isActive('/dashboard/profil/securite') ? 'active' : ''}`}
                    >
                      <span className="sub-item">Sécurité</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/support"
                className={`nav-link ${isActive('/dashboard/support') ? 'active' : ''}`}
              >
                <i className="fas fa-headset" />
                <p>Support</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/logout" className="nav-link text-danger">
                <i className="fas fa-sign-out-alt" />
                <p>Déconnexion</p>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}