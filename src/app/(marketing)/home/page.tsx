

'use client';

import './home.css';
import { useModal } from '@/app/context/ModalContext';


export default function Home() {
  const { openRegisterModal, openLoginModal } = useModal();
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
                   1
                  </div>
                  <h3>Admission Success & Administrative route</h3>
                  <p>Préparer et réussir mon admission dans un établissement d'enseignement supérieur en France</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="highlight-item">
                  <div className="icon">
                    2
                  </div>
                  <h3>First Job Propul'Sor</h3>
                  <p>Mon installation en France /Mon job étudiant et mon premier emploi post-diplômation</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="highlight-item">
                  <div className="icon">
                   3
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
                  {/* <div className="card-image">
                    <img src="/assets/marketing/img/education/campus-4.webp" alt="Admission Success" className="img-fluid" />
                    <div className="service-badge">
                      <span>Évaluation IA</span>
                    </div>
                  </div> */}
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
                    {/* <div className="service-progress">
                      <div className="progress-text">
                        <span>Vous suivrez votre progression en temps réel:</span>
                        <span>100%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '100%' }}></div>
                      </div>
                    </div> */}
                    <a onClick={openLoginModal} className="facility-link">Commencer l'évaluation</a>
                  </div>
                </div>

                {/* <!-- Service 2 : First Job Propul'Sor --> */}
                <div className="facility-card sports-wellness">
                  {/* <div className="card-image">
                    <img src="/assets/marketing/img/education/campus-5.webp" alt="Installation France" className="img-fluid" />
                    <div className="service-badge">
                      <span>Assistant Vidéo</span>
                    </div>
                  </div> */}
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
                    {/* <div className="service-progress">
                      <div className="progress-text">
                        <span>Votre progression :</span>
                        <span>0%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '0%' }}></div>
                      </div>
                    </div> */}
                    <a onClick={openLoginModal} className="facility-link">Démarrer mon installation</a>
                  </div>
                </div>

                {/* <!-- Service 3 : Enterprise Integration --> */}
                <div className="facility-card student-life">
                  {/* <div className="card-image">
                    <img src="/assets/marketing/img/education/campus-1.webp" alt="Intégration Pro" className="img-fluid" />
                    <div className="service-badge">
                      <span>Coaching Pro</span>
                    </div>
                  </div> */}
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
                    {/* <div className="service-progress">
                      <div className="progress-text">
                        <span>Votre progression :</span>
                        <span>100%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '100%' }}></div>
                      </div>
                    </div> */}
                    <a onClick={openLoginModal} className="facility-link">Boostez votre carrière</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* <!-- Processus Section (Remplace Students Life) --> */}
        {/* <!-- Notre Processus en 3 Étapes --> */}

        {/* <section id="partners" className="partners section light-background">
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
        </section> */}



        {/* <!-- Partners Section --> */}
        <section id="call-to-action" className="call-to-action section light-background">

          <div className="container margin-call">


            <div className="badge">
              <i className="bi bi-handshake-fill"></i>
              <span>Partenariat Stratégique</span>
            </div>

            <h2>Devenez Partenaire de Notre Réseau Universitaire</h2>

            <p>Collaborez avec nous pour offrir à vos étudiants un accompagnement complet vers la France et bénéficiez d'avantages exclusifs.</p>
            <div className="row ">

              <div className="col-lg-6">
                <div className="partnership-benefits">
                  <div className="benefit-group">
                    <h4>Nos engagements envers vos étudiants :</h4>
                    <div className="numbered-list">
                      <div className="list-item">
                        <div className="item-number">1</div>
                        <div className="item-content">
                          <strong>Accompagnement admission</strong> dans les établissements supérieurs en France
                        </div>
                      </div>
                      <div className="list-item">
                        <div className="item-number">2</div>
                        <div className="item-content">
                          <strong>Suivi personnalisé</strong> des démarches administratives pré-et-post admission
                        </div>
                      </div>
                      <div className="list-item">
                        <div className="item-number">3</div>
                        <div className="item-content">
                          <strong>Recherche optimisée</strong> de job étudiant et premier emploi en CDI
                        </div>
                      </div>
                      <div className="list-item">
                        <div className="item-number">4</div>
                        <div className="item-content">
                          <strong>Intégration réussie</strong> socio-professionnelle en entreprise
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="benefit-group mt-4">
                  <h4>Avantages pour votre établissement :</h4>
                  <div className="numbered-list">
                    <div className="list-item">
                      <div className="item-number">1</div>
                      <div className="item-content">
                        <strong>Commission attractive</strong> sur le nombre d'étudiants utilisant notre plateforme
                      </div>
                    </div>
                    <div className="list-item">
                      <div className="item-number">2</div>
                      <div className="item-content">
                        <strong>Visibilité accrue</strong> de votre école sur notre plateforme
                      </div>
                    </div>
                    <div className="list-item">
                      <div className="item-number">3</div>
                      <div className="item-content">
                        <strong>Valeur ajoutée</strong> auprès de vos étudiants grâce à notre accompagnement
                      </div>
                    </div>
                    <div className="list-item">
                      <div className="item-number">4</div>
                      <div className="item-content">
                        <strong>réalisation </strong> de leurs rêves d'etudier et de s'installer en France
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons mt-4">
                <a href="/partenaire" className="btn-primary">Devenir Partenaire</a>
                <a href="/contact" className="btn-secondary">
                  <span>Nous Contacter</span>
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>


            {/* <div className="col-lg-6">
                <div className="visual-section">
                  <div className="main-image-container">
                    <img src="./assets/marketing/img/education/showcase-7.webp" alt="Réunion de partenariat" className="main-image" />
                    <div className="overlay-gradient"></div>
                  </div>

                  <div className="feature-cards">
                    <div className="feature-card achievement">
                      <div className="icon">
                        <i className="bi bi-graph-up-arrow"></i>
                      </div>
                      <div className="content">
                        <h4>Croissance Mutuelle</h4>
                        <p>Développez votre réseau d'étudiants internationaux</p>
                      </div>
                    </div>

                    <div className="feature-card flexibility">
                      <div className="icon">
                        <i className="bi bi-award"></i>
                      </div>
                      <div className="content">
                        <h4>Excellence Académique</h4>
                        <p>Attirez les meilleurs profils étudiants</p>
                      </div>
                    </div>

                    <div className="feature-card community">
                      <div className="icon">
                        <i className="bi bi-globe"></i>
                      </div>
                      <div className="content">
                        <h4>Réseau International</h4>
                        <p>Rejoignez notre communauté d'établissements prestigieux</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}


            <div className="values-section mb-5">
              <div className="row mt-5">
                <div className="col-lg-12 text-center">
                  <div className="process-cta">
                    <h4>Prêt à réaliser votre Rêve d'étudier et vous installer en France ?</h4>
                    {/* <p>Rejoignez notre plateforme et bénéficiez d'un accompagnement personnalisé à chaque étape </p> */}
                    <p> Commencez par évaluer vos chances d'admissions dans les établissements très prèstigieux dits de rang A, <br />dans les établissements prèstigieux dits de rang B et dans les établissements ordinaires dits de rang C</p>

                    <a href="/evaluation" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Commencer Mon Évaluation Gratuite
                      <i className="bi bi-arrow-right ms-2"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </section>

        {/* <section id="partners" className="partners section light-background"> */}
          {/* <div className="container section-title">
            <h2>Nos Partenaires Universitaires & Grandes Écoles</h2>
            

          </div>  */}

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


        {/* </section> */}

      </main >

    </>

  );
}
