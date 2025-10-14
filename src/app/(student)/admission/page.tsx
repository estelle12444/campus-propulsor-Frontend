'use client';

import { useState } from 'react';
import './admission.css';

interface AcademicDiploma {
    id: string;
    diplome: string;
    etablissement: string;
    annee: string;
    mention: string;
}

interface FormationChoice {
    id: string;
    universite: string;
    programme: string;
    niveau: string;
    lien: string;
    pourquoiProgramme: string;
    pourquoiVille: string;
}

export default function ProfilCandidat() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Informations Personnelles
        nom: '',
        prenom: '',
        dateNaissance: '',
        email: '',
        telephone: '',

        // Parcours Académique
        bacSerie: '',
        bacScore: '',
        postBacDiplomas: [] as AcademicDiploma[],

        // Compétences Linguistiques
        niveauFrancais: '',
        scoreTCF: '',
        scoreDELFDALF: '',

        // Formations Visées
        formationChoices: [] as FormationChoice[],

        // Projet Professionnel
        jobTitleTarget: '',
        shortTermGoal: '',
        mediumTermGoal: '',
        longTermGoal: '',
        planBRoles: '',
        contributionToCI: '',

        // Motivations
        whyFrance: '',
        atoutsAcademiques: '',
        realisationFiere: ''
    });

    const addDiploma = () => {
        const newDiploma: AcademicDiploma = {
            id: Date.now().toString(),
            diplome: '',
            etablissement: '',
            annee: '',
            mention: ''
        };
        setFormData(prev => ({
            ...prev,
            postBacDiplomas: [...prev.postBacDiplomas, newDiploma]
        }));
    };

    const updateDiploma = (id: string, field: keyof AcademicDiploma, value: string) => {
        setFormData(prev => ({
            ...prev,
            postBacDiplomas: prev.postBacDiplomas.map(diploma =>
                diploma.id === id ? { ...diploma, [field]: value } : diploma
            )
        }));
    };

    const removeDiploma = (id: string) => {
        setFormData(prev => ({
            ...prev,
            postBacDiplomas: prev.postBacDiplomas.filter(diploma => diploma.id !== id)
        }));
    };

    const addFormation = () => {
        if (formData.formationChoices.length >= 7) return;

        const newFormation: FormationChoice = {
            id: Date.now().toString(),
            universite: '',
            programme: '',
            niveau: '',
            lien: '',
            pourquoiProgramme: '',
            pourquoiVille: ''
        };
        setFormData(prev => ({
            ...prev,
            formationChoices: [...prev.formationChoices, newFormation]
        }));
    };

    const updateFormation = (id: string, field: keyof FormationChoice, value: string) => {
        setFormData(prev => ({
            ...prev,
            formationChoices: prev.formationChoices.map(formation =>
                formation.id === id ? { ...formation, [field]: value } : formation
            )
        }));
    };

    const removeFormation = (id: string) => {
        setFormData(prev => ({
            ...prev,
            formationChoices: prev.formationChoices.filter(formation => formation.id !== id)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Données soumises:', formData);
        // Ici vous enverrez les données à votre API
    };

    const steps = [
        { number: 1, title: 'Informations Personnelles', completed: currentStep > 1 },
        { number: 2, title: 'Parcours Académique', completed: currentStep > 2 },
        { number: 3, title: 'Compétences Linguistiques', completed: currentStep > 3 },
        { number: 4, title: 'Formations Visées', completed: currentStep > 4 },
        { number: 5, title: 'Projet Professionnel', completed: currentStep > 5 },
        { number: 6, title: 'Motivations', completed: currentStep > 6 }
    ];

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{
        show: boolean;
        studyProject: string;
        professionalProject: string;
    } | null>(null);

    const handleGenerateProjects = async () => {
        setLoading(true);

        try {
            console.log('Envoi des données:', formData);
            // VÉRIFIEZ que vous avez les données requises
            if (!formData.nom || !formData.prenom || !formData.email) {
                alert('Veuillez remplir les informations personnelles obligatoires');
                setLoading(false);
                return;
            }
            const response = await fetch('http://localhost:8000/api/generate-projects/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(formData)
            });

            console.log('Status response:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }


            const data = await response.json();
            console.log('Données reçues:', data);

            setResults({
                show: true,
                studyProject: data.study_project || "Projet d'étude généré",
                professionalProject: data.professional_project || "Projet professionnel généré"
            });

        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la génération des projets');
            setResults({
                show: true,
                studyProject: `PROJET D'ÉTUDE (Mode démo)\n\nCandidat: ${formData.prenom} ${formData.nom}\n\nVotre projet d'étude personnalisé basé sur votre parcours ${formData.bacSerie} et vos formations visées sera généré ici.`,
                professionalProject: `PROJET PROFESSIONNEL (Mode démo)\n\nObjectif: ${formData.jobTitleTarget}\n\nVotre projet professionnel détaillant vos objectifs à court, moyen et long terme sera généré ici.`
            });

            alert('Mode démo activé - Configurez le backend pour la génération IA complète');
        } finally {
            setLoading(false);
        }
        // } finally {
        //     setLoading(false);
        // }
    };

    const downloadTxt = (content: string, filename: string) => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const downloadWordDocument = async (studyContent: string, professionalContent: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/download-word/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    study_project: studyContent,
                    professional_project: professionalContent
                })
            });

            if (!response.ok) throw new Error('Erreur génération Word');

            // Télécharger le fichier Word
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `projets_${formData.prenom}_${formData.nom}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Erreur Word:', error);
            alert('Erreur lors du téléchargement Word - Mode démo activé');
            // Fallback: télécharger en TXT
            downloadTxt(studyContent + '\n\n' + professionalContent, 'projets_complets.txt');
        }
    };

    return (
        <div className="container">
            <div className="page-inner">
                {/* En-tête avec fil d'Ariane */}
                <div className="page-header">
                    <h3 className="fw-bold mb-3">Mon Profil Candidat</h3>
                    <ul className="breadcrumbs mb-3">
                        <li className="nav-home">
                            <a href="#">
                                <i className="icon-home"></i>
                            </a>
                        </li>
                        <li className="separator">
                            <i className="icon-arrow-right"></i>
                        </li>
                        <li className="nav-item">
                            <a href="#">Tableau de Bord</a>
                        </li>
                        <li className="separator">
                            <i className="icon-arrow-right"></i>
                        </li>
                        <li className="nav-item">
                            <a href="#">Profil Candidat</a>
                        </li>
                    </ul>

                </div>

                {/* Indicateur de Progression */}
                <div className="card mb-4">
                    <div className="card-header">
                        Remplissez ce formulaire avec le plus de détails possible. L'intelligence artificielle utilisera ces informations pour créer des projets personnalisés, cohérents et convaincants
                    </div>
                    <div className="card-body">
                        <div className="steps">
                            {steps.map(step => (
                                <div key={step.number} className={`step ${currentStep === step.number ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
                                    <div className="step-number">{step.number}</div>
                                    <div className="step-title">{step.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">
                                    {steps.find(s => s.number === currentStep)?.title}
                                </div>
                            </div>

                            {/* <form onSubmit={handleSubmit}> */}
                            <div className="card-body">

                                {/* Étape 1: Informations Personnelles */}
                                {currentStep === 1 && (
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="nom">Nom *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="nom"
                                                    value={formData.nom}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="prenom">Prénom *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="prenom"
                                                    value={formData.prenom}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="dateNaissance">Date de Naissance *</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="dateNaissance"
                                                    value={formData.dateNaissance}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="email">Email *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="telephone">Téléphone</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="telephone"
                                                    value={formData.telephone}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Étape 2: Parcours Académique */}
                                {currentStep === 2 && (
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="bacSerie">Série du Baccalauréat *</label>
                                                <select
                                                    className="form-select"
                                                    id="bacSerie"
                                                    value={formData.bacSerie}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, bacSerie: e.target.value }))}
                                                    required
                                                >
                                                    <option value="">Sélectionnez votre série</option>
                                                    <option value="C">Série C</option>
                                                    <option value="D">Série D</option>
                                                    <option value="E">Série E</option>
                                                    <option value="A">Série A</option>
                                                    <option value="B">Série B</option>
                                                    <option value="F">Série F</option>
                                                    <option value="G">Série G</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="bacScore">Note au Baccalauréat /20 *</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="bacScore"
                                                    min="10"
                                                    max="20"
                                                    step="0.1"
                                                    value={formData.bacScore}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, bacScore: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Diplômes Post-Bac */}
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5>Diplômes Post-Bac</h5>
                                                <button type="button" className="btn btn-primary btn-sm" onClick={addDiploma}>
                                                    + Ajouter un diplôme
                                                </button>
                                            </div>

                                            {formData.postBacDiplomas.map((diploma, index) => (
                                                <div key={diploma.id} className="card mb-3">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label>Diplôme</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={diploma.diplome}
                                                                        onChange={(e) => updateDiploma(diploma.id, 'diplome', e.target.value)}
                                                                        placeholder="Licence, Master, etc."
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label>Établissement</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={diploma.etablissement}
                                                                        onChange={(e) => updateDiploma(diploma.id, 'etablissement', e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>Année</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={diploma.annee}
                                                                        onChange={(e) => updateDiploma(diploma.id, 'annee', e.target.value)}
                                                                        placeholder="2024"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>Mention</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={diploma.mention}
                                                                        onChange={(e) => updateDiploma(diploma.id, 'mention', e.target.value)}
                                                                    >
                                                                        <option value="">Choisir</option>
                                                                        <option value="Passable">Passable</option>
                                                                        <option value="Assez Bien">Assez Bien</option>
                                                                        <option value="Bien">Bien</option>
                                                                        <option value="Très Bien">Très Bien</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label>&nbsp;</label>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-block"
                                                                        onClick={() => removeDiploma(diploma.id)}
                                                                    >
                                                                        Supprimer
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Étape 3: Compétences Linguistiques */}
                                {currentStep === 3 && (
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="niveauFrancais">Niveau de Français *</label>
                                                <select
                                                    className="form-select"
                                                    id="niveauFrancais"
                                                    value={formData.niveauFrancais}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, niveauFrancais: e.target.value }))}
                                                    required
                                                >
                                                    <option value="">Sélectionnez votre niveau</option>
                                                    <option value="A1">A1 - Débutant</option>
                                                    <option value="A2">A2 - Élémentaire</option>
                                                    <option value="B1">B1 - Intermédiaire</option>
                                                    <option value="B2">B2 - Avancé</option>
                                                    <option value="C1">C1 - Autonome</option>
                                                    <option value="C2">C2 - Maîtrise</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="scoreTCF">Score TCF (si applicable)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="scoreTCF"
                                                    value={formData.scoreTCF}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, scoreTCF: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="scoreDELFDALF">Score DELF/DALF (si applicable)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="scoreDELFDALF"
                                                    value={formData.scoreDELFDALF}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, scoreDELFDALF: e.target.value }))}
                                                    placeholder="DELF B2, DALF C1, etc."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Étape 4: Formations Visées */}
                                {currentStep === 4 && (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5>Formations Visées en France (max. 7)</h5>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={addFormation}
                                                    disabled={formData.formationChoices.length >= 7}
                                                >
                                                    + Ajouter une formation
                                                </button>
                                            </div>

                                            {formData.formationChoices.map((formation, index) => (
                                                <div key={formation.id} className="card mb-4">
                                                    <div className="card-header">
                                                        <h6>Formation {index + 1}</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Université/École *</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={formation.universite}
                                                                        onChange={(e) => updateFormation(formation.id, 'universite', e.target.value)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Programme *</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={formation.programme}
                                                                        onChange={(e) => updateFormation(formation.id, 'programme', e.target.value)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label>Niveau *</label>
                                                                    <select
                                                                        className="form-select"
                                                                        value={formation.niveau}
                                                                        onChange={(e) => updateFormation(formation.id, 'niveau', e.target.value)}
                                                                        required
                                                                    >
                                                                        <option value="">Choisir</option>
                                                                        <option value="Licence">Licence</option>
                                                                        <option value="Master">Master</option>
                                                                        <option value="Doctorat">Doctorat</option>
                                                                        <option value="Ingénieur">Ingénieur</option>
                                                                        <option value="Autre">Autre</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <div className="form-group">
                                                                    <label>Lien vers le programme</label>
                                                                    <input
                                                                        type="url"
                                                                        className="form-control"
                                                                        value={formation.lien}
                                                                        onChange={(e) => updateFormation(formation.id, 'lien', e.target.value)}
                                                                        placeholder="https://..."
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Pourquoi ce programme ? *
                                                                        <small className="text-muted"> (Minimum 200 caractères)</small>
                                                                    </label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        rows={4}
                                                                        value={formation.pourquoiProgramme}
                                                                        onChange={(e) => updateFormation(formation.id, 'pourquoiProgramme', e.target.value)}
                                                                        minLength={200}
                                                                        required
                                                                    />
                                                                    <small className="text-muted">
                                                                        {formation.pourquoiProgramme.length}/1500 caractères
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Pourquoi cette ville/région ? *
                                                                        <small className="text-muted"> (Minimum 150 caractères)</small>
                                                                    </label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        rows={3}
                                                                        value={formation.pourquoiVille}
                                                                        onChange={(e) => updateFormation(formation.id, 'pourquoiVille', e.target.value)}
                                                                        minLength={150}
                                                                        required
                                                                    />
                                                                    <small className="text-muted">
                                                                        {formation.pourquoiVille.length}/1000 caractères
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 text-end">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    onClick={() => removeFormation(formation.id)}
                                                                >
                                                                    Supprimer cette formation
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Étape 5: Projet Professionnel */}
                                {currentStep === 5 && (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="jobTitleTarget">
                                                    Intitulé de poste visé à court terme *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="jobTitleTarget"
                                                    value={formData.jobTitleTarget}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitleTarget: e.target.value }))}
                                                    placeholder="Ex: Data Analyst, Ingénieur Logiciel, Chef de Projet..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="shortTermGoal">
                                                    Objectifs professionnels (3 premières années après diplôme) *
                                                    <small className="text-muted"> (Minimum 200 caractères)</small>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="shortTermGoal"
                                                    rows={4}
                                                    value={formData.shortTermGoal}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, shortTermGoal: e.target.value }))}
                                                    minLength={200}
                                                    required
                                                />
                                                <small className="text-muted">
                                                    {formData.shortTermGoal.length}/1500 caractères
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="mediumTermGoal">
                                                    Évolution de carrière (5 à 10 ans) *
                                                    <small className="text-muted"> (Minimum 200 caractères)</small>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="mediumTermGoal"
                                                    rows={4}
                                                    value={formData.mediumTermGoal}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, mediumTermGoal: e.target.value }))}
                                                    minLength={200}
                                                    required
                                                />
                                                <small className="text-muted">
                                                    {formData.mediumTermGoal.length}/1500 caractères
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="longTermGoal">
                                                    Ambition professionnelle à long terme (15 ans et plus) *
                                                    <small className="text-muted"> (Minimum 200 caractères)</small>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="longTermGoal"
                                                    rows={4}
                                                    value={formData.longTermGoal}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, longTermGoal: e.target.value }))}
                                                    minLength={200}
                                                    required
                                                />
                                                <small className="text-muted">
                                                    {formData.longTermGoal.length}/1500 caractères
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="planBRoles">
                                                    Plans B - Autres métiers possibles *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="planBRoles"
                                                    value={formData.planBRoles}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, planBRoles: e.target.value }))}
                                                    placeholder="Ex: Consultant IT, Enseignant-Chercheur, Entrepreneur..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="contributionToCI">
                                                    Contribution au développement de la Côte d'Ivoire
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="contributionToCI"
                                                    rows={3}
                                                    value={formData.contributionToCI}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, contributionToCI: e.target.value }))}
                                                />
                                                <small className="text-muted">
                                                    {formData.contributionToCI.length}/1000 caractères
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Étape 6: Motivations */}
                                {currentStep === 6 && (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="whyFrance">
                                                    Pourquoi choisir la France pour vos études ? *
                                                    <small className="text-muted"> (Minimum 150 caractères)</small>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="whyFrance"
                                                    rows={4}
                                                    value={formData.whyFrance}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, whyFrance: e.target.value }))}
                                                    minLength={150}
                                                    required
                                                />
                                                <small className="text-muted">
                                                    {formData.whyFrance.length}/1000 caractères
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="atoutsAcademiques">
                                                    Quels sont vos principaux atouts académiques ?
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="atoutsAcademiques"
                                                    rows={3}
                                                    value={formData.atoutsAcademiques}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, atoutsAcademiques: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="realisationFiere">
                                                    Décrivez une réalisation (projet, stage) dont vous êtes particulièrement fier
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="realisationFiere"
                                                    rows={3}
                                                    value={formData.realisationFiere}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, realisationFiere: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            <div className="card-action">
                                <div className="d-flex justify-content-between">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setCurrentStep(prev => prev - 1)}
                                        >
                                            ← Précédent
                                        </button>
                                    )}

                                    {currentStep === 6 ? (
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => handleGenerateProjects()}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Génération en cours...
                                                </>
                                            ) : (
                                                '🚀 Générer mes projets'
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary ms-auto"
                                            onClick={() => setCurrentStep(prev => prev + 1)}
                                        >
                                            Suivant →
                                        </button>
                                    )}
                                </div>
                            </div>


                            {results?.show && (
                                <div className="mt-6 animate-fade-in space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-900">Vos Projets Personnalisés</h2>
                                        <p className="mt-2 text-gray-600">
                                            Veuillez relire attentivement ces propositions et les adapter si nécessaire.
                                        </p>

                                        {/* BOUTON TÉLÉCHARGER TOUT EN WORD */}
                                        <button
                                            onClick={() => downloadWordDocument(results.studyProject, results.professionalProject)}
                                            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition mb-6"
                                        >
                                            📥 Télécharger tout en Word (.docx)
                                        </button>
                                    </div>

                                    {/* Projet d'Étude */}
                                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                                        <h3 className="text-xl font-semibold mb-3">Projet d'Étude</h3>
                                        <div className="text-gray-700 whitespace-pre-wrap p-4 border rounded-md bg-white min-h-[200px]">
                                            {results.studyProject}
                                        </div>
                                        <div className="mt-4 space-x-4">
                                            <button
                                                onClick={() => downloadTxt(results.studyProject, 'projet_etude.txt')}
                                                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
                                            >
                                                Télécharger (.txt)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Projet Professionnel */}
                                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                                        <h3 className="text-xl font-semibold mb-3">Projet Professionnel</h3>
                                        <div className="text-gray-700 whitespace-pre-wrap p-4 border rounded-md bg-white min-h-[200px]">
                                            {results.professionalProject}
                                        </div>
                                        <div className="mt-4 space-x-4">
                                            <button
                                                onClick={() => downloadTxt(results.professionalProject, 'projet_professionnel.txt')}
                                                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
                                            >
                                                Télécharger (.txt)
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setResults(null)}
                                        className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-600 transition duration-300 mt-6"
                                    >
                                        Recommencer avec de nouvelles informations
                                    </button>
                                </div>
                            )}
                            {/* </form> */}

                        </div>

                        <footer className="text-center mt-8 text-sm text-gray-500 timeline-panel">
                            <p>Développé pour aider les futurs étudiants. Cet outil est une aide à la rédaction et ne remplace pas une relecture personnelle.</p>
                        </footer>
                    </div>
                </div>
            </div>
            {/* 
      <style jsx>{`
        .steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 60%;
          right: -40%;
          height: 2px;
          background-color: #dee2e6;
          z-index: 1;
        }
        .step.completed:not(:last-child)::after {
          background-color: #28a745;
        }
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #dee2e6;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
          z-index: 2;
        }
        .step.active .step-number {
          background-color: #007bff;
          color: white;
        }
        .step.completed .step-number {
          background-color: #28a745;
          color: white;
        }
        .step-title {
          font-size: 0.875rem;
          text-align: center;
          color: #6c757d;
        }
        .step.active .step-title {
          color: #007bff;
          font-weight: bold;
        }
        .step.completed .step-title {
          color: #28a745;
        }
      `}</style> */}
        </div>
    );
}