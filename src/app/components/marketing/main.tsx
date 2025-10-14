import Link from "next/link";
import Image from 'next/image';

export default function Main() {
    return (
        <>
                {/* <!-- Hero Section Réadaptée --> */}
                <section id="hero" className="hero section">
                    <div className="hero-container">
                        <div className="hero-content">
                            <h1>Votre Succès en France Commence Ici</h1>
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
                                    <h3>Admission Success</h3>
                                    <p>Évaluation des chances et accompagnement Campus France</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="highlight-item">
                                    <div className="icon">
                                        <i className="bi bi-house-fill"></i>
                                    </div>
                                    <h3> Installation en France</h3>
                                    <p>Guide complet des démarches administratives et logement</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="highlight-item">
                                    <div className="icon">
                                        <i className="bi bi-briefcase-fill"></i>
                                    </div>
                                    <h3>Intégration Pro</h3>
                                    <p>Job étudiant et premier emploi post-diplôme</p>
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
                                            <li>Évaluation précise de vos chances d'admission</li>
                                            <li>Guidage pas-à-pas Campus France</li>
                                            <li>Vérification intelligente des documents</li>
                                            <li>Calendrier personnalisé des délais</li>
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
                <section id="processus" className="processus section">
                    <div className="container">
                        <div className="values-section mb-5">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="values-header text-center mb-4">
                                        <span className="">Notre Méthodologie</span>
                                        <h2 className="section-heading">Notre Processus en 3 Étapes</h2>
                                        <p className="section-subtitle">Un accompagnement structuré de votre projet jusqu'à l'intégration professionnelle en France</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-0">

                                {/* <!-- Étape 1 : Évaluation --> */}
                                <div className="col-lg-4">
                                    <div className="value-block evaluation-step">
                                        <div className="value-number">01</div>
                                        <div className="value-icon">
                                            <i className="bi bi-clipboard-data"></i>
                                        </div>
                                        <h3>Évaluation Initiale Intelligente</h3>
                                        <p>Notre IA analyse votre profil académique et calcule vos chances d'admission dans les établissements français. Obtenez une évaluation précise et des recommandations personnalisées.</p>
                                        <div className="step-features">
                                            <span className="feature-tag">Analyse IA</span>
                                            <span className="feature-tag">Évaluation des chances</span>
                                            <span className="feature-tag">Recommandations</span>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Étape 2 : Accompagnement --> */}
                                <div className="col-lg-4">
                                    <div className="value-block accompaniment-step">
                                        <div className="value-number">02</div>
                                        <div className="value-icon">
                                            <i className="bi bi-compass"></i>
                                        </div>
                                        <h3>Accompagnement Administratif</h3>
                                        <p>Guidage pas-à-pas dans le labyrinthe Campus France. Vérification de vos documents, calendrier personnalisé et assistance pour chaque démarche administrative.</p>
                                        <div className="step-features">
                                            <span className="feature-tag">Campus France</span>
                                            <span className="feature-tag">Vérification documents</span>
                                            <span className="feature-tag">Calendrier</span>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Étape 3 : Intégration --> */}
                                <div className="col-lg-4">
                                    <div className="value-block integration-step">
                                        <div className="value-number">03</div>
                                        <div className="value-icon">
                                            <i className="bi bi-briefcase"></i>
                                        </div>
                                        <h3>Intégration Professionnelle</h3>
                                        <p>De l'installation en France à votre premier emploi. Logement, réseautage, CV français et préparation aux entretiens pour une intégration réussie.</p>
                                        <div className="step-features">
                                            <span className="feature-tag">Logement</span>
                                            <span className="feature-tag">Réseautage</span>
                                            <span className="feature-tag">Carrière</span>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            {/* <!-- CTA Section --> */}


                        </div>
                    </div>
                </section>
                <section id="testimonials" className="testimonials section light-background">
                    <div className="container section-title">
                        <h2>Ils Nous Font Confiance</h2>
                        <p>Découvrez les expériences de nos étudiants accompagnés</p>
                    </div>

                    <div className="container">
                        <div className="testimonials-slider swiper init-swiper">
                            <div className="swiper-wrapper">

                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <h2>De Abidjan à HEC Paris</h2>
                                                <p>
                                                    "Grâce à l'évaluation précise de Campus Propul'Sor, j'ai pu cibler les écoles correspondant à mon profil. Leur accompagnement pour Campus France a été crucial pour mon admission à HEC."
                                                </p>
                                                <div className="profile d-flex align-items-center">
                                                    <img src="/assets/marketing/img/person/person-m-7.webp" className="profile-img" alt="" />
                                                    <div className="profile-info">
                                                        <h3>Kevin D.</h3>
                                                        <span>Étudiant à HEC Paris</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="swiper-slide">
                                    <div className="testimonial-item">
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <h2>Une Installation Sans Stress</h2>
                                                <p>
                                                    "L'assistant administratif m'a sauvé la vie ! Trouver un logement sans garant, ouvrir un compte bancaire... Tout était expliqué clairement."
                                                </p>
                                                <div className="profile d-flex align-items-center">
                                                    <img src="/assets/marketing/img/person/person-f-8.webp" className="profile-img" alt="" />
                                                    <div className="profile-info">
                                                        <h3>Marie T.</h3>
                                                        <span>Étudiante à Lyon 2</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="values-section mb-5">
                            <div className="row mt-5">
                                <div className="col-lg-12 text-center">
                                    <div className="process-cta">
                                        <h4>Prêt à Démarrer Votre Aventure ?</h4>
                                        <p>Rejoignez notre plateforme et bénéficiez d'un accompagnement personnalisé à chaque étape</p>
                                        <a href="/evaluation" className="">
                                            Commencer Mon Évaluation Gratuite
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

         
        
        </>
    );
}