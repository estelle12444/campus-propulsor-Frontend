'use client';


export default function Partenaire() {

    return (
        <>
            <main className="main">

                {/* <!-- Page Title --> */}
                <div className="page-title">
                    <div className="heading">
                        <div className="container">
                            <div className="row d-flex justify-content-center text-center">
                                <div className="col-lg-8">
                                    <h1 className="heading-title">Devenir Partenaire</h1>
                                    <p className="mb-0">
                                        Rejoignez notre réseau d'établissements partenaires et offrez à vos étudiants
                                        un accompagnement complet vers la France. Ensemble, construisons des parcours de réussite.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav className="breadcrumbs">
                        <div className="container">
                            <ol>
                                <li><a href="index.html">Accueil</a></li>
                                <li className="current">Devenir Partenaire</li>
                            </ol>
                        </div>
                    </nav>
                </div>{/* <!-- End Page Title --> */}

                {/* <!-- Partners Section --> */}
                <section id="partners" className="admissions section">

                    <div className="container">

                        <div className="admission-hero">
                            <div className="row align-items-center">
                                <div className="col-lg-8">
                                    <div className="hero-content">
                                        <h2>Partenariat Gagnant-Gagnant</h2>
                                        <p>Collaborez avec Campus & Professional Propul'Sor pour accompagner vos étudiants dans leur projet d'études en France. Notre plateforme intelligente révolutionne l'accompagnement des étudiants ivoiriens.</p>
                                        <div className="hero-stats">
                                            <div className="stat-item">
                                                <span className="stat-number">50+</span>
                                                <span className="stat-label">Établissements Partenaires</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">95%</span>
                                                <span className="stat-label">Taux de Réussite</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">3</span>
                                                <span className="stat-label">Services Intégrés</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="hero-image">
                                        <img src="./assets/marketing/img/education/campus-8.webp" className="img-fluid" alt="Partenariat Universitaire" />
                                        <div className="floating-badge">
                                            <i className="bi bi-handshake"></i>
                                            <span>Rejoignez Notre Réseau</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="application-timeline">
                            <div className="timeline-header">
                                <h3>Processus de Partenariat</h3>
                                <p>Quatre étapes simples pour devenir partenaire</p>
                            </div>
                            <div className="timeline-container">
                                <div className="timeline-item">
                                    <div className="timeline-marker">
                                        <i className="bi bi-file-earmark-text"></i>
                                    </div>
                                    <div className="timeline-content">
                                        <h4>Demande de Partenariat</h4>
                                        <p>Soumettez votre demande en ligne avec les informations de votre établissement. Notre équipe étudiera votre profil sous 48h.</p>
                                        <span className="timeline-duration">24-48h</span>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker">
                                        <i className="bi bi-people"></i>
                                    </div>
                                    <div className="timeline-content">
                                        <h4>Rencontre Équipe</h4>
                                        <p>Échange avec nos responsables partenariats pour définir les modalités de collaboration et les objectifs communs.</p>
                                        <span className="timeline-duration">3-5 jours</span>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker">
                                        <i className="bi bi-file-earmark-check"></i>
                                    </div>
                                    <div className="timeline-content">
                                        <h4>Signature Convention</h4>
                                        <p>Finalisation et signature de la convention de partenariat définissant les engagements réciproques.</p>
                                        <span className="timeline-duration">1 semaine</span>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-marker">
                                        <i className="bi bi-rocket"></i>
                                    </div>
                                    <div className="timeline-content">
                                        <h4>Lancement Collaboration</h4>
                                        <p>Intégration dans notre réseau et début de l'accompagnement conjoint de vos étudiants.</p>
                                        <span className="timeline-duration">Immédiat</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row gy-5 mt-4">
                            {/* <!-- Colonne : Nos engagements envers vos étudiants --> */}
                            <div className="col-lg-6">
                                <div className="requirements-checklist">
                                    <h3>Nos Engagements envers vos Étudiants</h3>
                                    <div className="checklist-grid">

                                        <div className="checklist-item">
                                            <div className="check-icon">
                                                <i className="bi bi-check2"></i>
                                            </div>
                                            <div className="check-content">
                                                <h5>Accompagnement à l’Admission</h5>
                                                <p>Suivi complet du processus d’admission dans un établissement supérieur en France.</p>
                                            </div>
                                        </div>

                                        <div className="checklist-item">
                                            <div className="check-icon">
                                                <i className="bi bi-check2"></i>
                                            </div>
                                            <div className="check-content">
                                                <h5>Suivi Administratif Personnalisé</h5>
                                                <p>Assistance dans toutes les démarches administratives liées à l’installation en France.</p>
                                            </div>
                                        </div>

                                        <div className="checklist-item">
                                            <div className="check-icon">
                                                <i className="bi bi-check2"></i>
                                            </div>
                                            <div className="check-content">
                                                <h5>Job Étudiant & Premier Emploi</h5>
                                                <p>Accompagnement dans la recherche de job étudiant et du premier emploi en CDI.</p>
                                            </div>
                                        </div>

                                        <div className="checklist-item">
                                            <div className="check-icon">
                                                <i className="bi bi-check2"></i>
                                            </div>
                                            <div className="check-content">
                                                <h5>Intégration Socio-Professionnelle</h5>
                                                <p>Facilitation de l’intégration professionnelle et sociale de vos étudiants en France.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="international-note">
                                        <i className="bi bi-graph-up-arrow"></i>
                                        <div>
                                            <h6>Un Accompagnement Complet</h6>
                                            <p>De l’admission à l’intégration professionnelle, nous soutenons vos étudiants à chaque étape de leur parcours.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Colonne : Avantages du partenariat --> */}
                            <div className="col-lg-6">
                                <div className="tuition-overview">
                                    <h3>Avantages du Partenariat</h3>
                                    <div className="tuition-cards">

                                        {/* <!-- Avantages institutionnels --> */}
                                        <div className="tuition-card domestic">
                                            <div className="card-header">
                                                <h4>Visibilité & Rayonnement</h4>
                                                <span className="program-type">Avantages Institutionnels</span>
                                            </div>
                                            <div className="pricing-details">
                                                <div className="price-item">
                                                    <span className="label">Présence sur notre plateforme</span>
                                                    <span className="amount">Visibilité accrue</span>
                                                </div>
                                                <div className="price-item">
                                                    <span className="label">Valorisation de votre école</span>
                                                    <span className="amount">Image renforcée</span>
                                                </div>
                                                <div className="price-item">
                                                    <span className="label">Valeur ajoutée pour vos étudiants</span>
                                                    <span className="amount">Accompagnement complet</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <!-- Avantages financiers --> */}
                                        <div className="tuition-card international">
                                            <div className="card-header">
                                                <h4>Retour sur Partenariat</h4>
                                                <span className="program-type">Avantages Financiers</span>
                                            </div>
                                            <div className="pricing-details">
                                                <div className="price-item">
                                                    <span className="label">Commission sur étudiants</span>
                                                    <span className="amount">Basée sur l’utilisation</span>
                                                </div>
                                                <div className="price-item">
                                                    <span className="label">Partenariat durable</span>
                                                    <span className="amount">Mutuellement bénéfique</span>
                                                </div>
                                                <div className="price-item">
                                                    <span className="label">Croissance commune</span>
                                                    <span className="amount">Réussite étudiante</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="financial-support">
                                        <h5>Engagement Commun</h5>
                                        <p>
                                            En rejoignant notre réseau, votre établissement bénéficie d’un retour de commission selon le nombre d’étudiants accompagnés,
                                            d’une visibilité accrue sur notre plateforme et d’une réelle valeur ajoutée auprès de vos étudiants,
                                            soutenus dans la concrétisation de leur rêve d’étudier et de s’installer en France.
                                        </p>
                                        <a href="#contact" className="support-link">
                                            Découvrir les Détails du Partenariat <i className="bi bi-arrow-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="deadlines-showcase mt-5">
                            <div className="showcase-header">
                                <h3>Types de Partenariat</h3>
                                <p>Choisissez le mode de collaboration qui correspond le mieux à votre établissement</p>
                            </div>
                            <div className="deadlines-slider">
                                <div className="deadline-card priority">
                                    <div className="date-badge">Basique</div>
                                    <h4>Partenariat Standard</h4>
                                    <p>Accompagnement de base pour vos étudiants avec commission sur les services utilisés</p>
                                    <div className="card-footer">15% Commission</div>
                                </div>
                                <div className="deadline-card">
                                    <div className="date-badge">Privilège</div>
                                    <h4>Partenariat Privilégié</h4>
                                    <p>Visibilité accrue et accompagnement premium avec services prioritaires</p>
                                    <div className="card-footer">20% Commission</div>
                                </div>
                                <div className="deadline-card">
                                    <div className="date-badge">Exclusif</div>
                                    <h4>Partenariat Stratégique</h4>
                                    <p>Collaboration approfondie avec développement de programmes communs</p>
                                    <div className="card-footer">25% Commission</div>
                                </div>
                                <div className="deadline-card">
                                    <div className="date-badge">Sur Mesure</div>
                                    <h4>Partenariat Personnalisé</h4>
                                    <p>Solution adaptée à vos besoins spécifiques avec conditions négociables</p>
                                    <div className="card-footer">Négociable</div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-section mt-5" id="contact">
                            <div className="row align-items-center">
                                <div className="col-lg-7">
                                    <div className="contact-content">
                                        <h3>Demande de Partenariat</h3>
                                        <p>Prêt à rejoindre notre réseau ? Remplissez le formulaire ci-dessous et notre équipe partenariats vous contactera sous 24h pour discuter des modalités de collaboration.</p>
                                        <form action="forms/partnership.php" className="inquiry-form php-email-form">
                                            <div className="form-group-row">
                                                <div className="form-group">
                                                    <input type="text" name="name" placeholder="Nom de l'établissement*" required />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" name="contact" placeholder="Personne à contacter*" required />
                                                </div>
                                            </div>
                                            <div className="form-group-row">
                                                <div className="form-group">
                                                    <input type="email" name="email" placeholder="Email professionnel*" required />
                                                </div>
                                                <div className="form-group">
                                                    <input type="tel" name="phone" placeholder="Téléphone" />
                                                </div>
                                            </div>
                                            <div className="form-group-row">
                                                <div className="form-group">
                                                    <select name="type" required>
                                                        <option selected disabled>Type d'établissement*</option>
                                                        <option>Université</option>
                                                        <option>Grande École</option>
                                                        <option>École Spécialisée</option>
                                                        <option>Institut</option>
                                                        <option>Autre</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <select name="partnership" required>
                                                        <option selected disabled>Type de partenariat souhaité*</option>
                                                        <option>Standard</option>
                                                        <option>Privilégié</option>
                                                        <option>Stratégique</option>
                                                        <option>Personnalisé</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group full-width">
                                                <textarea name="message" row="5" placeholder="Parlez-nous de votre établissement et de vos attentes..."></textarea>
                                            </div>
                                            <div className="form-actions">
                                                <div className="loading">Chargement</div>
                                                <div className="error-message"></div>
                                                <div className="sent-message">Votre demande a été envoyée. Merci !</div>
                                                <button type="submit" className="submit-btn">Envoyer la Demande</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-5">
                                    <div className="visit-invitation">
                                        <div className="visit-image">
                                            <img src="./assets/marketing/img/education/campus-8.webp" className="img-fluid" alt="Réunion Partenariat" loading="lazy" />
                                            {/* <div className="visit-overlay">
                                                <i className="bi bi-play-circle"></i>
                                                <span>Présentation Partenariat</span>
                                            </div> */}
                                        </div>
                                        <div className="visit-details">
                                            <h4>Rencontrez Notre Équipe</h4>
                                            <div className="visit-options">
                                                <div className="visit-option">
                                                    <i className="bi bi-camera-video"></i>
                                                    <div>
                                                        <span className="option-title">Visio-conférence</span>
                                                        <span className="option-detail">Présentation détaillée en ligne</span>
                                                    </div>
                                                </div>
                                                <div className="visit-option">
                                                    <i className="bi bi-calendar3"></i>
                                                    <div>
                                                        <span className="option-title">Rencontre Personnalisée</span>
                                                        <span className="option-detail">Échange avec nos responsables</span>
                                                    </div>
                                                </div>
                                                <div className="visit-option">
                                                    <i className="bi bi-file-earmark-text"></i>
                                                    <div>
                                                        <span className="option-title">Documentation</span>
                                                        <span className="option-detail">Convention type et présentation</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="contact-info">
                                                <p><i className="bi bi-envelope"></i> partenariats@campuspropulsor.com</p>
                                                <p><i className="bi bi-telephone"></i> +225 07 07 07 07 07</p>
                                            </div>
                                            <a href="#" className="schedule-btn">Planifier un Appel</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </section>{/* <!-- /Partners Section --> */}

            </main>
        </>
    );
}