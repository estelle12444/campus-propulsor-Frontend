// app/assistant-arrivee-france/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

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
    };
    is_completed: boolean;
    completed_at: string | null;
}

export default function AssistantArriveeFrance() {
    const procedureId = 2;
    const [currentStep, setCurrentStep] = useState(1);
    const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>([]);
    const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    // Fonction pour obtenir le nom du lien en fonction de l'étape
    const getOfficialLinkName = (stepNumber: number): string => {
        const linkNames: { [key: number]: string } = {
            1: "🌐 Valider son VLS-TS en ligne",
            2: "🏥 S'inscrire à la Sécurité Sociale",
            3: "🎓 Payer la CVEC",
            4: "📋 Finaliser l'inscription administrative",
            5: "🏦 Comparer les banques étudiantes",
            6: "📱 Choisir un forfait mobile",
            7: "💸 Envoyer de l'argent depuis l'étranger",
            8: "🔄 Renouveler son titre de séjour",
        };

        return linkNames[stepNumber] || "🔗 Lien officiel";
    };

    // Récupérer les données de la procédure Arrivée en France
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
                    console.log('🧩 Données progression reçues:', data);
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
    }, [isAuthenticated]);

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
            progress.step.id === stepId && progress.is_completed
        );
    };

    const completedSteps = getCompletedStepsForProcedure();

    const totalSteps = procedureSteps.length;
    const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    const currentStepData = procedureSteps.find(step => step.step_number === currentStep);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement de votre assistant...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header avec navigation */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Arrivée en France - Démarches Administratives</h1>
                            <p className="text-gray-600 mt-2">Guide complet pour vos démarches après votre arrivée en France</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isAuthenticated && user ? (
                                <div className="text-right">
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
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation latérale - Étapes de la procédure */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <div className="mb-6">
                                <h3 className="font-semibold text-lg mb-3">Arrivée en France</h3>
                                <div className="bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {completedSteps} sur {totalSteps} étapes complétées
                                </p>
                            </div>

                            {/* Message de félicitations pour la procédure Arrivée en France */}
                            {progressPercentage === 100 && (
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 mb-4 text-white">
                                    <h4 className="font-bold mb-2">🎉 Service 2 terminé !</h4>
                                    <p className="text-green-100 text-sm">
                                        Félicitations, vous avez complété toutes les démarches administratives pour votre arrivée en France !
                                    </p>
                                </div>
                            )}

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
                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">
                                                Étape {currentStepData.step_number}: {currentStepData.title}
                                            </h2>
                                            <p className="text-purple-100 opacity-90">
                                                Durée estimée: {currentStepData.estimated_duration || 'Non spécifiée'}
                                                {currentStepData.is_mandatory && ' • Étape obligatoire'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => toggleStepCompletion(currentStepData.id)}
                                            disabled={isStepCompleted(currentStepData.id)}
                                            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${isStepCompleted(currentStepData.id)
                                                ? 'bg-green-500 text-white cursor-default'
                                                : 'bg-white text-purple-600 hover:bg-purple-50'
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
                                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                                Instructions détaillées
                                            </h4>
                                            <div className="text-gray-700 leading-relaxed">
                                                {currentStepData.detailed_explanation.split('\n').map((paragraph, idx) => (
                                                    <p key={idx} className="mb-4">{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bouton Assistant Vidéo IA pour toutes les étapes */}
                                        <div className="bg-gradient-to-r from-red-500 to-pink-600 border border-red-200 rounded-lg p-6 mb-6">
                                            <h4 className="font-semibold text-white mb-3">🎥 Assistant Vidéo IA</h4>
                                            <p className="text-red-100 mb-4">
                                                Regardez notre tutoriel vidéo généré par IA pour maîtriser cette étape facilement.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    // Simuler l'ouverture d'une vidéo IA
                                                    alert(`🎬 Lancement de l'assistant vidéo IA pour: ${currentStepData.title}\n\nCette fonctionnalité ouvrira bientôt un tutoriel vidéo personnalisé généré par intelligence artificielle.`);
                                                }}
                                                className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 font-semibold transition-colors flex items-center"
                                            >
                                                <span className="mr-2">📹</span>
                                                Voir assistant vidéo IA
                                            </button>
                                        </div>

                                        {/* Liens officiels */}
                                        {currentStepData.official_link && (
                                            <div className="mt-6">
                                                <a
                                                    href={currentStepData.official_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                                                >
                                                    <span>{getOfficialLinkName(currentStepData.step_number)}</span>
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
                                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Étape suivante
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}