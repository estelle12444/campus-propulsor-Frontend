// components/CampusFranceGeneratorWithInputs.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './cv-generator.css';
import "react-quill/dist/quill.snow.css";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
// Import dynamique (ssr: false) => évite les erreurs d’hydratation
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => <p>Chargement de l’éditeur...</p>,
});

interface Formation {
    id: string;
    universite: string;
    programme: string;
    niveau: string;
    lien: string;
    specialites?: string;
    established?: string;
}

interface Experience {
    id: string;
    type: 'stage' | 'emploi' | 'benevolat' | 'projet';
    poste: string;
    entreprise: string;
    periode: string;
    description: string;
    competences: string[];
}

interface Competence {
    id: string;
    categorie: 'technique' | 'linguistique' | 'personnelle';
    nom: string;
    niveau?: string;
}

interface DocumentGeneré {
    id: string;
    type: 'cv' | 'lettre';
    content: string;
    formationId?: string;
    formationName?: string;
    timestamp: string;
}

export default function CampusFranceGeneratorWithInputs() {
    const [activeTab, setActiveTab] = useState<'cv' | 'lettre'>('cv');
    const [loading, setLoading] = useState(false);
    const [typeLettre, setTypeLettre] = useState<'unique' | 'groupe'>('unique');
    const [etapeActuelle, setEtapeActuelle] = useState<'profil' | 'formations' | 'documents'>('profil');

    // État pour la formation en cours de saisie
    const [nouvelleFormation, setNouvelleFormation] = useState<Omit<Formation, 'id'>>({
        universite: '',
        programme: '',
        niveau: '',
        lien: '',
        specialites: ''
    });

    // États pour les données utilisateur
    const [userData, setUserData] = useState({
        personalInfo: {
            titre: '',
            nom: '',
            prenom: '',
            email: '',
            telephone: '+225',
            adresse: '',
            nationalite: 'Ivoirienne',
            linkedin: '',
            dateNaissance: ''
        },
        formationsCible: [] as Formation[], // Jusqu'à 7 formations
        experiences: [] as Experience[],
        competences: [] as Competence[],
        centresInteret: [] as string[],
        projetProfessionnel: '',
        niveauEtude: '',
        domaineEtude: ''
    });

    // États pour le contenu généré
    const [documentsGeneres, setDocumentsGeneres] = useState<DocumentGeneré[]>([]);
    const [editedContent, setEditedContent] = useState('');
    const [formationActive, setFormationActive] = useState<Formation | null>(null);

    // Références
    // const editorRef = useRef<any>(null);

    // Configuration Quill
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link'
    ];
    const { quill, quillRef } = useQuill({
        theme: "snow",
        modules,
        formats,
    });
    // Ajouter une formation au panier
    const ajouterFormation = () => {
        if (userData.formationsCible.length >= 7) {
            alert('Maximum 7 formations autorisées dans le panier Campus France');
            return;
        }

        if (!nouvelleFormation.universite || !nouvelleFormation.programme) {
            alert('Veuillez saisir au moins l\'université et le programme');
            return;
        }

        const formation: Formation = {
            id: `formation-${Date.now()}`,
            ...nouvelleFormation
        };

        setUserData(prev => ({
            ...prev,
            formationsCible: [...prev.formationsCible, formation]
        }));

        // Réinitialiser le formulaire
        setNouvelleFormation({
            universite: '',
            programme: '',
            niveau: '',
            lien: '',
            specialites: ''
        });

        // Définir comme formation active si c'est la première
        if (userData.formationsCible.length === 0) {
            setFormationActive(formation);
        }
    };

    // Supprimer une formation
    const supprimerFormation = (id: string) => {
        setUserData(prev => ({
            ...prev,
            formationsCible: prev.formationsCible.filter(f => f.id !== id)
        }));

        // Si on supprime la formation active, on prend la première disponible
        if (formationActive?.id === id) {
            setFormationActive(userData.formationsCible[0] || null);
        }
    };

    // Récupérer le document actif
    const getCurrentDocument = () => {
        return documentsGeneres.find(doc =>
            doc.type === activeTab &&
            doc.formationId === formationActive?.id
        );
    };

    // Générer le CV
    const generateCVWithAI = async () => {
        if (!userData.personalInfo.nom) {
            alert('Veuillez compléter vos informations personnelles');
            return;
        }

        if (userData.formationsCible.length === 0) {
            alert('Veuillez ajouter au moins une formation cible');
            return;
        }

        setLoading(true);
        try {
            const formation = formationActive || userData.formationsCible[0];

            const response = await fetch('http://localhost:8000/api/generate-cv/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_data: userData,
                    formation_cible: formation
                })
            });

            if (!response.ok) throw new Error('Erreur de génération');

            const data = await response.json();

            const nouveauDoc: DocumentGeneré = {
                id: `cv-${Date.now()}`,
                type: 'cv',
                content: data.cv_content,
                formationId: formation.id,
                formationName: formation.programme,
                timestamp: new Date().toISOString()
            };

            setDocumentsGeneres(prev => [...prev, nouveauDoc]);
            setEditedContent(data.cv_content);
            setEtapeActuelle('documents');

        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la génération du CV');
        } finally {
            setLoading(false);
        }
    };

    // Générer une lettre pour la formation active
    const generateLettreWithAI = async () => {
        if (!formationActive) {
            alert('Veuillez sélectionner une formation cible');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/generate-lettre/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_data: userData,
                    formation_cible: formationActive,
                    type_lettre: typeLettre
                })
            });

            if (!response.ok) throw new Error('Erreur de génération');

            const data = await response.json();

            const nouveauDoc: DocumentGeneré = {
                id: `lettre-${Date.now()}`,
                type: 'lettre',
                content: data.lettre_content,
                formationId: formationActive.id,
                formationName: formationActive.programme,
                timestamp: new Date().toISOString()
            };

            setDocumentsGeneres(prev => [...prev, nouveauDoc]);
            setEditedContent(data.lettre_content);
            setEtapeActuelle('documents');

        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la génération de la lettre');
        } finally {
            setLoading(false);
        }
    };

    // Générer des lettres pour toutes les formations
    const generateLettresPourToutesFormations = async () => {
        if (userData.formationsCible.length === 0) {
            alert('Veuillez ajouter au moins une formation cible');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/generate-multiple-lettres/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_data: userData,
                    formations: userData.formationsCible
                })
            });

            if (!response.ok) throw new Error('Erreur de génération');

            const data = await response.json();

            const nouveauxDocs: DocumentGeneré[] = data.resultats.map((result: any) => ({
                id: `lettre-${Date.now()}-${result.formation_id}`,
                type: 'lettre',
                content: result.lettre_content,
                formationId: result.formation_id,
                formationName: result.formation.programme,
                timestamp: new Date().toISOString()
            }));

            setDocumentsGeneres(prev => [...prev, ...nouveauxDocs]);
            if (nouveauxDocs.length > 0) {
                setEditedContent(nouveauxDocs[0].content);
                setFormationActive(userData.formationsCible[0]);
            }
            setEtapeActuelle('documents');

        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la génération des lettres');
        } finally {
            setLoading(false);
        }
    };

    // Télécharger le document
    const downloadDocument = async (content: string, filename: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/generate-pdf/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content,
                    type: activeTab,
                    filename: filename,
                    formation_info: formationActive,
                    candidat_nom: `${userData.personalInfo.prenom} ${userData.personalInfo.nom}`
                })
            });

            if (!response.ok) throw new Error('Erreur de génération PDF');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Erreur PDF:', error);
            // Fallback en texte
            const element = document.createElement('a');
            const file = new Blob([content], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `${filename}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    // Valider les documents finaux
    const validateDocuments = async () => {
        const documentsValides = documentsGeneres.filter(doc =>
            doc.content && doc.content.trim().length > 0
        );

        if (documentsValides.length === 0) {
            alert('Veuillez générer au moins un document avant validation');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/validate-documents/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documents_valides: documentsValides
                })
            });

            if (!response.ok) throw new Error('Erreur de validation');

            const data = await response.json();
            alert(data.message);

            // Ici vous mettriez à jour la progression globale
            console.log('Progression mise à jour:', data.progression);

        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la validation des documents');
        }
    };

    // Mettre à jour le contenu édité
    const updateEditedContent = (content: string) => {
        setEditedContent(content);
        const currentDoc = getCurrentDocument();
        if (currentDoc) {
            setDocumentsGeneres(prev =>
                prev.map(doc =>
                    doc.id === currentDoc.id
                        ? { ...doc, content: content }
                        : doc
                )
            );
        }
    };
     useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setEditedContent(quill.root.innerHTML);
      });
    }
  }, [quill]);

    const currentDocument = getCurrentDocument();

    return (
        <div className="container">
            <div className="page-inner">
                <div className="container-fluid campus-france-generator">
                    {/* En-tête avec étapes */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="steps">
                                        <div className={`step ${etapeActuelle === 'profil' ? 'active' : ''}`}>
                                            <div className="step-number">1</div>
                                            <div className="step-label">Profil Personnel</div>
                                        </div>
                                        <div className={`step ${etapeActuelle === 'formations' ? 'active' : ''}`}>
                                            <div className="step-number">2</div>
                                            <div className="step-label">Formations Cible</div>
                                        </div>
                                        <div className={`step ${etapeActuelle === 'documents' ? 'active' : ''}`}>
                                            <div className="step-number">3</div>
                                            <div className="step-label">Documents</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Colonne de gauche - Formulaire */}
                        <div className="col-md-4">
                            {/* Étape 1: Profil Personnel */}
                            {etapeActuelle === 'profil' && (
                                <div className="card mb-4">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">👤 Étape 1: Mon Profil Personnel</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Titre professionnel*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ex: Candidat au Master en Informatique"
                                                value={userData.personalInfo.titre}
                                                onChange={(e) => setUserData({
                                                    ...userData,
                                                    personalInfo: { ...userData.personalInfo, titre: e.target.value }
                                                })}
                                            />
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Nom*"
                                                    value={userData.personalInfo.nom}
                                                    onChange={(e) => setUserData({
                                                        ...userData,
                                                        personalInfo: { ...userData.personalInfo, nom: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Prénom*"
                                                    value={userData.personalInfo.prenom}
                                                    onChange={(e) => setUserData({
                                                        ...userData,
                                                        personalInfo: { ...userData.personalInfo, prenom: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email*"
                                                value={userData.personalInfo.email}
                                                onChange={(e) => setUserData({
                                                    ...userData,
                                                    personalInfo: { ...userData.personalInfo, email: e.target.value }
                                                })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Projet Professionnel*</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Décrivez votre projet professionnel, vos objectifs de carrière..."
                                                value={userData.projetProfessionnel}
                                                onChange={(e) => setUserData({
                                                    ...userData,
                                                    projetProfessionnel: e.target.value
                                                })}
                                            />
                                        </div>

                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() => setEtapeActuelle('formations')}
                                            disabled={!userData.personalInfo.nom || !userData.personalInfo.prenom || !userData.personalInfo.email}
                                        >
                                            Continuer vers les Formations →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Étape 2: Saisie des Formations */}
                            {etapeActuelle === 'formations' && (
                                <div className="card mb-4">
                                    <div className="card-header bg-success text-white">
                                        <h5 className="mb-0">🎯 Étape 2: Mes Formations Cible (max 7)</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Université/École*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ex: Sorbonne Université, Université Paris-Saclay..."
                                                value={nouvelleFormation.universite}
                                                onChange={(e) => setNouvelleFormation({
                                                    ...nouvelleFormation,
                                                    universite: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Programme/Formation*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ex: Master en Intelligence Artificielle, Licence en Droit..."
                                                value={nouvelleFormation.programme}
                                                onChange={(e) => setNouvelleFormation({
                                                    ...nouvelleFormation,
                                                    programme: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Niveau</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ex: Master 1, Licence 3, Bachelor..."
                                                value={nouvelleFormation.niveau}
                                                onChange={(e) => setNouvelleFormation({
                                                    ...nouvelleFormation,
                                                    niveau: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Lien de la formation</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                placeholder="https://..."
                                                value={nouvelleFormation.lien}
                                                onChange={(e) => setNouvelleFormation({
                                                    ...nouvelleFormation,
                                                    lien: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Spécialités/Mots-clés</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ex: IA, Data Science, Droit International..."
                                                value={nouvelleFormation.specialites}
                                                onChange={(e) => setNouvelleFormation({
                                                    ...nouvelleFormation,
                                                    specialites: e.target.value
                                                })}
                                            />
                                        </div>

                                        <button
                                            className="btn btn-success w-100 mb-3"
                                            onClick={ajouterFormation}
                                            disabled={!nouvelleFormation.universite || !nouvelleFormation.programme}
                                        >
                                            ➕ Ajouter cette Formation
                                        </button>

                                        {/* Liste des formations ajoutées */}
                                        <div className="formations-list">
                                            <h6>Mon Panier Campus France ({userData.formationsCible.length}/7)</h6>
                                            {userData.formationsCible.map(formation => (
                                                <div
                                                    key={formation.id}
                                                    className={`formation-item p-2 mb-2 border rounded ${formationActive?.id === formation.id ? 'border-primary bg-light' : ''
                                                        }`}
                                                    onClick={() => setFormationActive(formation)}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="small">
                                                            <strong>{formation.programme}</strong>
                                                            <br />
                                                            <span className="text-muted">{formation.universite}</span>
                                                        </div>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                supprimerFormation(formation.id);
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {userData.formationsCible.length > 0 && (
                                            <div className="mt-3">
                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={() => setEtapeActuelle('documents')}
                                                >
                                                    Générer les Documents →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Étape 3: Génération des Documents */}
                            {etapeActuelle === 'documents' && (
                                <div className="card mb-4">
                                    <div className="card-header bg-info text-white">
                                        <h5 className="mb-0">📄 Étape 3: Génération des Documents</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Formation Active</label>
                                            <select
                                                className="form-select"
                                                value={formationActive?.id || ''}
                                                onChange={(e) => {
                                                    const formation = userData.formationsCible.find(f => f.id === e.target.value);
                                                    setFormationActive(formation || null);
                                                }}
                                            >
                                                <option value="">Sélectionnez une formation</option>
                                                {userData.formationsCible.map(formation => (
                                                    <option key={formation.id} value={formation.id}>
                                                        {formation.programme} - {formation.universite}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Type de Génération</label>
                                            <select
                                                className="form-select mb-2"
                                                value={typeLettre}
                                                onChange={(e) => setTypeLettre(e.target.value as 'unique' | 'groupe')}
                                            >
                                                <option value="unique">Lettre unique par formation</option>
                                                <option value="groupe">Lettre pour formations similaires</option>
                                            </select>
                                        </div>

                                        <div className="d-grid gap-2 mb-3">
                                            <button
                                                className="btn btn-primary"
                                                onClick={generateCVWithAI}
                                                disabled={loading}
                                            >
                                                {loading ? '⏳ Génération...' : '🎨 Générer CV'}
                                            </button>

                                            <button
                                                className="btn btn-success"
                                                onClick={generateLettreWithAI}
                                                disabled={loading || !formationActive}
                                            >
                                                {loading ? '⏳ Génération...' : '✉️ Lettre pour Formation Active'}
                                            </button>

                                            {userData.formationsCible.length > 1 && (
                                                <button
                                                    className="btn btn-info"
                                                    onClick={generateLettresPourToutesFormations}
                                                    disabled={loading}
                                                >
                                                    {loading ? '⏳ Génération...' : `📨 Générer ${userData.formationsCible.length} Lettres`}
                                                </button>
                                            )}
                                        </div>

                                        {/* Documents générés */}
                                        <div className="documents-list">
                                            <h6>Mes Documents Générés</h6>
                                            {documentsGeneres.map(doc => (
                                                <div
                                                    key={doc.id}
                                                    className={`document-item p-2 mb-2 border rounded cursor-pointer ${currentDocument?.id === doc.id ? 'border-primary bg-light' : ''
                                                        }`}
                                                    onClick={() => {
                                                        setEditedContent(doc.content);
                                                        setActiveTab(doc.type);
                                                        if (doc.formationId) {
                                                            const formation = userData.formationsCible.find(f => f.id === doc.formationId);
                                                            setFormationActive(formation || null);
                                                        }
                                                    }}
                                                >
                                                    <div className="small">
                                                        <strong>
                                                            {doc.type === 'cv' ? '📄 CV' : '✉️ Lettre'}
                                                            {doc.formationName && ` - ${doc.formationName}`}
                                                        </strong>
                                                        <br />
                                                        <span className="text-muted">
                                                            {new Date(doc.timestamp).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Colonne de droite - Éditeur */}
                        <div className="col-md-8">
                            {etapeActuelle === 'documents' ? (
                                <div className="card">
                                    <div className="card-header">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">
                                                {activeTab === 'cv' ? '📄 Éditeur de CV' : '✉️ Éditeur de Lettre'}
                                                {formationActive && ` - ${formationActive.programme}`}
                                            </h5>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => downloadDocument(
                                                        editedContent,
                                                        activeTab === 'cv' ? 'cv_professionnel' : `lettre_${formationActive?.programme || 'motivation'}`
                                                    )}
                                                    disabled={!editedContent}
                                                >
                                                    📥 Télécharger
                                                </button>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={validateDocuments}
                                                >
                                                    ✅ Valider Final
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <ul className="nav nav-tabs mb-3">
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link ${activeTab === 'cv' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('cv')}
                                                >
                                                    📄 CV
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link ${activeTab === 'lettre' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('lettre')}
                                                >
                                                    ✉️ Lettre de Motivation
                                                </button>
                                            </li>
                                        </ul>

                                        <div className="editor-container">
                                            {currentDocument ? (
                                              <div ref={quillRef} style={{ height: "600px" }} />
                                            ) : (
                                                <div className="text-center py-5 text-muted">
                                                    <p>
                                                        {activeTab === 'cv'
                                                            ? 'Générez votre CV avec l\'IA pour commencer l\'édition'
                                                            : 'Sélectionnez une formation et générez votre lettre avec l\'IA'
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="card">
                                    <div className="card-body text-center py-5">
                                        <h3>
                                            {etapeActuelle === 'profil'
                                                ? '🎯 Commencez par créer votre profil personnel'
                                                : '🏫 Ajoutez vos formations cibles (jusqu\'à 7)'
                                            }
                                        </h3>
                                        <p className="text-muted">
                                            {etapeActuelle === 'profil'
                                                ? 'Remplissez vos informations pour personnaliser votre candidature Campus France'
                                                : 'Saisissez les universités et programmes qui vous intéressent en France'
                                            }
                                        </p>
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