


import './home.css';

export default function Home() {
  return (

    <>
      <main className="main">
        {/* <!-- Hero Section Réadaptée --> */}
        <section id="hero" className="hero section">
          <div className="hero-container">
            <div className="hero-content">
              <h1>Votre Succès universitaire et professionnelle en France Commence Ici</h1>
              <p>De l'admission universitaire à l'intégration professionnelle, notre IA vous guide à chaque étape de votre parcours vers la France.</p>
              <div className="cta-buttons">
                <a href="/admission" className="btn-apply">Évaluer mon profil</a>
                <a href="/services" className="btn-tour">Découvrir nos services</a>
              </div>
              <div className="announcement">
                <div className="announcement-badge">Nouveau</div>
                <p>Rentrée 2026- Démarrez votre évaluation d'admission dès maintenant</p>
              </div>
            </div>
          </div>

          <div className="highlights-container container">
            <div className="row gy-4">
              <div className="col-md-4">
                <div className="highlight-item">
                  <div className="icon">
                    <i className="bi bi-mortarboard-fill"></i>
                  </div>
                  <h3>Admission Success & Administrative route</h3>
                  <p>Préparer et réussir mon admission dans un établissement d'enseignement supérieur en France</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="highlight-item">
                  <div className="icon">
                    <i className="bi bi-house-fill"></i>
                  </div>
                  <h3>First Job Propul'Sor</h3>
                  <p>Mon installation en France /Mon job étudiant et mon premier emploi post-diplômation</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="highlight-item">
                  <div className="icon">
                    <i className="bi bi-briefcase-fill"></i>
                  </div>
                  <h3>Enterprise Integration Propul'Sor</h3>
                  <p>Module d'intégration sociale et professionnelle</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- About Section Réadaptée --> */}
        <section id="about" className="about section">
          <div className="container">
            <div className="row gy-5">
              <div className="col-lg-6">
                <div className="content">
                  <h3>Votre Accompagnement Personnalisé vers la France</h3>
                  <p><strong>Campus & Professional Propul'Sor</strong> révolutionne le parcours des étudiants ivoiriens souhaitant étudier et travailler en France. Notre plateforme intelligente vous guide à travers les complexités administratives, culturelles et professionnelles.</p>

                  <div className="stats-row">
                    <div className="stat-item">
                      <div className="number">3</div>
                      <div className="label">Services Intégrés</div>
                    </div>
                    <div className="stat-item">
                      <div className="number">100%</div>
                      <div className="label">Guidé par IA</div>
                    </div>
                    <div className="stat-item">
                      <div className="number">24/7</div>
                      <div className="label">Assistance</div>
                    </div>
                  </div>

                  <div className="mission-statement">
                    <p><em>"Notre mission : démocratiser l'accès aux études en France et garantir une intégration professionnelle réussite grâce à l'intelligence artificielle."</em></p>
                  </div>

                  <a href="/about" className="btn-learn-more">
                    Notre Histoire
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="image-wrapper">
                  <img src="/assets/marketing/img/education/campus-5.webp" alt="Étudiants en France" className="img-fluid" />
                  <div className="experience-badge">
                    <div className="years">IA</div>
                    <div className="text">Assistante Intelligente</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Services Section (Remplace Featured Programs) --> */}
        {/* <!-- Nos Services Spécialisés --> */}
        <section id="services" className="services section">
          <div className="container">
            <div className="facility-categories">
              <div className="categories-header">
                <h2>Nos Services Spécialisés</h2>
                <p>Trois parcours complets pour réussir votre projet d'études et de carrière en France, guidés par l'intelligence artificielle.</p>
              </div>

              <div className="categories-grid">

                {/* <!-- Service 1 : Admission Success --> */}
                <div className="facility-card academic-spaces">
                  <div className="card-image">
                    <img src="/assets/marketing/img/education/campus-4.webp" alt="Admission Success" className="img-fluid" />
                    <div className="service-badge">
                      <span>Évaluation IA</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="category-icon">
                      <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <h3>Admission Success & Administrative Route</h3>
                    <ul className="facility-features">
                      <li>Évaluation de vos chances d'admission dans un établissement supérieur </li>
                      <li>Assistance automatique pour la création et la soumission de votre dossier sur "Campus France"</li>
                      <li>Génération automatique de votre projet Professionnel et d'Etude, de votre CV et de votre lettre de motivation assistée par l'Intelligence Artificielle pour vos candidatures aux établissements supérieurs</li>
                      <li>Préparation aux entretiens de "Campus France" et aux entretiens pour vos admissions dans les établissements supérieurs</li>
                      <li>Recherche de bourses d'etudes</li>
                    </ul>
                    <div className="service-progress">
                      <div className="progress-text">
                        <span>Vous suivrez votre progression en temps réel:</span>
                        <span>100%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <a href="/dashboard/admission" className="facility-link">Commencer l'évaluation</a>
                  </div>
                </div>

                {/* <!-- Service 2 : First Job Propul'Sor --> */}
                <div className="facility-card sports-wellness">
                  <div className="card-image">
                    <img src="/assets/marketing/img/education/campus-5.webp" alt="Installation France" className="img-fluid" />
                    <div className="service-badge">
                      <span>Assistant Vidéo</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="category-icon">
                      <i className="bi bi-house-check"></i>
                    </div>
                    <h3>First Job Propul'Sor</h3>
                    <ul className="facility-features">
                      <li>Guide complet des démarches administratives</li>
                      <li>Solutions logement sans garant local</li>
                      <li>Assistant vidéo IA pour vos démarches</li>
                      <li>Support 24/7 pour votre installation</li>
                    </ul>
                    <div className="service-progress">
                      <div className="progress-text">
                        <span>Votre progression :</span>
                        <span>0%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <a href="/dashboard/installation" className="facility-link">Démarrer mon installation</a>
                  </div>
                </div>

                {/* <!-- Service 3 : Enterprise Integration --> */}
                <div className="facility-card student-life">
                  <div className="card-image">
                    <img src="/assets/marketing/img/education/campus-1.webp" alt="Intégration Pro" className="img-fluid" />
                    <div className="service-badge">
                      <span>Coaching Pro</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="category-icon">
                      <i className="bi bi-briefcase"></i>
                    </div>
                    <h3>Enterprise Integration Propul'Sor</h3>
                    <ul className="facility-features">
                      <li>Génération de CV adapté au marché français</li>
                      <li>Préparation aux entretiens en entreprise</li>
                      <li>Coaching d'intégration culturelle</li>
                      <li>Réseautage avec les professionnels</li>
                    </ul>
                    <div className="service-progress">
                      <div className="progress-text">
                        <span>Votre progression :</span>
                        <span>100%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <a href="/dashboard/emploi" className="facility-link">Boostez votre carrière</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* <!-- Processus Section (Remplace Students Life) --> */}
        {/* <!-- Notre Processus en 3 Étapes --> */}

        <section id="partners" className="partners section light-background">
          <div className="container section-title">
              <h2>Nos Partenaires Universitaires & Grandes Écoles</h2>
            <div className="row gy-5">
              <div className="col-lg-6">
            
              <p>Nous pouvons signer un parteneriat avec vous pour accompagner vos étudiants: <br /> dans leur processus d'admission dans un établissement supérieur en France <br />dans le suivi de leur démarche administrative <br />dans la recherche de leur job étudiant/premier emploi en CDI <br />
              et dans leur intégration socio-professionnelle
              </p>
              </div>
              <div className="col-lg-6">
                <p> Les avantages de notre partenariat avec vous:
                  <br />un retour de commission sur le nombre d'étudiant utilisant notre plateforme
                  <br /> Une visibilité accrue de votre école sur notre plateforme
                  <br />une valeur ajoutée auprès de vos étudiants du fait que notre plateforme les accompagnent dans la réalisation de leurs rêves d'etudier et de s'installer en France 
                </p>
              </div>
              </div>
            
          </div>

          {/* <div className="container">
            <div className="partners-slider-container">
              {/* <!-- Premier ensemble de logos --> */}
            {/*  <div className="partners-slider-track">
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/hec-paris-logo.png" alt="HEC Paris" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/sorbonne-logo.png" alt="Sorbonne Université" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/polytechnique-logo.png" alt="École Polytechnique" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/ens-logo.jpg" alt="ENS Paris" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/centralesupelec-logo.png" alt="CentraleSupélec" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/essec-logo.jpg" alt="ESSEC Business School" className="img-fluid" />
                </div>
                {/* <!-- Duplication pour l'animation continue --> */}
               {/* <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/hec-paris-logo.png" alt="HEC Paris" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/sorbonne-logo.png" alt="Sorbonne Université" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/polytechnique-logo.jpg" alt="École Polytechnique" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/ens-logo.jpg" alt="ENS Paris" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/centralesupelec-logo.png" alt="CentraleSupélec" className="img-fluid" />
                </div>
                <div className="partner-logo-item">
                  <img src="/assets/marketing/img/partners/essec-logo.jpg" alt="ESSEC Business School" className="img-fluid" />
                </div>
              </div>
            </div>
          </div> */}

          <div className="container">
            <div className="values-section mb-5">
              <div className="row mt-5">
                <div className="col-lg-12 text-center">
                  <div className="process-cta">
                    <h4>Prêt à réaliser votre Rêve d'étudier et vous installer en France ?</h4>
                    {/* <p>Rejoignez notre plateforme et bénéficiez d'un accompagnement personnalisé à chaque étape </p> */}
                     <p> Commencez par évaluer vos chances d'admissions dans les établissements très prèstigieux dits de rang A, <br />dans les établissements prèstigieux dits de rang B et dans les établissements ordinaires dits de rang C</p>
                  
                    <a href="/evaluation" className="btn btn-primary btn-lg">
                      Commencer Mon Évaluation Gratuite
                      <i className="bi bi-arrow-right ms-2"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      

      </main>

    </>

  );
}
