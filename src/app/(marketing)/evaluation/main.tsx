'use client';

import { useState, useEffect } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

import { useModal } from '@/app/context/ModalContext';

// Enregistrer les composants Chart.js
// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface FormData {
    bacType: string;
    bacMention: string;
    diplomeMention: string;
    anneeDiplome: string;
    experiencePro: string;
    tageMageTest: string;
    gmatTest: string;
    toeflTest: string;
    ieltsTest: string;
    toeicTest: string;
    cambridgeTest: string;
    interviewEn: string;
    tageMageDate: string;
    gmatDate: string;
    greDate: string;
    toeflDate: string;
    ieltsDate: string;
    toeicDate: string;
    cambridgeDate: string;
}

interface Scores {
    academic: number;
    aptitude: number;
    english: number;
}

interface ResultContent {
    rankText: string;
    badgeClass: string;
    analysis: string;
    employment: string;
    prestige: string;
}

interface School {
    nom: string;
    ville: string;
    type: string;
}

interface TestValidity {
    isValid: boolean;
    message: string;
}

const scoring = {
    bacType: { litteraire: 50, technique: 85, scientifique: 100 },
    mention: { passable: 40, 'assez-bien': 60, bien: 80, 'tres-bien': 100 },
    anneeDiplome: { 
        'moins-2': 30, 
        '2-5': 70, 
        'plus-5': 100 
    },
    experiencePro: {
        'aucune': 30,
        'stage': 60,
        '1-2-ans': 80,
        'plus-2-ans': 100
    },
    tageMage: {
        'non-passe': 0,
        'faible': 30,
        'moyen': 50,
        'bon': 80,
        'excellent': 100
    },
    gmat: {
        'non-passe': 0,
        'faible': 30,
        'moyen': 50,
        'bon': 80,
        'excellent': 100
    },
    toefl: {
        'non-passe': 0,
        'b2': 60,
        'c1': 90,
        'c2': 100
    },
    ielts: {
        'non-passe': 0,
        'b2': 60,
        'c1': 90,
        'c2': 100
    },
    toeic: {
        'non-passe': 0,
        'b2': 60,
        'c1': 90,
        'c2': 100
    },
    cambridge: {
        'non-passe': 0,
        'b2': 60,
        'c1': 90,
        'c2': 100
    },
    interview: { non: 0, oui: 100 }
};

const resultsContent: Record<string, ResultContent> = {
    A: {
        rankText: "Rang A",
        badgeClass: "bg-green-600",
        analysis: "Votre profil est excellent et correspond aux attentes des établissements les plus prestigieux (HEC, ESSEC, ESCP, Polytechnique, etc.). Vous avez de très grandes chances d'être admissible.",
        employment: "Le taux d'emploi à la sortie est exceptionnel, souvent proche de 100% dans les 3 mois, avec des salaires de départ très élevés.",
        prestige: "Ces diplômes sont des sésames reconnus internationalement par les recruteurs de haut niveau, ouvrant les portes des carrières les plus sélectives."
    },
    B: {
        rankText: "Rang B",
        badgeClass: "bg-sky-600",
        analysis: "Vous avez un très bon profil, solide et cohérent, qui vous positionne idéalement pour les excellentes écoles de commerce et d'ingénieurs (EDHEC, EM Lyon, GEM, etc.).",
        employment: "L'insertion professionnelle est très rapide et de grande qualité. Les diplômés sont très recherchés pour des postes à responsabilité.",
        prestige: "Ces écoles jouissent d'une forte notoriété auprès des entreprises en France et en Europe, garantissant une excellente reconnaissance de votre diplôme."
    },
    C: {
        rankText: "Rang C",
        badgeClass: "bg-amber-600",
        analysis: "Votre profil est intéressant mais pourrait être renforcé pour viser les écoles les plus sélectives. Vous avez toutes vos chances dans de très bons établissements et universités en France.",
        employment: "Le taux d'emploi reste bon, bien que potentiellement moins rapide ou sur des postes de départ différents des rangs A/B. La spécialisation choisie sera un facteur clé.",
        prestige: "La reconnaissance du diplôme dépendra de l'établissement et de la spécialité. Un bon stage de fin d'études sera déterminant pour votre carrière."
    }
};

// Listes exhaustives des écoles de rang A et B
const schoolsRankA = [
    "HEC Paris", "ESSEC Paris", "ESCP", "emlyon BS", "Sciences Po Paris",
    "École Polytechnique (IP Paris)", "CentraleSupélec (U. Paris-Saclay)",
    "Mines Paris-PSL", "Université Paris Dauphine-PSL",
    "École des Ponts ParisTech (IP Paris)", "Télécom Paris (IP Paris)", "INSEAD"
];

const schoolsRankB = [
    "EDHEC", "SKEMA Business School", "Audencia", "NEOMA", "Kedge",
    "Grenoble EM", "Toulouse Business School", "Ensae", "IMT Atlantique",
    "ENSTA Paris", "ISAE-SUPAERO", "Groupe des Écoles Centrales (Lyon, Nantes, Lille)",
    "Groupe des Mines (Nancy, Saint-Étienne)", "Grenoble INP (Ensimag, Phelma)",
    "INSA Lyon", "Universités de Technologie (UTC, UTT, UTBM)",
    "Paris-Panthéon-Assas", "Paris 1 Panthéon-Sorbonne",
    "Claude Bernard Lyon 1", "Toulouse School of Economics"
];

export default function AutoEvaluation() {
    const { openRegisterModal, openLoginModal } = useModal();
    const [formData, setFormData] = useState<FormData>({
        bacType: 'scientifique',
        bacMention: 'passable',
        diplomeMention: 'passable',
        anneeDiplome: 'moins-2',
        experiencePro: 'aucune',
        tageMageTest: 'non-passe',
        gmatTest: 'non-passe',
        toeflTest: 'non-passe',
        ieltsTest: 'non-passe',
        toeicTest: 'non-passe',
        cambridgeTest: 'non-passe',
        interviewEn: 'non',
        tageMageDate: '',
        gmatDate: '',
        greDate: '',
        toeflDate: '',
        ieltsDate: '',
        toeicDate: '',
        cambridgeDate: ''
    });

    const [results, setResults] = useState<{
        show: boolean;
        rank: string;
        scores: Scores;
        finalScore: number;
        expiredTests: string[];
        expiringTests: string[];
    } | null>(null);

    const [testValidity, setTestValidity] = useState<Record<string, TestValidity>>({});
    const [schoolsRankC, setSchoolsRankC] = useState<School[]>([]);
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [showTestDates, setShowTestDates] = useState(false);

    // Vérifier si au moins un test a été passé
    useEffect(() => {
        const hasPassedTest = 
            formData.tageMageTest !== 'non-passe' ||
            formData.gmatTest !== 'non-passe' ||
            formData.toeflTest !== 'non-passe' ||
            formData.ieltsTest !== 'non-passe' ||
            formData.toeicTest !== 'non-passe' ||
            formData.cambridgeTest !== 'non-passe';
        
        setShowTestDates(hasPassedTest);
    }, [
        formData.tageMageTest,
        formData.gmatTest,
        formData.toeflTest,
        formData.ieltsTest,
        formData.toeicTest,
        formData.cambridgeTest
    ]);

    // Fonction pour vérifier la validité d'un test
    const checkTestValidity = (testDate: string, validityYears: number): TestValidity => {
        if (!testDate) return { isValid: true, message: '' };

        const testDateObj = new Date(testDate);
        const today = new Date();
        const expiryDate = new Date(testDateObj);
        expiryDate.setFullYear(expiryDate.getFullYear() + validityYears);

        if (today > expiryDate) {
            return {
                isValid: false,
                message: `Expiré depuis ${Math.ceil((today.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24))} jours`
            };
        } else {
            const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return {
                isValid: daysLeft > 30, // Considéré comme bientôt expiré si moins de 30 jours
                message: daysLeft > 30 ? `Valide (expire dans ${Math.ceil(daysLeft / 30)} mois)` : `Expire bientôt (dans ${daysLeft} jours)`
            };
        }
    };

    // Vérifier la validité des tests lorsque les dates changent
    useEffect(() => {
        const validity: Record<string, TestValidity> = {};

        if (formData.tageMageDate && formData.tageMageTest !== 'non-passe') {
            validity.tageMage = checkTestValidity(formData.tageMageDate, 2);
        }
        if (formData.gmatDate && formData.gmatTest !== 'non-passe') {
            validity.gmat = checkTestValidity(formData.gmatDate, 5);
        }
        if (formData.greDate) {
            validity.gre = checkTestValidity(formData.greDate, 5);
        }
        if (formData.toeflDate && formData.toeflTest !== 'non-passe') {
            validity.toefl = checkTestValidity(formData.toeflDate, 2);
        }
        if (formData.ieltsDate && formData.ieltsTest !== 'non-passe') {
            validity.ielts = checkTestValidity(formData.ieltsDate, 2);
        }
        if (formData.toeicDate && formData.toeicTest !== 'non-passe') {
            validity.toeic = checkTestValidity(formData.toeicDate, 2);
        }
        if (formData.cambridgeDate && formData.cambridgeTest !== 'non-passe') {
            // Cambridge n'a pas de date d'expiration officielle mais on considère 3 ans
            validity.cambridge = checkTestValidity(formData.cambridgeDate, 3);
        }

        setTestValidity(validity);
    }, [
        formData.tageMageDate,
        formData.gmatDate,
        formData.greDate,
        formData.toeflDate,
        formData.ieltsDate,
        formData.toeicDate,
        formData.cambridgeDate,
        formData.tageMageTest,
        formData.gmatTest,
        formData.toeflTest,
        formData.ieltsTest,
        formData.toeicTest,
        formData.cambridgeTest
    ]);

    // Fonction pour récupérer les écoles de rang C via l'API
    const fetchSchoolsRankC = async () => {
        setLoadingSchools(true);
        try {
            const response = await fetch(
                'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-principaux-etablissements-enseignement-superieur/records?limit=100'
            );
            const data = await response.json();
            console.log(data);
            if (data.results) {
                // Filtrer pour exclure les écoles de rang A et B
                const filteredSchools = data.results
                    .filter((school: any) => {
                        const schoolName = school.uo_lib?.toLowerCase() || '';
                        return (
                            !schoolsRankA.some(rankASchool =>
                                rankASchool.toLowerCase().includes(schoolName) ||
                                schoolName.includes(rankASchool.toLowerCase())
                            ) &&
                            !schoolsRankB.some(rankBSchool =>
                                rankBSchool.toLowerCase().includes(schoolName) ||
                                schoolName.includes(rankBSchool.toLowerCase())
                            )
                        );
                    })
                    .map((school: any) => ({
                        nom: school.uo_lib || 'Nom non disponible',
                        ville: school.com_nom || school.dep_nom || 'Ville non disponible',
                        type: school.type_d_etablissement || 'Type non disponible',
                    }));

                setSchoolsRankC(filteredSchools);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des écoles:', error);
        } finally {
            setLoadingSchools(false);
        }
    };

    useEffect(() => {
        if (results?.show && results.rank === 'C') {
            fetchSchoolsRankC();
        }
    }, [results]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateScores = (data: FormData): Scores => {
        const academicScore =
            (scoring.bacType[data.bacType as keyof typeof scoring.bacType] * 0.3) +
            (scoring.mention[data.bacMention as keyof typeof scoring.mention] * 0.2) +
            (scoring.mention[data.diplomeMention as keyof typeof scoring.mention] * 0.2) +
            (scoring.anneeDiplome[data.anneeDiplome as keyof typeof scoring.anneeDiplome] * 0.15) +
            (scoring.experiencePro[data.experiencePro as keyof typeof scoring.experiencePro] * 0.15);

        // Prendre le meilleur score entre TAGE MAGE et GMAT
        const tageMageScore = scoring.tageMage[data.tageMageTest as keyof typeof scoring.tageMage];
        const gmatScore = scoring.gmat[data.gmatTest as keyof typeof scoring.gmat];
        const aptitudeScore = Math.max(tageMageScore, gmatScore);

        // Prendre le meilleur score entre TOEFL, IELTS, TOEIC et Cambridge
        const toeflScore = scoring.toefl[data.toeflTest as keyof typeof scoring.toefl];
        const ieltsScore = scoring.ielts[data.ieltsTest as keyof typeof scoring.ielts];
        const toeicScore = scoring.toeic[data.toeicTest as keyof typeof scoring.toeic];
        const cambridgeScore = scoring.cambridge[data.cambridgeTest as keyof typeof scoring.cambridge];
        const englishTestScore = Math.max(toeflScore, ieltsScore, toeicScore, cambridgeScore);
        
        const englishScore = englishTestScore * 0.7 +
            (scoring.interview[data.interviewEn as keyof typeof scoring.interview] * 0.3);

        return {
            academic: academicScore,
            aptitude: aptitudeScore,
            english: englishScore
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const scores = calculateScores(formData);
        const finalScore = (scores.academic * 0.4) + (scores.aptitude * 0.35) + (scores.english * 0.25);

        let rank: string;
        if (finalScore > 85) rank = 'A';
        else if (finalScore >= 65) rank = 'B';
        else rank = 'C';

        // Vérifier les tests expirés ou bientôt expirés
        const expiredTests: string[] = [];
        const expiringTests: string[] = [];

        Object.entries(testValidity).forEach(([test, validity]) => {
            if (validity.message.includes('Expiré')) {
                expiredTests.push(test);
            } else if (validity.message.includes('Expire bientôt')) {
                expiringTests.push(test);
            }
        });

        setResults({
            show: true,
            rank,
            scores,
            finalScore,
            expiredTests,
            expiringTests
        });
    };

    const chartData = results ? {
        labels: ['Parcours Académique', 'Test d\'Aptitude', 'Niveau d\'Anglais'],
        datasets: [{
            label: 'Votre Profil',
            data: [results.scores.academic, results.scores.aptitude, results.scores.english],
            backgroundColor: 'rgba(3, 105, 161, 0.2)',
            borderColor: 'rgb(3, 105, 161)',
            pointBackgroundColor: 'rgb(3, 105, 161)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(3, 105, 161)',
            borderWidth: 2
        }]
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                pointLabels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#374151'
                },
                ticks: {
                    backdropColor: 'rgba(255, 251, 235, 0.8)',
                    color: '#4b5563',
                    stepSize: 20
                },
                min: 0,
                max: 100
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 16
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: ${Math.round(context.raw)}`;
                    }
                }
            }
        }
    };

    const getValidityClass = (isValid: boolean, message: string) => {
        if (message.includes('Expiré')) return 'text-red-600 bg-red-50 border-red-200';
        if (message.includes('Expire bientôt')) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };

    const getTestDisplayName = (test: string) => {
        const testNames: Record<string, string> = {
            'tageMage': 'TAGE MAGE',
            'gmat': 'GMAT',
            'gre': 'GRE',
            'toefl': 'TOEFL iBT',
            'ielts': 'IELTS',
            'toeic': 'TOEIC',
            'cambridge': 'Cambridge English'
        };
        return testNames[test] || test;
    };

    return (
        <main className="main">
            {/* Page Title */}
            <div className="page-title">
                <div className="heading">
                    <div className="container">
                        <div className="row d-flex justify-content-center text-center">
                            <div className="col-lg-8">
                                <h1 className="heading-title">Auto-Évaluation Grandes Écoles</h1>
                                <p className="mb-0">
                                    Évaluez votre profil pour les grandes écoles françaises avec notre outil d'orientation spécialisé.
                                    Obtenez une analyse détaillée de vos chances d'admission et des conseils personnalisés.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li><a href="/">Accueil</a></li>
                            <li className="current">Auto-Évaluation</li>
                        </ol>
                    </div>
                </nav>
            </div>

            {/* Auto-Évaluation Section */}
            <section id="auto-evaluation" className="section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="evaluation-card bg-white rounded-2xl shadow-lg p-6">
                                <header className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-sky-900">
                                        Évaluez Votre Profil pour les Grandes Écoles
                                    </h2>
                                    <p className="mt-3 text-lg text-gray-600">
                                        Un outil d'orientation pour les étudiants ivoiriens visant la France.
                                    </p>
                                </header>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Parcours Académique */}
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-semibold text-sky-800 border-b-2 border-amber-300 pb-2">
                                                Parcours Académique
                                            </h3>

                                            <div>
                                                <label htmlFor="bac-type" className="block text-md font-medium text-gray-700 mb-2">
                                                    Série du Baccalauréat
                                                </label>
                                                <select
                                                    id="bac-type"
                                                    value={formData.bacType}
                                                    onChange={(e) => handleInputChange('bacType', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="scientifique">Scientifique (C, D, E)</option>
                                                    <option value="litteraire">Littéraire (A)</option>
                                                    <option value="technique">Technique (B, F, G)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="bac-mention" className="block text-md font-medium text-gray-700 mb-2">
                                                    Mention au Baccalauréat
                                                </label>
                                                <select
                                                    id="bac-mention"
                                                    value={formData.bacMention}
                                                    onChange={(e) => handleInputChange('bacMention', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="passable">Passable</option>
                                                    <option value="assez-bien">Assez Bien</option>
                                                    <option value="bien">Bien</option>
                                                    <option value="tres-bien">Très Bien</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="diplome-mention" className="block text-md font-medium text-gray-700 mb-2">
                                                    Mention du dernier diplôme (Licence, Master, etc.)
                                                </label>
                                                <select
                                                    id="diplome-mention"
                                                    value={formData.diplomeMention}
                                                    onChange={(e) => handleInputChange('diplomeMention', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="passable">Passable / Sans Mention</option>
                                                    <option value="assez-bien">Assez Bien</option>
                                                    <option value="bien">Bien</option>
                                                    <option value="tres-bien">Très Bien</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="annee-diplome" className="block text-md font-medium text-gray-700 mb-2">
                                                    Années depuis l'obtention du dernier diplôme
                                                </label>
                                                <select
                                                    id="annee-diplome"
                                                    value={formData.anneeDiplome}
                                                    onChange={(e) => handleInputChange('anneeDiplome', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="moins-2">Moins de 2 ans</option>
                                                    <option value="2-5">2 à 5 ans</option>
                                                    <option value="plus-5">Plus de 5 ans</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="experience-pro" className="block text-md font-medium text-gray-700 mb-2">
                                                    Expérience professionnelle
                                                </label>
                                                <select
                                                    id="experience-pro"
                                                    value={formData.experiencePro}
                                                    onChange={(e) => handleInputChange('experiencePro', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="aucune">Aucune expérience</option>
                                                    <option value="stage">Stage(s) uniquement</option>
                                                    <option value="1-2-ans">1 à 2 ans d'expérience</option>
                                                    <option value="plus-2-ans">Plus de 2 ans d'expérience</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="interview-en" className="block text-md font-medium text-gray-700 mb-2">
                                                    Capacité à mener un entretien d'au moins 30 min en anglais
                                                </label>
                                                <select
                                                    id="interview-en"
                                                    value={formData.interviewEn}
                                                    onChange={(e) => handleInputChange('interviewEn', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non">Non</option>
                                                    <option value="oui">Oui</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Tests & Compétences */}
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-semibold text-sky-800 border-b-2 border-amber-300 pb-2">
                                                Tests & Compétences
                                            </h3>

                                            {/* Test d'aptitude - TAGE MAGE */}
                                            <div>
                                                <label htmlFor="tage-mage-test" className="block text-md font-medium text-gray-700 mb-2">
                                                    Test TAGE MAGE
                                                </label>
                                                <select
                                                    id="tage-mage-test"
                                                    value={formData.tageMageTest}
                                                    onChange={(e) => handleInputChange('tageMageTest', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non-passe">Non passé</option>
                                                    <option value="faible">Score faible (&lt; 300)</option>
                                                    <option value="moyen">Score moyen (300-350)</option>
                                                    <option value="bon">Bon score (351-400)</option>
                                                    <option value="excellent">Score excellent (&gt; 400)</option>
                                                </select>
                                            </div>

                                            {/* Test d'aptitude - GMAT */}
                                            <div>
                                                <label htmlFor="gmat-test" className="block text-md font-medium text-gray-700 mb-2">
                                                    Test GMAT
                                                </label>
                                                <select
                                                    id="gmat-test"
                                                    value={formData.gmatTest}
                                                    onChange={(e) => handleInputChange('gmatTest', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non-passe">Non passé</option>
                                                    <option value="faible">Score faible (&lt; 600)</option>
                                                    <option value="moyen">Score moyen (600-680)</option>
                                                    <option value="bon">Bon score (681-720)</option>
                                                    <option value="excellent">Score excellent (&gt; 720)</option>
                                                </select>
                                            </div>

                                            {/* Test d'anglais - TOEFL */}
                                            <div>
                                                <label htmlFor="toefl-test" className="block text-md font-medium text-gray-700 mb-2">
                                                    Test TOEFL iBT
                                                </label>
                                                <select
                                                    id="toefl-test"
                                                    value={formData.toeflTest}
                                                    onChange={(e) => handleInputChange('toeflTest', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non-passe">Non passé</option>
                                                    <option value="b2">Niveau B2 (72-94)</option>
                                                    <option value="c1">Niveau C1 (95-113)</option>
                                                    <option value="c2">Niveau C2 (114+)</option>
                                                </select>
                                            </div>

                                            {/* Test d'anglais - IELTS */}
                                            <div>
                                                <label htmlFor="ielts-test" className="block text-md font-medium text-gray-700 mb-2">
                                                    Test IELTS
                                                </label>
                                                <select
                                                    id="ielts-test"
                                                    value={formData.ieltsTest}
                                                    onChange={(e) => handleInputChange('ieltsTest', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non-passe">Non passé</option>
                                                    <option value="b2">Niveau B2 (5.5-6.5)</option>
                                                    <option value="c1">Niveau C1 (7.0-8.0)</option>
                                                    <option value="c2">Niveau C2 (8.5+)</option>
                                                </select>
                                            </div>

                                            {/* Test d'anglais - TOEIC */}
                                            <div>
                                                <label htmlFor="toeic-test" className="block text-md font-medium text-gray-700 mb-2">
                                                    Test TOEIC
                                                </label>
                                                <select
                                                    id="toeic-test"
                                                    value={formData.toeicTest}
                                                    onChange={(e) => handleInputChange('toeicTest', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non-passe">Non passé</option>
                                                    <option value="b2">Niveau B2 (785-940)</option>
                                                    <option value="c1">Niveau C1 (945-990)</option>
                                                </select>
                                            </div>

                                            {/* Test d'anglais - Cambridge */}
                                            <div>
                                                <label htmlFor="cambridge-test" className="block text-md font-medium text-gray-700 mb-2">
                                                    Test Cambridge English
                                                </label>
                                                <select
                                                    id="cambridge-test"
                                                    value={formData.cambridgeTest}
                                                    onChange={(e) => handleInputChange('cambridgeTest', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non-passe">Non passé</option>
                                                    <option value="b2">Niveau B2 (First)</option>
                                                    <option value="c1">Niveau C1 (Advanced)</option>
                                                    <option value="c2">Niveau C2 (Proficiency)</option>
                                                </select>
                                            </div>

                                            
                                        </div>
                                    </div>

                                    {/* Section Dates des Tests - Affichage conditionnel */}
                                    {showTestDates && (
                                        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                            <h3 className="text-xl font-bold text-sky-800 mb-4">📅 Dates de passage des tests (Obligatoire)</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Entrez la date de passage de vos tests pour vérifier leur validité
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {/* TAGE MAGE - affiché seulement si test passé */}
                                                {formData.tageMageTest !== 'non-passe' && (
                                                    <div>
                                                        <label htmlFor="tage-mage-date" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Date TAGE MAGE
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="tage-mage-date"
                                                            value={formData.tageMageDate}
                                                            onChange={(e) => handleInputChange('tageMageDate', e.target.value)}
                                                            className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        />
                                                        {testValidity.tageMage && (
                                                            <div className={`text-xs mt-1 p-1 rounded border ${getValidityClass(testValidity.tageMage.isValid, testValidity.tageMage.message)}`}>
                                                                {testValidity.tageMage.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* GMAT - affiché seulement si test passé */}
                                                {formData.gmatTest !== 'non-passe' && (
                                                    <div>
                                                        <label htmlFor="gmat-date" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Date GMAT
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="gmat-date"
                                                            value={formData.gmatDate}
                                                            onChange={(e) => handleInputChange('gmatDate', e.target.value)}
                                                            className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        />
                                                        {testValidity.gmat && (
                                                            <div className={`text-xs mt-1 p-1 rounded border ${getValidityClass(testValidity.gmat.isValid, testValidity.gmat.message)}`}>
                                                                {testValidity.gmat.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* TOEFL - affiché seulement si test passé */}
                                                {formData.toeflTest !== 'non-passe' && (
                                                    <div>
                                                        <label htmlFor="toefl-date" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Date TOEFL iBT
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="toefl-date"
                                                            value={formData.toeflDate}
                                                            onChange={(e) => handleInputChange('toeflDate', e.target.value)}
                                                            className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        />
                                                        {testValidity.toefl && (
                                                            <div className={`text-xs mt-1 p-1 rounded border ${getValidityClass(testValidity.toefl.isValid, testValidity.toefl.message)}`}>
                                                                {testValidity.toefl.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* IELTS - affiché seulement si test passé */}
                                                {formData.ieltsTest !== 'non-passe' && (
                                                    <div>
                                                        <label htmlFor="ielts-date" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Date IELTS
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="ielts-date"
                                                            value={formData.ieltsDate}
                                                            onChange={(e) => handleInputChange('ieltsDate', e.target.value)}
                                                            className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        />
                                                        {testValidity.ielts && (
                                                            <div className={`text-xs mt-1 p-1 rounded border ${getValidityClass(testValidity.ielts.isValid, testValidity.ielts.message)}`}>
                                                                {testValidity.ielts.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* TOEIC - affiché seulement si test passé */}
                                                {formData.toeicTest !== 'non-passe' && (
                                                    <div>
                                                        <label htmlFor="toeic-date" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Date TOEIC
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="toeic-date"
                                                            value={formData.toeicDate}
                                                            onChange={(e) => handleInputChange('toeicDate', e.target.value)}
                                                            className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        />
                                                        {testValidity.toeic && (
                                                            <div className={`text-xs mt-1 p-1 rounded border ${getValidityClass(testValidity.toeic.isValid, testValidity.toeic.message)}`}>
                                                                {testValidity.toeic.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Cambridge - affiché seulement si test passé */}
                                                {formData.cambridgeTest !== 'non-passe' && (
                                                    <div>
                                                        <label htmlFor="cambridge-date" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Date Cambridge English
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="cambridge-date"
                                                            value={formData.cambridgeDate}
                                                            onChange={(e) => handleInputChange('cambridgeDate', e.target.value)}
                                                            className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        />
                                                        {testValidity.cambridge && (
                                                            <div className={`text-xs mt-1 p-1 rounded border ${getValidityClass(testValidity.cambridge.isValid, testValidity.cambridge.message)}`}>
                                                                {testValidity.cambridge.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Légende de validité */}
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                    <span className="text-green-700">Valide</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                                                    <span className="text-amber-700">Expire bientôt</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                                    <span className="text-red-700">Expiré</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center mt-8">
                                        <button
                                            type="submit"
                                            className="bg-sky-700 text-white font-bold py-3 px-10 rounded-full hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-300 transform hover:scale-105 transition-transform duration-300"
                                        >
                                            Évaluer mon profil
                                        </button>
                                    </div>
                                </form>

                                {/* Résultats */}
                                {results?.show && (
                                    <div className="mt-12 fade-in">
                                        <h2 className="text-3xl font-bold text-center text-sky-900 mb-8">
                                            Votre Résultat d'Évaluation
                                        </h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                                            <div className="lg:col-span-3 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                                <h3 className="font-semibold text-xl mb-2">
                                                    Catégorie d'établissements visée :{' '}
                                                    <span className="font-bold text-2xl">
                                                        {resultsContent[results.rank].rankText}
                                                    </span>
                                                </h3>
                                                <div className={`inline-block px-4 py-1 text-white rounded-full text-lg font-semibold mb-4 ${resultsContent[results.rank].badgeClass}`}>
                                                    {resultsContent[results.rank].rankText}
                                                </div>
                                                <div className="space-y-4 text-gray-700">
                                                    <p>{resultsContent[results.rank].analysis}</p>
                                                    <p>{resultsContent[results.rank].employment}</p>
                                                    <p>{resultsContent[results.rank].prestige}</p>
                                                </div>

                                                {/* Alertes pour tests expirés ou bientôt expirés */}
                                                {(results.expiredTests.length > 0 || results.expiringTests.length > 0) && (
                                                    <div className="mt-6 space-y-4">
                                                        {results.expiredTests.length > 0 && (
                                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                                <h4 className="font-bold text-red-800 mb-2">⚠️ Tests expirés</h4>
                                                                <p className="text-red-700 text-sm mb-2">
                                                                    Les tests suivants ont expiré : {results.expiredTests.map(getTestDisplayName).join(', ')}
                                                                </p>
                                                                <p className="text-red-700 text-sm font-semibold">
                                                                    Tu dois repasser le test pour obtenir un nouveau certificat valide. Sans test valide, ton dossier risque d'être incomplet et non recevable par les universités.
                                                                </p>
                                                            </div>
                                                        )}
                                                        {results.expiringTests.length > 0 && (
                                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                                <h4 className="font-bold text-amber-800 mb-2">⚠️ Tests bientôt expirés</h4>
                                                                <p className="text-amber-700 text-sm mb-2">
                                                                    Les tests suivants expirent bientôt : {results.expiringTests.map(getTestDisplayName).join(', ')}
                                                                </p>
                                                                <p className="text-amber-700 text-sm font-semibold">
                                                                    Pense à vérifier la validité de tes tests pour tes candidatures. Un test expiré peut rendre ton dossier incomplet.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Affichage des écoles selon le rang */}
                                                <div className="mt-6">
                                                    <h4 className="font-bold text-lg text-sky-800 mb-3">
                                                        Établissements correspondant à votre profil ({resultsContent[results.rank].rankText}):
                                                    </h4>

                                                    {results.rank === 'A' && (
                                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {schoolsRankA.map((school, index) => (
                                                                    <li key={index} className="text-green-800 font-medium">
                                                                        • {school}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {results.rank === 'B' && (
                                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {schoolsRankB.map((school, index) => (
                                                                    <li key={index} className="text-blue-800 font-medium">
                                                                        • {school}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {results.rank === 'C' && (
                                                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                                            {loadingSchools ? (
                                                                <p className="text-amber-700">Chargement des établissements...</p>
                                                            ) : schoolsRankC.length > 0 ? (
                                                                <div className="max-h-60 overflow-y-auto">
                                                                    <ul className="space-y-2">
                                                                        {schoolsRankC.slice(0, 100).map((school, index) => (
                                                                            <li key={index} className="text-amber-800">
                                                                                <strong>• {school.nom}</strong>
                                                                                {school.ville && <span> - {school.ville}</span>}
                                                                                {school.type && <span> ({school.type})</span>}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ) : (
                                                                <p className="text-amber-700">
                                                                    De nombreuses autres grandes écoles, universités et écoles d'ingénieurs en France correspondent à votre profil.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Boutons d'action */}
                                                <div className="text-center mt-8">
                                                    <button
                                                        onClick={() => {
                                                            setResults(null);
                                                            setFormData({
                                                                bacType: 'scientifique',
                                                                bacMention: 'passable',
                                                                diplomeMention: 'passable',
                                                                anneeDiplome: 'moins-2',
                                                                experiencePro: 'aucune',
                                                                tageMageTest: 'non-passe',
                                                                gmatTest: 'non-passe',
                                                                toeflTest: 'non-passe',
                                                                ieltsTest: 'non-passe',
                                                                toeicTest: 'non-passe',
                                                                cambridgeTest: 'non-passe',
                                                                interviewEn: 'non',
                                                                tageMageDate: '',
                                                                gmatDate: '',
                                                                greDate: '',
                                                                toeflDate: '',
                                                                ieltsDate: '',
                                                                toeicDate: '',
                                                                cambridgeDate: ''
                                                            });
                                                        }}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mr-4"
                                                    >
                                                        ↺ Refaire l'auto-évaluation
                                                    </button>

                                                    <button onClick={openRegisterModal} className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                                                        S'inscrire pour continuer ✓
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Section Prochaines Étapes */}
                                            <div className="lg:col-span-2">
                                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                                    <h4 className="text-xl font-bold text-sky-800 mb-4">Prochaines Étapes Recommandées</h4>

                                                    <div className="space-y-4">
                                                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                                            <div>
                                                                <p className="text-sm text-gray-600 mt-1">Assistance automatique pour la création et la soumission de votre dossier sur "Campus France"</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                                            <div>
                                                                <p className="text-sm text-gray-600 mt-1">Génération automatique de votre projet Professionnel et d'Etude, de votre CV et de votre lettre de motivation assistée par l'Intelligence Artificielle pour vos candidatures aux établissements supérieurs</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                                            <div>
                                                                <p className="text-sm text-gray-600 mt-1">Préparation aux entretiens de "Campus France" et aux entretiens pour vos admissions dans les établissements supérieurs</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
                                                        <p className="text-sm text-sky-800 font-medium mb-3">
                                                            🎯 Ne laissez pas votre potentiel inexploité !
                                                        </p>
                                                        <button onClick={openRegisterModal} 
                                                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                                                            S'inscrire pour bénéficier d'un accompagnement complet
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}