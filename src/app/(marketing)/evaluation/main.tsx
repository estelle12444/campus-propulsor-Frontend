'use client';

import { useState } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Enregistrer les composants Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface FormData {
    bacType: string;
    bacMention: string;
    diplomeMention: string;
    aptitudeTest: string;
    englishTest: string;
    interviewEn: string;
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

const scoring = {
    bacType: { litteraire: 50, technique: 85, scientifique: 100 },
    mention: { passable: 40, 'assez-bien': 60, bien: 80, 'tres-bien': 100 },
    aptitude: {
        'non-passe': 0,
        'tage-mage-faible': 30,
        'gmat-faible': 30,
        'tage-mage-moyen': 50,
        'gmat-moyen': 50,
        'tage-mage-bon': 80,
        'gmat-bon': 80,
        'tage-mage-excellent': 100,
        'gmat-excellent': 100
    },
    english: { 'non-passe': 20, b2: 60, c1: 90, c2: 100 },
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

export default function AutoEvaluation() {
    const [formData, setFormData] = useState<FormData>({
        bacType: 'scientifique',
        bacMention: 'passable',
        diplomeMention: 'passable',
        aptitudeTest: 'non-passe',
        englishTest: 'non-passe',
        interviewEn: 'non'
    });

    const [results, setResults] = useState<{
        show: boolean;
        rank: string;
        scores: Scores;
        finalScore: number;
    } | null>(null);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateScores = (data: FormData): Scores => {
        const academicScore =
            (scoring.bacType[data.bacType as keyof typeof scoring.bacType] * 0.4) +
            (scoring.mention[data.bacMention as keyof typeof scoring.mention] * 0.3) +
            (scoring.mention[data.diplomeMention as keyof typeof scoring.mention] * 0.3);

        const aptitudeScore = scoring.aptitude[data.aptitudeTest as keyof typeof scoring.aptitude];
        const englishScore =
            (scoring.english[data.englishTest as keyof typeof scoring.english] * 0.7) +
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

        setResults({
            show: true,
            rank,
            scores,
            finalScore
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
                                        </div>

                                        {/* Tests & Compétences */}
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-semibold text-sky-800 border-b-2 border-amber-300 pb-2">
                                                Tests & Compétences
                                            </h3>

                                            <div>
                                                <label htmlFor="aptitude-test" className="block text-md font-medium text-gray-700 mb-2">
                                                    Test d'aptitude
                                                </label>
                                                <select
                                                    id="aptitude-test"
                                                    value={formData.aptitudeTest}
                                                    onChange={(e) => handleInputChange('aptitudeTest', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non-passe">Non passé</option>
                                                    <option value="tage-mage-faible">TAGE MAGE (&lt; 300)</option>
                                                    <option value="tage-mage-moyen">TAGE MAGE (300-350)</option>
                                                    <option value="tage-mage-bon">TAGE MAGE (351-400)</option>
                                                    <option value="tage-mage-excellent">TAGE MAGE (&gt; 400)</option>
                                                    <option value="gmat-faible">GMAT (&lt; 600)</option>
                                                    <option value="gmat-moyen">GMAT (600-680)</option>
                                                    <option value="gmat-bon">GMAT (681-720)</option>
                                                    <option value="gmat-excellent">GMAT (&gt; 720)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="english-test" className="block text-md font-medium text-gray-700 mb-2">
                                                    Test d'anglais
                                                </label>
                                                <select
                                                    id="english-test"
                                                    value={formData.englishTest}
                                                    onChange={(e) => handleInputChange('englishTest', e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                >
                                                    <option value="non-passe">Non passé</option>
                                                    <option value="b2">Niveau B2 (TOEFL 72-94, IELTS 5.5-6.5)</option>
                                                    <option value="c1">Niveau C1 (TOEFL 95-113, IELTS 7.0-8.0)</option>
                                                    <option value="c2">Niveau C2 (TOEFL 114+, IELTS 8.5+)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="interview-en" className="block text-md font-medium text-gray-700 mb-2">
                                                    Capacité à mener un entretien de 30 min en anglais
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
                                    </div>

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

                                                {/* Après la section des résultats, ajouter ce bouton */}
                                                <div className="text-center mt-8">
                                                    <button
                                                        onClick={() => {
                                                            setResults(null);
                                                            setFormData({
                                                                bacType: 'scientifique',
                                                                bacMention: 'passable',
                                                                diplomeMention: 'passable',
                                                                aptitudeTest: 'non-passe',
                                                                englishTest: 'non-passe',
                                                                interviewEn: 'non'
                                                            });
                                                        }}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mr-4"
                                                    >
                                                        ↺ Refaire l'auto-évaluation
                                                    </button>

                                                    <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                                                        S'inscrire pour continuer ✓
                                                    </button>
                                                </div>
                                            </div>

                                            {/* <div className="lg:col-span-2">
                        <div className="chart-container" style={{ height: '350px', maxHeight: '400px' }}>
                          {chartData && <Radar data={chartData} options={chartOptions} />}
                        </div>
                      </div> */}

                                            {/* Au lieu du graphique Radar - Section Prochaines Étapes */}
                                            <div className="lg:col-span-2">
                                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                                    <h4 className="text-xl font-bold text-sky-800 mb-4">Prochaines Étapes Recommandées</h4>

                                                    <div className="space-y-4">
                                                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                                            <div>
                                                                <h5 className="font-semibold text-blue-800">Définition du projet professionnel</h5>
                                                                <p className="text-sm text-gray-600 mt-1">Accompagnement personnalisé pour clarifier vos objectifs de carrière</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                                            <div>
                                                                <h5 className="font-semibold text-green-800">Guidance plateforme "Études en France"</h5>
                                                                <p className="text-sm text-gray-600 mt-1">Assistance complète pour la création et soumission de votre dossier</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                                            <div>
                                                                <h5 className="font-semibold text-amber-800">Recherche de bourses</h5>
                                                                <p className="text-sm text-gray-600 mt-1">Identification des opportunités de financement adaptées à votre profil</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
                                                        <p className="text-sm text-sky-800 font-medium mb-3">
                                                           🎯 Ne laissez pas votre potentiel inexploité ! 
                                                        </p>
                                                        <button   onClick={() => window.location.href = '/inscription'}
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