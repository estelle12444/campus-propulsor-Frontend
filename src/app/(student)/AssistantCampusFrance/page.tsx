// app/assistant-campus-france/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { marked } from "marked";

interface ProcedureStep {
  id: number;
  step_number: number;
  title: string;
  detailed_explanation: string;
  official_link: string;
  estimated_duration: string;
  is_mandatory: boolean;
}

interface UserProgress {
  id: number;
  step: {
    id: number;
    step_number: number;
    title: string;
    // autres propriétés de step si nécessaire
  };
  is_completed: boolean;
  completed_at: string | null;
  step_number?: number; // Ajoutez cette propriété optionnelle
}

interface AppointmentSlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface School {
  nom: string;
  ville: string;
  type: string;
}

interface FormattedSchool {
  nom: string;
  ville: string;
  type: string;
}
// Fonction pour obtenir le nom du lien en fonction de l'étape
const getOfficialLinkName = (stepNumber: number): string => {
  const linkNames: { [key: number]: string } = {
    1: "🔍 Consulter le catalogue des formations Campus France",
    2: "🌐 Accéder à la plateforme 'Etudes en France'",
    3: "📚 Comprendre le panier de formations",
    5: "📋 Plus d'Infos sur l'entretien",
    6: "🗓️ Comprendre les réponses des établissements",
    7: "✅ Faire sa demande de visa en ligne",

  };

  return linkNames[stepNumber] || "🔗 Lien officiel";
};

export default function AssistantCampusFrance() {
  const procedureId = 1;

  // const [activeTab, setActiveTab] = useState('campus-france');
  const [currentStep, setCurrentStep] = useState(1);
  const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [showDocumentGenerator, setShowDocumentGenerator] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [customInstitution, setCustomInstitution] = useState('');
  const [customProgram, setCustomProgram] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocuments, setGeneratedDocuments] = useState<{ cv: string, letter: string } | null>(null);
  const [userFormations, setUserFormations] = useState<any[]>([]);

  // États pour l'accompagnement Campus France
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlot[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  const [schoolsData, setSchoolsData] = useState<School[]>([]);

  const fetchSchoolsData = async () => {
    try {
      const response = await fetch(
        'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-principaux-etablissements-enseignement-superieur/records?limit=100'
      );
      const data = await response.json();

      const formattedData = data.results.map((school: any) => ({
        nom: school.uo_lib || 'Nom non disponible',
        ville: school.com_nom || school.dep_nom || 'Ville non disponible',
        type: school.type_d_etablissement || 'Type non disponible',
      }));

      setSchoolsData(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des établissements:', error);
      setSchoolsData([]);
    }
  };

  // Récupérer les données de la procédure Campus France
  useEffect(() => {
    const fetchProcedureData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8000/api/procedures/${procedureId}/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProcedureSteps(data.steps || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);

      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserProgress = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8000/api/procedures/${procedureId}/progress/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Progression utilisateur:', data);
          if (data.steps && Array.isArray(data.steps)) {
            setUserProgress(
              data.steps.map((step: any) => ({
                id: step.id,
                step: {
                  id: step.step.id,
                  step_number: step.step.step_number,
                  title: step.step.step_title || step.step.title || '',
                },
                is_completed: true, // ✅ Ces étapes sont déjà complétées
                completed_at: step.completed_at || null,
              }))
            );
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
      }
    };

    fetchProcedureData();
    fetchUserProgress();


    const fetchUserFormations = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/formations/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserFormations(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error);
      }
    };

    fetchUserFormations();
    fetchSchoolsData();
  }, [isAuthenticated]);


  // Fonction pour récupérer les créneaux de rendez-vous
  const fetchAppointmentSlots = async () => {
    setIsLoadingAppointments(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/appointments/slots/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointmentSlots(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  // Fonction pour réserver un rendez-vous
  const bookAppointment = async (slotId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/appointments/book/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          slot_id: slotId,
          appointment_type: 'campus_france_assistance',
          notes: 'Accompagnement création compte Campus France - Premier rendez-vous gratuit'
        }),
      });

      if (response.ok) {
        const appointment = await response.json();
        setAppointmentConfirmed(true);
        // Envoyer le lien de meeting (simulation)
        setTimeout(() => {
          alert(`🎉 Rendez-vous confirmé! \n📅 ${appointment.date} à ${appointment.start_time}\n🔗 Lien Teams: https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substring(7)}`);
        }, 500);
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert('Erreur lors de la réservation du rendez-vous');
    }
  };



  const toggleStepCompletion = async (stepId: number) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour suivre votre progression');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const existingProgress = userProgress.find(p => p.step.id === stepId);

      if (existingProgress) {
        // Utiliser l'endpoint toggle-completion
        const response = await fetch(`http://localhost:8000/api/progress/${existingProgress.id}/toggle-completion/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const updatedProgress = await response.json();
          setUserProgress(prev =>
            prev.map(p => p.id === existingProgress.id ? updatedProgress : p)
          );
        } else {
          console.error('Erreur toggle-completion:', response.status);
        }
      } else {
        // Créer une nouvelle progression
        const response = await fetch('http://localhost:8000/api/progress/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({
            step: stepId,
            is_completed: true,
          }),
        });

        if (response.ok) {
          const newProgress = await response.json();
          setUserProgress(prev => [...prev, newProgress]);
        } else {
          console.error('Erreur création progression:', response.status);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la progression');
    }
  };

  // CORRECTION : Calcul correct de la progression
  const getCompletedStepsForProcedure = () => {
    const stepIds = procedureSteps.map(step => step.id);
    return userProgress.filter(progress =>
      progress.is_completed && stepIds.includes(progress.step.id)
    ).length;
  };



  const isStepCompleted = (stepId: number) => {
    return userProgress.some(progress =>
      progress.step.id === stepId &&
      progress.is_completed
    );
  };

  const completedSteps = getCompletedStepsForProcedure();
  const totalSteps = procedureSteps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const currentStepData = procedureSteps.find(step => step.step_number === currentStep);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre assistant...</p>
        </div>
      </div>
    );
  }

  // {currentStep === 3
  // Ajoutez ces états après vos autres useState


  const generateDocuments = async () => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour générer des documents');
      return;
    }

    setIsGenerating(true);

    try {
      const token = localStorage.getItem('authToken');
      const institution = selectedInstitution === 'custom' ? customInstitution : selectedInstitution;
      const program = selectedProgram === 'custom' ? customProgram : selectedProgram;

      if (!institution || !program) {
        alert('Veuillez renseigner l\'établissement et la formation');
        return;
      }

      // Récupérer le profil utilisateur pour les infos
      const profileResponse = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let userProfile = null;
      if (profileResponse.ok) {
        userProfile = await profileResponse.json();
      }

      // Générer le CV
      const cvPrompt = createCVPrompt(institution, program, userProfile);
      const cvResponse = await fetch('http://localhost:8000/api/document/generate_ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          document_type: 'cv_etudiant',
          institution_name: institution,
          programme_name: program,
          ai_prompt_used: cvPrompt
        }),
      });

      // Générer la lettre de motivation
      const letterPrompt = createLetterPrompt(institution, program, userProfile);
      const letterResponse = await fetch('http://localhost:8000/api/document/generate_ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          document_type: 'lettre_motivation_formation',
          institution_name: institution,
          programme_name: program,
          ai_prompt_used: letterPrompt
        }),
      });

      if (cvResponse.ok && letterResponse.ok) {
        const cvData = await cvResponse.json();
        const letterData = await letterResponse.json();

        setGeneratedDocuments({
          cv: cvData.content,
          letter: letterData.content
        });

      } else {
        throw new Error('Erreur lors de la génération des documents');
      }

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération des documents');
    } finally {
      setIsGenerating(false);
    }
  };

  const createCVPrompt = (institution: string, program: string, userProfile: any) => {
    return `
CRITÈRE CRITIQUE : Ce CV doit PASSER IMPÉRATIVEMENT les détecteurs d'IA utilisés par les universités. Agis comme un "humaniseur" expert - introduis des imperfections naturelles, des variations de style, et une authenticité humaine.

STRATÉGIES ANTI-DÉTECTION :
- Mélanger les niveaux de langage (formel avec quelques touches conversationnelles)
- Introduire des répétitions légères et variations de structure
- Utiliser des formulations légèrement redondantes mais naturelles
- Éviter la perfection syntaxique excessive
- Insérer des connecteurs logiques humains ("du coup", "ainsi", "de ce fait")
-Ne sois jamais detectable par n'importe quel test de conformité IA

Tu es un conseiller d'orientation. Ton rôle est de créer un CV authentique et naturel pour un étudiant, en l'adaptant à la formation visée. Rédige un CV académique en français avec un formatage riche mais IMPARFAIT, incluant des variations dans les puces, des sections avec des longueurs variables, et une structure visuelle organique. Le résumé et les descriptions doivent sembler écrits par un humain - avec des hésitations stylistiques naturelles.

CANDIDAT :
${userProfile?.full_name || `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim()}
${userProfile?.email || 'email@exemple.com'} | ${userProfile?.phone_number || '+33 X XX XX XX XX'} | ${userProfile?.address || 'Ville, Pays'}

FORMATION VISÉE :
${program} à ${institution}

INFORMATIONS À INTÉGRER :
- Bac : ${userProfile?.bac_serie || 'Série'} (${userProfile?.bac_score || 'Note'}/20)
- Nationalité : ${userProfile?.nationality || 'Non spécifié'}
- Niveau français : ${userProfile?.niveau_francais || 'Non spécifié'} ${userProfile?.score_tcf ? `(TCF : ${userProfile.score_tcf})` : ''}
- Formations : ${userProfile?.academic_history || 'À compléter'}
- Expériences : ${userProfile?.professional_experience || 'À compléter'}
- Compétences : ${userProfile?.skills || 'À compléter'}

STRUCTURE EXIGÉE (avec variations humaines) :
# [NOM COMPLET]
## [Adresse] - [Téléphone] - [Email]
## [Titre/Statut]  

### Profil  
---
Texte de 4 à 5 lignes avec DES IMPERFECTIONS STYLISTIQUES : phrases de longueurs variables, quelques répétitions naturelles, ton authentique mais professionnel. Présenter la motivation avec des formulations légèrement personnelles.

### Formation 
---
 **Nom du diplôme**  
  *Établissement, Ville*  *Dates (Mois Année – Mois Année)*  
  • Projet marquant : description avec style naturel
  • Autre réalisation : texte avec variation de structure

 **Autre diplôme**  
  *Établissement, Ville*  *Dates (Mois Année – Mois Année)*  
  • Projet important : décrit avec des mots simples
  • Réalisation académique : formulation légèrement redondante mais naturelle

### Projets & Expériences Pertinentes  
 **Poste/Projet**  
  *Entreprise/Contexte, Ville*  *Dates (Mois Année – Mois Année)*  
  • Responsabilités décrites avec style humain
  • Compétences acquises : formulation simple

 **Autre expérience**  
  *Entreprise/Contexte, Ville*  *Dates (Mois Année – Mois Année)*  
  • Tâches principales avec variations
  • Apprentissages : texte authentique

### Compétences  
---
•  Compétence 1 (Niveau avec description naturelle)
•  Compétence 2 (Niveau avec formulation variée)
•  Autre compétence (Niveau avec style simple)

### Engagements 
---
• **Engagement 1** ( description brève avec imperfection )
• **Engagement 2** ( texte court et authentique )

### Langues 
---
•  Langue 1 (Niveau avec variation)
•  Langue 2 (Niveau naturel)

CONTRAINTES ANTI-DÉTECTION :
- Mélanger les types de puces (•, -, *) légèrement
- Variations dans la longueur des phrases
- Éviter la perfection syntaxique excessive
- Maximum une page avec densité variable
- Ton professionnel mais avec touches humaines

FORMATAGE HUMAIN :
- Sections avec titres en gras mais longueurs variables
- Lignes de séparation parfois légèrement décalées
- Texte riche mais avec imperfections stylistiques
- Une ligne vide entre certaines sections seulement
- Éléments en gras avec cohérence relative
- Dates alignées naturellement
- Italiques utilisés avec modération
- AUCUNE phrase parfaite ou trop structurée
- Ne jamais écrire "Voici", "Ci-dessous", "Proposition de", "Exemple de", etc.
- Commence directement par le nom ou l'adresse du candidat selon la structure attendue.
 -pas d'infos supp
- Pas d'informations supplémentaires artificielles
`;
};

const createLetterPrompt = (institution: string, program: string, userProfile: any) => {
    return `
CRITÈRE ULTIME : Cette lettre doit ÊTRE INDÉTECTABLE par les algorithmes d'IA des universités. Agis comme un humaniseur et comme un expert humain expérimenté en recrutement - introduis des variations de rythme, et une authenticité stylistique.

STRATÉGIES DE CONTOURNEMENT :
- Phrases de longueurs très variables (très courtes à longues)
- Répétitions légères de concepts avec formulations différentes
- Utilisation de connecteurs logiques
- Éviter la structure trop rigide
-Ne sois jamais detectable par n'importe quel test de conformité IA

Tu es un conseiller d'orientation expert aidant un excellent élève à rédiger une lettre de motivation AUTHENTIQUE pour une grande école et une université. Rédige un texte formel mais HUMAIN, avec des variations stylistiques naturelles. La lettre doit montrer la cohérence du parcours mais avec des imperfections rédactionnelles volontaires. Structure en paragraphes de longueurs inégales, avec des transitions organiques.

**DESTINATAIRE:**
Comité des Admissions - ${program}- ${institution}

**CANDIDAT:**
${userProfile?.full_name || `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim()}
${userProfile?.email || 'email@exemple.com'}

**CONTEXTE:**
- Formation actuelle: ${userProfile?.academic_history ? JSON.stringify(userProfile.academic_history) : 'À compléter'}
- Expériences: ${userProfile?.professional_experience ? JSON.stringify(userProfile.professional_experience) : 'À compléter'}
- Compétences: ${userProfile?.skills ? JSON.stringify(userProfile.skills) : 'À compléter'}

**STRUCTURE AVEC VARIATIONS HUMAINES :**

Objet : Candidature au programme ${program}

Madame, Monsieur,

[PARAGRAPHE 1 - longueur variable 4-7 lignes]
Présentation du programme avec style naturel. Mention de la découverte de façon authentique. Intérêt pour ${institution} exprimé avec des formulations légèrement redondantes mais humaines. Ton enthousiaste mais avec variations.

[PARAGRAPHE 2 - longueur irrégulière 5-8 lignes] 
Lien entre parcours et formation avec imperfections stylistiques. Exemples concrets décrits avec style simple. Compétences présentées avec répétitions naturelles. Références précises mais formulations variées.

[PARAGRAPHE 3 - 4-6 lignes inégales]
Projet professionnel expliqué avec authenticité. Motivation exprimée avec connecteurs humains. Vision présentée de façon organique. Relier à l'établissement avec style naturel.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Signature]

${userProfile?.full_name || `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim()}

**CONTRAINTES ANTI-DÉTECTION :**
- Format texte avec densité variable
- Paragraphes de longueurs très inégales
- Phrases mélangées (très courtes et longues)
- Répétitions légères de mots-clés
- Style légèrement incohérent entre sections
- Connecteurs conversationnels naturels
- 1500 caractères avec variations
- Références spécifiques mais formulations humaines
- Structure classique mais avec imperfections
- AUCUNE perfection syntaxique
- Éviter les formulations trop élégantes
`;
};
//   const createCVPrompt = (institution: string, program: string, userProfile: any) => {
//     return `
//     Tu es un conseiller d'orientation. Ton rôle est de créer un CV clair et concis pour un étudiant, en l'adaptant à la formation visée. Rédigie un CV académique  en français avec un formatage riche incluant des puces, des sections claires et une structure visuelle.Le résumé (profil) et les descriptions des projets/formations doivent être réécrits pour mettre en avant les aspects du profil qui correspondent le mieux aux valeurs et prérequis du programme visé
// CANDIDAT :
// ${userProfile?.full_name || `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim()}
// ${userProfile?.email || 'email@exemple.com'} | ${userProfile?.phone_number || '+33 X XX XX XX XX'} | ${userProfile?.address || 'Ville, Pays'}

// FORMATION VISÉE :
// ${program} à ${institution}

// INFORMATIONS À INTÉGRER :
// - Bac : ${userProfile?.bac_serie || 'Série'} (${userProfile?.bac_score || 'Note'}/20)
// - Nationalité : ${userProfile?.nationality || 'Non spécifié'}
// - Niveau français : ${userProfile?.niveau_francais || 'Non spécifié'} ${userProfile?.score_tcf ? `(TCF : ${userProfile.score_tcf})` : ''}
// - Formations : ${userProfile?.academic_history || 'À compléter'}
// - Expériences : ${userProfile?.professional_experience || 'À compléter'}
// - Compétences : ${userProfile?.skills || 'À compléter'}

// STRUCTURE EXIGÉE (avec puces et formatage) :
// # [NOM COMPLET]
// ## [Adresse] - [Téléphone] - [Email]
// ## [Titre/Statut]  

// ### Profil  
// ---
//  Texte de 4 à 5 lignes présentant la motivation, les principales compétences et l’adéquation avec la formation visée. Ton professionnel et fluide.

// ### Formation 
// ---
//  **Nom du diplôme**  
//   *Établissement, Ville*  
//   *Dates (Mois Année – Mois Année)*  
//   • Projet marquant : description brève
//   • Réalisations académiques

//  **Nom du diplôme**  
//   *Établissement, Ville*  
//   *Dates (Mois Année – Mois Année)*  
//   • Projet marquant : description brève
//   • Réalisations académiques

// ### Projets & Expériences Pertinentes  
//  **Poste/Projet**  
//   *Entreprise/Contexte, Ville*  
//   *Dates (Mois Année – Mois Année)*  
//   • Responsabilités principales
//   • Compétences acquises

//  **Poste/Projet**  
//   *Entreprise/Contexte, Ville*  
//   *Dates (Mois Année – Mois Année)*  
//   • Responsabilités principales
//   • Compétences acquises

// ### Compétences  
// ---
// •  Détail 1 (Niveau)
// •  Détail 2 (Niveau)
// •  Détail 3 (Niveau)
// •  Détail 4 (Niveau)

// ### Engagements 
// ---
// • **Engagement 1** ( description brève )
// • **Engagement 2** ( description brève )

// ### Langues 
// ---
// •  Langue 1 (Niveau)
// •  Langue 2 (Niveau)

// CONTRAINTES DE FORMATAGE 
// - Utiliser des puces (•) pour les listes
// - Sections avec titres en gras (###)
// - Lignes de séparation (---) juste en dessous des titres
// - Texte riche avec mise en forme
// - Maximum une page
// - Ton professionnel et fluide
// - Une ligne vide entre chaque section.  
// -les  éléments avec (**) doivent être en gras 
// -les *Dates (Mois Année – Mois Année)* doivent être à gauche sur la meme ligne que   *Entreprise/Contexte, Ville* pour Projets & Expériences Pertinentes  
// -les *Dates (Mois Année – Mois Année)* doivent être à gauche sur la meme ligne que     *Établissement, Ville*  pour Formation  
// -les  éléments avec (*) doivent être en italique
// - Aucune phrase introductive ou commentaire explicatif. Le texte commence directement par le contenu demandé (CV ou lettre).
// - Ne jamais écrire "Voici", "Ci-dessous", "Proposition de", "Exemple de", etc.
// - Commence directement par le nom ou l'adresse du candidat selon la structure attendue.
// -pas d'infos supp
// `;
//   };
//   const createLetterPrompt = (institution: string, program: string, userProfile: any) => {
//     return `
// Tu es un conseiller d'orientation expert aidant un excellent élève à rédiger sa lettre de motivation pour une grande école. Rédige un texte formel, structuré et très persuasif. La lettre doit être articulée en paragraphes clairs, sans aucune liste à puces. Elle doit montrer la cohérence entre le parcours de l'élève, son intérêt profond pour la formation, son choix pour cette école en particulier, et son projet futur, en s'appuyant sur les mots-clés de la description du programme. La sortie doit être du texte brut bien formaté.

// **DESTINATAIRE:**
// Comité des Admissions - ${program}- ${institution}

// **CANDIDAT:**
// ${userProfile?.full_name || `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim()}
// ${userProfile?.email || 'email@exemple.com'}

// **CONTEXTE:**
// - Formation actuelle: ${userProfile?.academic_history ? JSON.stringify(userProfile.academic_history) : 'À compléter'}
// - Expériences: ${userProfile?.professional_experience ? JSON.stringify(userProfile.professional_experience) : 'À compléter'}
// - Compétences: ${userProfile?.skills ? JSON.stringify(userProfile.skills) : 'À compléter'}

// **STRUCTURE AVEC FORMATAGE :**


// Objet : Candidature au programme ${program}

// Madame, Monsieur,

// [PARAGRAPHE 1 - 5-6 lignes]
// Présentation du programme visé et expression de l'intérêt spécifique. Mention de la découverte de la formation et de ce qui attire particulièrement chez ${institution}. Ton enthousiaste mais professionnel.

// [PARAGRAPHE 2 - 6-7 lignes] 
// Mise en relation du parcours académique et des expériences avec les exigences du programme. Exemples concrets de compétences développées et de projets réalisés. Utiliser des références précises.

// [PARAGRAPHE 3 - 5-6 lignes]
// Présentation du projet professionnel et de la vision à long terme. Explication de ce que la formation va apporter et de la motivation à s'engager. Relier à la valeur ajoutée pour l'établissement.


// Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

// [Signature]

// ${userProfile?.full_name || `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim()}

// **CONTRAINTES DE FORMATAGE :**
// - Format texte riche avec sauts de ligne appropriés
// - Paragraphes bien distincts
// - Pas de listes à puces dans la lettre , pas d'astérix (**)
// - Ton professionnel et motivé
// - 1500 caractères
// - Références spécifiques à l'établissement
// - Structure classique de lettre formelle
// `;
//   };

  const downloadDocument = async (content: string, filename: string, format: 'docx' | 'pdf') => {
    if (format === 'docx') {
      try {
        const isCV = filename.includes('CV');

        const paragraphs = content.split('\n').map((line, index, array) => {
          if (line.trim() === '') {
            return new Paragraph({});
          }

          // Traitement spécifique pour le CV
          if (isCV) {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
              return new Paragraph({});
            }

            // Titre principal (#)
            if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('##')) {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: trimmedLine.replace('# ', ''),
                    bold: true,
                    size: 36,
                    font: 'Arial',
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              });
            }

            // Sous-titre (##)
            if (trimmedLine.startsWith('## ')) {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: trimmedLine.replace('## ', ''),
                    bold: false,
                    size: 22,
                    font: 'Arial',
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
              });
            }

            // Section (###)
            if (trimmedLine.startsWith('### ')) {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: trimmedLine.replace('### ', ''),
                    bold: true,
                    size: 24,
                    font: 'Arial',
                    color: '2C5AA0',
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { before: 300 },
                border: {
                  bottom: {
                    style: 'single',
                    color: '2C5AA0',
                    size: 3,
                    space: 4,
                  },
                },
              });
            }

            // Ligne de séparation (---) - On ignore comme dans le PDF
            if (trimmedLine.includes('---')) {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: '',
                  }),
                ],
                spacing: { after: 0 },
              });
            }

            // Puces (•)
            // Puces (•)
            if (trimmedLine.startsWith('• ')) {
              let bulletContent = trimmedLine.replace('• ', '');

              // Traitement du gras et italique dans les puces
              const children = [];
              let remainingText = bulletContent;

              // Gérer le gras (**texte**)
              const boldRegex = /\*\*(.*?)\*\*/g;
              let lastIndex = 0;
              let match;

              while ((match = boldRegex.exec(bulletContent)) !== null) {
                // Texte avant le gras
                if (match.index > lastIndex) {
                  children.push(new TextRun({
                    text: bulletContent.substring(lastIndex, match.index),
                    size: 24,
                  }));
                }
                // Texte en gras
                children.push(new TextRun({
                  text: match[1],
                  bold: true,
                  size: 24,
                }));
                lastIndex = match.index + match[0].length;
              }

              // Texte après le dernier gras
              if (lastIndex < bulletContent.length) {
                const remaining = bulletContent.substring(lastIndex);
                // SUPPRIMER le traitement automatique de l'italique pour les parenthèses
                children.push(new TextRun({
                  text: remaining,
                  size: 24,
                }));
              }

              // Si aucun traitement spécial n'a été appliqué
              if (children.length === 0) {
                children.push(new TextRun({
                  text: bulletContent,
                  size: 24,
                }));
              }

              return new Paragraph({
                children: [
                  new TextRun({
                    text: '• ',
                    bold: true,
                    size: 24,
                  }),
                  ...children,
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 100 },
                indent: { left: 400 },
              });
            }

            // Éléments en gras (**texte**) pour les lignes normales
            if (trimmedLine.includes('**')) {
              const boldRegex = /\*\*(.*?)\*\*/g;
              const children = [];
              let lastIndex = 0;
              let match;

              while ((match = boldRegex.exec(trimmedLine)) !== null) {
                // Texte avant le gras
                if (match.index > lastIndex) {
                  children.push(new TextRun({
                    text: trimmedLine.substring(lastIndex, match.index),
                    size: 24,
                  }));
                }
                // Texte en gras
                children.push(new TextRun({
                  text: match[1],
                  bold: true,
                  size: 24,
                }));
                lastIndex = match.index + match[0].length;
              }
              // Texte après le dernier gras
              if (lastIndex < trimmedLine.length) {
                children.push(new TextRun({
                  text: trimmedLine.substring(lastIndex),
                  size: 24,
                }));
              }

              return new Paragraph({
                children: children,
                alignment: AlignmentType.LEFT,
                spacing: { after: 100 },
              });
            }

            // Éléments en italique (*texte*)
            if (trimmedLine.includes('*') && !trimmedLine.startsWith('•')) {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: trimmedLine.replace(/\*/g, ''),
                    italics: true,
                    size: 24,
                    color: '#666666'
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 50 },
              });
            }
          }

          // Paragraphes normaux (pour le CV et la lettre)
          return new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 22,
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 150, line: 300 },
          });
        });

        const doc = new Document({
          sections: [{
            properties: {},
            children: paragraphs,
          }],
        });

        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error('Erreur génération Word:', error);
        downloadAsHTML(content, filename);
      }
    } else {
      // PDF amélioré avec style adapté au nouveau format CV
      const isCV = filename.includes('CV');


      const printWindow = window.open('', '_blank');
      if (printWindow) {
        let styledContent = content;

        if (isCV) {
          // Version complètement réécrite pour plus de fiabilité
          const lines = content.split('\n');
          let finalContent = '';
          let inList = false;

          lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
              if (inList) {
                finalContent += '</ul>';
                inList = false;
              }
              return;
            }

            // Titre principal (#)
            if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('##')) {
              if (inList) {
                finalContent += '</ul>';
                inList = false;
              }
              finalContent += `<h1 style="font-size: 24pt; margin-bottom: 10px; color: #000; font-weight: bold; text-align: center;">${trimmedLine.replace('# ', '')}</h1>`;
            }
            // Sous-titre (##)
            else if (trimmedLine.startsWith('## ')) {
              if (inList) {
                finalContent += '</ul>';
                inList = false;
              }
              finalContent += `<h2 style="font-size: 12pt; margin-bottom: 20px;  text-align: center;">${trimmedLine.replace('## ', '')}</h2>`;
            }
            // Sections (###)
            else if (trimmedLine.startsWith('### ')) {
              if (inList) {
                finalContent += '</ul>';
                inList = false;
              }
              finalContent += `<h3 style="font-size: 13pt; margin: 25px 0 15px 0; color: #2c5aa0; font-weight: bold; padding-bottom: 5px; border-bottom: 1px solid #2c5aa0;">${trimmedLine.replace('### ', '')}</h3>`;
            }
            // Lignes de séparation (---)
            else if (trimmedLine.includes('---')) {
              if (inList) {
                finalContent += '</ul>';
                inList = false;
              }
              // finalContent += '<hr style="border: none; border-top: 3px solid #ccc; margin: 15px 0;">';
            }
            // Puces (•)
            else if (trimmedLine.startsWith('• ')) {
              if (!inList) {
                finalContent += '<ul style="margin: 10px 0; padding-left: 25px;">';
                inList = true;
              }
              let bulletContent = trimmedLine.replace('• ', '');
              // Appliquer le gras et l'italique
              bulletContent = bulletContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              bulletContent = bulletContent.replace(/\*([^*]+)\*/g, '<em style="color: #666;">$1</em>');
              finalContent += `<li style="margin: 8px 0; line-height: 1.4;">${bulletContent}</li>`;
            }
            // Texte normal
            else {
              if (inList) {
                finalContent += '</ul>';
                inList = false;
              }

              let formattedLine = trimmedLine;
              // Appliquer le gras et l'italique au texte normal
              formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              formattedLine = formattedLine.replace(/\*([^*]+)\*/g, '<em style="color: #666;">$1</em>');

              finalContent += `<div style="margin: 5px 0; line-height: 1.4;">${formattedLine}</div>`;
            }
          });

          // Fermer la dernière liste si nécessaire
          if (inList) {
            finalContent += '</ul>';
          }

          styledContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 11pt; color: #333;">
            ${finalContent}
        </div>
    `;

          // Nettoyage final
          styledContent = styledContent
            .replace(/<div><\/div>/g, '')
            .replace(/<div style="margin: 5px 0; line-height: 1.4;"><\/div>/g, '')
            .replace(/\n/g, '');
        }
        else {
          // Style pour la lettre de motivation
          styledContent = content.replace(/\n/g, '<br>');
        }


        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${filename}</title>
                    <meta charset="utf-8">
                    <style>
                        body { 
                            font-family: 'Arial', sans-serif; 
                            line-height: 1.5; 
                            margin: ${isCV ? '1.5cm' : '2cm'};
                            color: #333;
                            font-size: ${isCV ? '11pt' : '12pt'};
                        }
                        h1 {
                            font-size: 28pt;
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        h2 {
                            font-size: 14pt;
                            text-align: center;
                            margin-bottom: 20px;
                             color: #333333e7;
                            // font-style: italic;
                        }
                        h3 {
                            font-size: 13pt;
                            margin: 25px 0 10px 0;
                            color: #2c5aa0;
                            border-bottom: 1px solid #2c5aa0;
                            padding-bottom: 5px;
                        }
                        ul {
                            margin: 10px 0;
                            padding-left: 20px;
                        }
                        li {
                            margin: 8px 0;
                            line-height: 1.4;
                        }
                        // hr {
                        //     border: none;
                        //     border-top: 3px solid #ccc;
                        //     margin: 20px 0;
                        // }
                        em {
                            color: #666;
                        }
                        @media print {
                            body { margin: ${isCV ? '1cm' : '1.5cm'}; }
                        }
                    </style>
                </head>
                <body>
                    <div>${styledContent}</div>
                </body>
            </html>
            `);
        printWindow.document.close();

        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            printWindow.onafterprint = () => printWindow.close();
          }, 500);
        };


      }

    }
  };
  const downloadAsHTML = (content: string, filename: string) => {
    const blob = new Blob([content], {
      type: 'text/plain; charset=utf-8'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center py-6">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admission Success & Administrative route</h1>
              <p className="text-gray-600 mt-2">Préparer et réussir mon admission dans un établissement d'enseignement supérieur en France</p>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="text-right">
                  {/* <p className="text-sm text-gray-600">Bonjour, {user?.last_name} {user?.first_name} </p> */}
                  <p className="text-xs text-gray-500">Progression: {Math.round(progressPercentage)}% ({completedSteps}/{totalSteps} étapes)</p>
                </div>

              ) : (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Se connecter
                </button>
              )}


            </div>

          </div>

          {progressPercentage === 100 && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-2 mb-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">🎉 Félicitations !</h3>
                  <p className="text-green-100 leading-relaxed">
                    Service 1 terminé! Votre dossier de visa est prêt. Vous avez franchi avec succès toutes les étapes de l'admission.
                    Nous vous souhaitons bonne chance pour votre rendez-vous et nous vous retrouverons dans le Service 2 pour préparer
                    votre arrivée en France!
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = '/assistant-arrivee-france'}
                  className="ml-4 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors whitespace-nowrap"
                >
                  Passer au Service 2 →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation latérale - Étapes de la procédure */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Procédure Campus France</h3>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {completedSteps} sur {totalSteps} étapes complétées
                </p>
              </div>

              <nav className="space-y-2">
                {procedureSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center py-3 px-4 rounded-lg cursor-pointer transition-colors ${currentStep === step.step_number
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setCurrentStep(step.step_number)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isStepCompleted(step.id)
                      ? 'bg-green-500 text-white'
                      : currentStep === step.step_number
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                      }`}>
                      {isStepCompleted(step.id) ? '✓' : step.step_number}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium block">Étape {step.step_number}</span>
                      <span className="text-xs text-gray-500 block mt-1">{step.title}</span>
                    </div>
                  </div>
                ))}
              </nav>


            </div>

          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {currentStepData && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* En-tête de l'étape */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Étape {currentStepData.step_number}: {currentStepData.title}
                      </h2>
                      {/* <p className="text-blue-100 opacity-90">
                        Durée estimée: {currentStepData.estimated_duration || 'Non spécifiée'}
                        {currentStepData.is_mandatory && ' • Étape obligatoire'}
                      </p> */}
                    </div>
                    <button
                      onClick={() => toggleStepCompletion(currentStepData.id)}
                      disabled={isStepCompleted(currentStepData.id)}
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors ${isStepCompleted(currentStepData.id)
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                      {isStepCompleted(currentStepData.id) ? '✓ Terminé' : 'Marquer comme terminé'}
                    </button>
                  </div>
                </div>

                {/* Contenu de l'étape */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Instructions détaillées
                      </h4>
                      <div className="text-gray-700 leading-relaxed">
                        {currentStepData.detailed_explanation.split('\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    {/* Actions spécifiques à l'étape */}
                    {currentStep === 1 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-blue-900 mb-3">🚀 Accélérateur IA</h4>
                        <p className="text-blue-800 mb-4">
                          Notre intelligence artificielle peut vous aider à structurer votre projet d'études et professionnel.
                        </p>
                        <button
                          onClick={() => window.location.href = '/QuestionnaireProjet'}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                        >
                          🎯 Construire mon projet d'études et professionnel avec l'IA
                        </button>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-purple-900 mb-3">👥 Accompagnement Campus Propul'Sor</h4>
                        <p className="text-purple-800 mb-4">
                          Besoin d'aide pour créer votre compte Campus France ? Nos conseillers vous accompagnent en visioconférence.
                        </p>
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-purple-100">
                            <h5 className="font-semibold text-purple-700 mb-2">🎁 Premier rendez-vous gratuit</h5>
                            <p className="text-sm text-purple-600 mb-3">
                              Séance d'1 heure pour vous aider à créer votre compte et comprendre la procédure
                            </p>
                            <ul className="text-sm text-purple-600 space-y-1 mb-4">
                              <li>• Création guidée de votre compte Campus France</li>
                              <li>• Vérification de vos documents</li>
                              <li>• Explication du processus complet</li>
                              <li>• Réponses à toutes vos questions</li>
                            </ul>
                            <button
                              onClick={() => {
                                setShowAppointmentModal(true);
                                fetchAppointmentSlots();
                              }}
                              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors w-full"
                            >
                              📅 Choisir un créneau gratuit
                            </button>
                          </div>

                          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <h5 className="font-semibold text-yellow-700 mb-2">💡 Sessions suivantes (payantes)</h5>
                            <p className="text-sm text-yellow-600">
                              Après le premier rendez-vous, des sessions supplémentaires sont disponibles pour un accompagnement approfondi
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-green-900 mb-3">📄 Générateur de documents</h4>
                        <p className="text-green-800 mb-4">
                          Créez vos lettres de motivation et CV personnalisés pour chaque formation.
                        </p>

                        {/* Bouton pour ouvrir le générateur */}
                        <button
                          onClick={() => setShowDocumentGenerator(true)}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
                        >
                          ✍️ Générer mes documents de candidature
                        </button>

                        {/* Modale du générateur de documents */}
                        {showDocumentGenerator && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                              <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                  <h3 className="text-xl font-bold text-gray-900">Générateur de documents</h3>
                                  <button
                                    onClick={() => {
                                      setShowDocumentGenerator(false);
                                      setGeneratedDocuments(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    ✕
                                  </button>
                                </div>

                                {!generatedDocuments ? (
                                  <div className="space-y-6">
                                    {/* Sélection de l'établissement */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Établissement ciblé *
                                      </label>

                                      {userFormations.length > 0 && (
                                        <select
                                          value={selectedInstitution}
                                          onChange={(e) => setSelectedInstitution(e.target.value)}
                                          className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                                        >
                                          <option value="">Choisir parmi mes établissements</option>
                                          {userFormations.map((formation) => (
                                            <option key={formation.id} value={formation.institution_name}>
                                              {formation.institution_name} - {formation.programme}
                                            </option>
                                          ))}
                                        </select>
                                      )}

                                      <div className="flex items-center mb-2">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="px-3 text-sm text-gray-500">ou</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                      </div>

                                      <select
                                        value={selectedInstitution}
                                        onChange={(e) => setSelectedInstitution(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                                      >
                                        <option value="">Sélectionner un établissement</option>
                                        <option value="custom">Saisir manuellement</option>
                                        {schoolsData.map((school, index) => (
                                          <option key={index} value={school.nom}>
                                            {school.nom} - {school.ville} ({school.type})
                                          </option>
                                        ))}
                                      </select>

                                      {selectedInstitution === 'custom' && (
                                        <input
                                          type="text"
                                          placeholder="Nom de l'établissement"
                                          value={customInstitution}
                                          onChange={(e) => setCustomInstitution(e.target.value)}
                                          className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                                        />
                                      )}
                                    </div>

                                    {/* Sélection de la formation */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Formation visée *
                                      </label>

                                      {userFormations.length > 0 && (
                                        <select
                                          value={selectedProgram}
                                          onChange={(e) => setSelectedProgram(e.target.value)}
                                          className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                                        >
                                          <option value="">Choisir parmi mes formations</option>
                                          {userFormations.map((formation) => (
                                            <option key={formation.id} value={formation.programme}>
                                              {formation.programme} ({formation.niveau})
                                            </option>
                                          ))}
                                        </select>
                                      )}

                                      <div className="flex items-center mb-2">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="px-3 text-sm text-gray-500">ou</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                      </div>

                                      <select
                                        value={selectedProgram}
                                        onChange={(e) => setSelectedProgram(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                                      >
                                        <option value="">Sélectionner un domaine</option>
                                        <option value="custom">Saisir manuellement</option>
                                        <option value="Informatique">Informatique</option>
                                        <option value="Gestion">Gestion</option>
                                        <option value="Droit">Droit</option>
                                        <option value="Médecine">Médecine</option>
                                        <option value="Ingénierie">Ingénierie</option>
                                        <option value="Sciences Politiques">Sciences Politiques</option>
                                        <option value="Architecture">Architecture</option>
                                      </select>

                                      {selectedProgram === 'custom' && (
                                        <input
                                          type="text"
                                          placeholder="Nom de la formation"
                                          value={customProgram}
                                          onChange={(e) => setCustomProgram(e.target.value)}
                                          className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                                        />
                                      )}
                                    </div>

                                    <button
                                      onClick={generateDocuments}
                                      disabled={isGenerating}
                                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                                    >
                                      {isGenerating ? (
                                        <span className="flex items-center justify-center">
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                          Génération en cours...
                                        </span>
                                      ) : (
                                        '🎯 Générer mon CV et ma lettre de motivation'
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-6">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                      <p className="text-green-800 font-semibold">
                                        ✅ Vos documents ont été générés avec succès !
                                      </p>
                                    </div>

                                    {/* CV Généré */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 mb-3">📋 CV Généré</h4>

                                      <div
                                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-inner max-h-80 overflow-y-auto prose prose-sm"
                                        dangerouslySetInnerHTML={{
                                          __html: marked.parse(generatedDocuments.cv) as string,

                                        }}
                                      />

                                      <div className="flex space-x-2 mt-3">
                                        <button
                                          onClick={() => downloadDocument(generatedDocuments.cv, 'CV_Candidature', 'docx')}
                                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                                        >
                                          📥 Télécharger en Word
                                        </button>
                                        <button
                                          onClick={() => downloadDocument(generatedDocuments.cv, 'CV_Candidature', 'pdf')}
                                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                                        >
                                          📥 Télécharger en PDF
                                        </button>
                                      </div>
                                    </div>

                                    {/* Lettre de motivation générée */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-gray-900 mb-3">✉️ Lettre de motivation</h4>
                                      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-inner max-h-80 overflow-y-auto">
                                        <p className="whitespace-pre-line text-gray-800 leading-relaxed text-[15px] font-[450]">
                                          {generatedDocuments.letter}</p>
                                      </div>
                                      <div className="flex space-x-2 mt-3">
                                        <button
                                          onClick={() => downloadDocument(generatedDocuments.letter, 'Lettre_Motivation', 'docx')}
                                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                                        >
                                          📥 Télécharger en Word
                                        </button>
                                        <button
                                          onClick={() => downloadDocument(generatedDocuments.letter, 'Lettre_Motivation', 'pdf')}
                                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                                        >
                                          📥 Télécharger en PDF
                                        </button>
                                      </div>
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                      <button
                                        onClick={() => setGeneratedDocuments(null)}
                                        className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                                      >
                                        ↻ Générer d'autres documents
                                      </button>
                                      <button
                                        onClick={() => setShowDocumentGenerator(false)}
                                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                                      >
                                        ✓ Terminer
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-orange-900 mb-3">🎤 Préparation à l'entretien</h4>
                        <p className="text-orange-800 mb-4">
                          Entraînez-vous avec notre simulateur d'entretien pédagogique.
                        </p>
                        <button
                          onClick={() => window.location.href = '/preparation-entretien'}
                          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-semibold transition-colors"
                        >
                          💬 Se préparer à l'entretien avec l'IA
                        </button>
                      </div>
                    )}

                    {/* Liens officiels */}
                    {currentStepData.official_link && (
                      <div className="mt-6">
                        <a
                          href={currentStepData.official_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          <span > {getOfficialLinkName(currentStepData.step_number)}</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation entre étapes */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Étape précédente
              </button>
              <button
                onClick={() => setCurrentStep(prev => Math.min(procedureSteps.length, prev + 1))}
                disabled={currentStep === procedureSteps.length}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Étape suivante
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Modale de rendez-vous pour l'accompagnement Campus France */}
            {showAppointmentModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">📅 Accompagnement Campus France</h3>
                      <button
                        onClick={() => {
                          setShowAppointmentModal(false);
                          setAppointmentConfirmed(false);
                          setSelectedAppointment(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    {!appointmentConfirmed ? (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">🎁 Premier rendez-vous gratuit</h4>
                          <p className="text-blue-800 text-sm">
                            Séance d'1 heure en visioconférence Teams/Google Meet pour vous accompagner dans la création de votre compte Campus France
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Choisissez un créneau disponible :</h4>

                          {isLoadingAppointments ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                              <p className="text-gray-600 mt-2">Chargement des créneaux...</p>
                            </div>
                          ) : appointmentSlots.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                              {appointmentSlots
                                .filter(slot => slot.is_available)
                                .map((slot) => (
                                  <div
                                    key={slot.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAppointment === slot.id
                                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                                      }`}
                                    onClick={() => setSelectedAppointment(slot.id)}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-semibold text-gray-900">
                                          {new Date(slot.date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}
                                        </p>
                                        <p className="text-gray-600">
                                          {slot.start_time} - {slot.end_time}
                                        </p>
                                      </div>
                                      {selectedAppointment === slot.id && (
                                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                          <span className="text-white text-sm">✓</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <p className="text-gray-600">Aucun créneau disponible pour le moment.</p>
                              <p className="text-sm text-gray-500 mt-2">Veuillez réessayer ultérieurement.</p>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <button
                            onClick={() => setShowAppointmentModal(false)}
                            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => selectedAppointment && bookAppointment(selectedAppointment)}
                            disabled={!selectedAppointment}
                            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                          >
                            Confirmer le rendez-vous gratuit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-green-600 text-2xl">✓</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Rendez-vous confirmé !</h4>
                        <p className="text-gray-600 mb-4">
                          Votre séance d'accompagnement gratuit a été réservée avec succès.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                          Vous recevrez le lien de visioconférence par email et dans vos notifications.
                        </p>
                        <button
                          onClick={() => setShowAppointmentModal(false)}
                          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Parfait !
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}