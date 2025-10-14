"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function StudentDashboard() {
  const [progressData, setProgressData] = useState({
    admission: 25,
    installation: 10,
    carriere: 5,
    overall: 40
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'success',
      date: '2025-01-15',
      text: 'Évaluation d\'admission complétée',
      service: 'Admission Success'
    },
    {
      id: 2,
      type: 'info',
      date: '2025-01-14',
      text: 'Document Campus France téléchargé',
      service: 'Admission Success'
    },
    {
      id: 3,
      type: 'warning',
      date: '2025-01-12',
      text: 'Échéance dans 15 jours : Dépôt dossier',
      service: 'Admission Success'
    },
    {
      id: 4,
      type: 'primary',
      date: '2025-01-10',
      text: 'Profil professionnel mis à jour',
      service: 'Enterprise Integration'
    }
  ]);

  // Simulation de données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressData(prev => ({
        ...prev,
        overall: Math.min(100, prev.overall + 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="page-inner">
        {/* Header avec actions */}
        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
          <div>
            <h3 className="fw-bold mb-2">Bonjour, pascale 👋</h3>
            <h6 className="op-7 mb-2">Bienvenue sur votre tableau de bord Campus Propul'Sor</h6>
            <p className="text-muted">Votre progression globale : <strong>{progressData.overall}%</strong></p>
          </div>
          <div className="ms-md-auto py-2 py-md-0">
            <Link href="/admission" className="btn btn-label-info btn-round me-2">
              <i className="fas fa-rocket me-2"></i>
              Continuer mon parcours
            </Link>
            <Link href="/ressources" className="btn btn-primary btn-round">
              <i className="fas fa-book me-2"></i>
              Guides & Ressources
            </Link>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="row row-card-no-pd">
          {/* Admission Success */}
          <div className="col-12 col-sm-6 col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6><b>Admission Success</b></h6>
                    <p className="text-muted">Votre progression</p>
                  </div>
                  <h4 className="text-info fw-bold">{progressData.admission}%</h4>
                </div>
                <div className="progress progress-sm">
                  <div
                    className="progress-bar bg-info"
                    style={{ width: `${progressData.admission}%` }}
                    role="progressbar"
                    aria-valuenow={progressData.admission}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <p className="text-muted mb-0">Prochaine étape</p>
                  <p className="text-muted mb-0">Dossier Campus France</p>
                </div>
              </div>
            </div>
          </div>

          {/* First Job Propul'Sor */}
          <div className="col-12 col-sm-6 col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6><b>First Job Propul'Sor</b></h6>
                    <p className="text-muted">Préparation installation</p>
                  </div>
                  <h4 className="text-success fw-bold">{progressData.installation}%</h4>
                </div>
                <div className="progress progress-sm">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${progressData.installation}%` }}
                    role="progressbar"
                    aria-valuenow={progressData.installation}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <p className="text-muted mb-0">À commencer</p>
                  <p className="text-muted mb-0">Recherche logement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Integration */}
          <div className="col-12 col-sm-6 col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6><b>Enterprise Integration</b></h6>
                    <p className="text-muted">Préparation carrière</p>
                  </div>
                  <h4 className="text-warning fw-bold">{progressData.carriere}%</h4>
                </div>
                <div className="progress progress-sm">
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: `${progressData.carriere}%` }}
                    role="progressbar"
                    aria-valuenow={progressData.carriere}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <p className="text-muted mb-0">Prochaine étape</p>
                  <p className="text-muted mb-0">CV français</p>
                </div>
              </div>
            </div>
          </div>

          {/* Échéances */}
          <div className="col-12 col-sm-6 col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6><b>Échéances</b></h6>
                    <p className="text-muted">Prochain délai</p>
                  </div>
                  <h4 className="text-danger fw-bold">15j</h4>
                </div>
                <div className="progress progress-sm">
                  <div
                    className="progress-bar bg-danger"
                    style={{ width: '60%' }}
                    role="progressbar"
                    aria-valuenow="60"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <p className="text-muted mb-0">Dépôt dossier</p>
                  <p className="text-muted mb-0">30 Jan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Graphique de progression principale */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <div className="card-head-row">
                  <div className="card-title">Progression de Votre Parcours</div>
                  <div className="card-tools">
                    <Link href="/admission" className="btn btn-label-success btn-round btn-sm me-2">
                      <span className="btn-label">
                        <i className="fa fa-chart-line"></i>
                      </span>
                      Détails
                    </Link>
                    <button className="btn btn-label-info btn-round btn-sm">
                      <span className="btn-label">
                        <i className="fa fa-download"></i>
                      </span>
                      Exporter
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="chart-container" style={{ minHeight: '375px' }}>
                  {/* Placeholder pour le graphique */}
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-center">
                      <i className="fas fa-chart-bar fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">Graphique de progression</h5>
                      <p className="text-muted">Votre avancement sera affiché ici</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides et statistiques */}
          <div className="col-md-4">
            {/* Carte d'actions rapides */}
            <div className="card card-primary">
              <div className="card-header">
                <div className="card-head-row">
                  <div className="card-title">Actions Rapides</div>
                </div>
                <div className="card-category">Prochaines étapes recommandées</div>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <Link href="/admission" className="list-group-item list-group-item-action">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-university text-primary me-3"></i>
                      <div>
                        <h6 className="mb-1">Compléter l'évaluation</h6>
                        <small className="text-muted">Admission Success - 75% restant</small>
                      </div>
                    </div>
                  </Link>
                  <Link href="/admission/documents" className="list-group-item list-group-item-action">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-file-alt text-success me-3"></i>
                      <div>
                        <h6 className="mb-1">Télécharger documents</h6>
                        <small className="text-muted">Liste des pièces requises</small>
                      </div>
                    </div>
                  </Link>
                  <Link href="/carriere/cv" className="list-group-item list-group-item-action">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-file-contract text-warning me-3"></i>
                      <div>
                        <h6 className="mb-1">Créer mon CV français</h6>
                        <small className="text-muted">Générateur intelligent</small>
                      </div>
                    </div>
                  </Link>
                  <Link href="/installation" className="list-group-item list-group-item-action">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-home text-info me-3"></i>
                      <div>
                        <h6 className="mb-1">Guide d'installation</h6>
                        <small className="text-muted">Préparer mon arrivée</small>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="card mt-4">
              <div className="card-body">
                <div className="h1 fw-bold float-end text-primary">+25%</div>
                <h2 className="mb-2">3</h2>
                <p className="text-muted">Écoles ciblées</p>
                <div className="mt-3">
                  <small className="text-muted">EDHEC, GEM, SKEMA</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Activités récentes */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Activités Récentes</div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table align-items-center mb-0">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Service</th>
                        <th scope="col">Activité</th>
                        <th scope="col">Date</th>
                        <th scope="col">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map(activity => (
                        <tr key={activity.id}>
                          <td>
                            <span className={`badge badge-${activity.type}`}>
                              {activity.service}
                            </span>
                          </td>
                          <td>{activity.text}</td>
                          <td>{new Date(activity.date).toLocaleDateString('fr-FR')}</td>
                          <td>
                            <i className={`fas fa-circle text-${activity.type} me-2`}></i>
                            Terminé
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Écoles recommandées */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Écoles Recommandées</div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                    ED
                  </div>
                  <div className="flex-1">
                    <h6 className="fw-bold mb-1">EDHEC Business School</h6>
                    <small className="text-muted">Compatibilité: 85%</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success">Rang B</span>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="avatar bg-info text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                    GE
                  </div>
                  <div className="flex-1">
                    <h6 className="fw-bold mb-1">Grenoble École de Management</h6>
                    <small className="text-muted">Compatibilité: 82%</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success">Rang B</span>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="avatar bg-warning text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                    SK
                  </div>
                  <div className="flex-1">
                    <h6 className="fw-bold mb-1">SKEMA Business School</h6>
                    <small className="text-muted">Compatibilité: 78%</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success">Rang B</span>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <Link href="/admission" className="btn btn-primary btn-sm">
                    Voir toutes les recommandations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section échéances importantes */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="card-head-row">
                  <h4 className="card-title">Échéances Importantes</h4>
                  <div className="card-tools">
                    <button className="btn btn-icon btn-link btn-primary btn-xs">
                      <span className="fa fa-bell"></span>
                    </button>
                  </div>
                </div>
                <p className="card-category">
                  Dates critiques pour votre projet d'études en France
                </p>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="alert alert-warning">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                          <h6 className="alert-heading">Dépôt dossier Campus France</h6>
                          <p className="mb-0">Date limite: <strong>30 Janvier 2026</strong></p>
                          <small>Il reste 15 jours pour compléter votre dossier</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="alert alert-info">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-calendar-alt fa-2x me-3"></i>
                        <div>
                          <h6 className="alert-heading">Tests de langue</h6>
                          <p className="mb-0">Recommandé avant: <strong>15 Février 2026</strong></p>
                          <small>Prévoyez vos tests TOEFL/IELTS</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}