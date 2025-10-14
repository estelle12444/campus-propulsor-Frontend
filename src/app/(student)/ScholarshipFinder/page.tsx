'use client';

import { useState } from 'react';

interface Scholarship {
    id: string;
    name: string;
    organization: string;
    amount: string;
    deadline: string;
    eligibility: string[];
    matchScore: number;
    description: string;
    link: string;
}

export default function ScholarshipFinder() {
    const [userProfile, setUserProfile] = useState({
        niveauEtude: '',
        domaine: '',
        moyenne: '',
        situationFamiliale: '',
        revenus: '',
        paysOrigine: 'Côte d\'Ivoire'
    });

    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(false);

    const analyzeProfileAndFindScholarships = async () => {
        setLoading(true);

        // Simulation d'analyse IA - En production, appeler votre backend
        setTimeout(() => {
            const suggestedScholarships: Scholarship[] = [
                {
                    id: '1',
                    name: 'Bourse d\'Excellence du Gouvernement Français',
                    organization: 'Gouvernement Français',
                    amount: '15 000€/an',
                    deadline: '2025-03-15',
                    eligibility: [
                        'Moyenne supérieure à 14/20',
                        'Projet d\'études en France',
                        'Nationalité ivoirienne'
                    ],
                    matchScore: 85,
                    description: 'Bourse pour étudiants excellents des pays partenaires',
                    link: 'https://www.campusfrance.org'
                },
                {
                    id: '2',
                    name: 'Bourse Eiffel',
                    organization: 'Ministère de l\'Europe et des Affaires étrangères',
                    amount: 'Complète (frais + vie)',
                    deadline: '2025-01-08',
                    eligibility: [
                        'Master ou Doctorat',
                        'Moins de 30 ans pour le Master',
                        'Excellence académique'
                    ],
                    matchScore: 72,
                    description: 'Programme d\'excellence du gouvernement français',
                    link: 'https://www.campusfrance.org'
                },
                {
                    id: '3',
                    name: 'Bourse de la Francophonie',
                    organization: 'Organisation Internationale de la Francophonie',
                    amount: '10 000€/an',
                    deadline: '2025-02-20',
                    eligibility: [
                        'Pays membre de la Francophonie',
                        'Projet en lien avec le développement',
                        'Maîtrise du français'
                    ],
                    matchScore: 90,
                    description: 'Pour les étudiants francophones',
                    link: 'https://www.francophonie.org'
                }
            ];

            setScholarships(suggestedScholarships);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="scholarship-finder">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Profil pour les Bourses</h5>
                                    <p className="text-muted">L'IA analysera votre profil pour trouver les bourses les plus adaptées</p>

                                    <div className="mb-3">
                                        <label className="form-label">Niveau d'études visé</label>
                                        <select
                                            className="form-select"
                                            value={userProfile.niveauEtude}
                                            onChange={(e) => setUserProfile({ ...userProfile, niveauEtude: e.target.value })}
                                        >
                                            <option value="">Sélectionnez</option>
                                            <option value="licence">Licence</option>
                                            <option value="master">Master</option>
                                            <option value="doctorat">Doctorat</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Domaine d'études</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Informatique, Management, etc."
                                            value={userProfile.domaine}
                                            onChange={(e) => setUserProfile({ ...userProfile, domaine: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Moyenne générale</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="/20"
                                            min="10"
                                            max="20"
                                            step="0.1"
                                            value={userProfile.moyenne}
                                            onChange={(e) => setUserProfile({ ...userProfile, moyenne: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={analyzeProfileAndFindScholarships}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Analyse en cours...
                                            </>
                                        ) : (
                                            '🎯 Trouver mes bourses'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Bourses Recommandées</h5>

                                    {scholarships.length === 0 ? (
                                        <div className="text-center py-5">
                                            <div className="text-muted">
                                                Remplissez votre profil pour découvrir les bourses adaptées
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="scholarships-list">
                                            {scholarships.map(scholarship => (
                                                <div key={scholarship.id} className="scholarship-item border rounded p-3 mb-3">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div className="flex-grow-1">
                                                            <h6>{scholarship.name}</h6>
                                                            <p className="text-muted mb-2">{scholarship.organization}</p>
                                                            <p className="small">{scholarship.description}</p>

                                                            <div className="mb-2">
                                                                <strong>Montant :</strong> {scholarship.amount}
                                                            </div>

                                                            <div className="mb-2">
                                                                <strong>Date limite :</strong> {new Date(scholarship.deadline).toLocaleDateString()}
                                                            </div>

                                                            <div className="eligibility">
                                                                <strong>Éligibilité :</strong>
                                                                <ul className="small mb-2">
                                                                    {scholarship.eligibility.map((item, index) => (
                                                                        <li key={index}>{item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <a
                                                                href={scholarship.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-primary"
                                                            >
                                                                📋 Voir les détails
                                                            </a>
                                                        </div>

                                                        <div className="text-end">
                                                            <div className={`badge ${scholarship.matchScore > 80 ? 'bg-success' : scholarship.matchScore > 60 ? 'bg-warning' : 'bg-secondary'}`}>
                                                                {scholarship.matchScore}% match
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Statistiques */}
                            {scholarships.length > 0 && (
                                <div className="card mt-4">
                                    <div className="card-body">
                                        <h6>📊 Analyse de votre profil</h6>
                                        <div className="row text-center">
                                            <div className="col">
                                                <div className="h4 text-primary">{scholarships.length}</div>
                                                <small>Bourses trouvées</small>
                                            </div>
                                            <div className="col">
                                                <div className="h4 text-success">
                                                    {Math.max(...scholarships.map(s => s.matchScore))}%
                                                </div>
                                                <small>Meilleur match</small>
                                            </div>
                                            <div className="col">
                                                <div className="h4 text-warning">
                                                    {new Date(Math.min(...scholarships.map(s => new Date(s.deadline).getTime()))).toLocaleDateString()}
                                                </div>
                                                <small>Prochaine échéance</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}