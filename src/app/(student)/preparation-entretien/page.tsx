// pages/preparation-entretien.js
'use client';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { entretienService } from '../../lib/api';

type Feedback = {
    pointsForts: string[];
    axesAmelioration: string[];
    suggestion: string;
    scoreGlobal?: number;
};

type CategoryKey = string;

interface QuestionData {
    id: number;
    texte: string;
}

interface CategoryData {
    id: number;
    nom: string;
    nombre_questions: number;
    icon?: string;
}

// Extension de l'interface Window pour la reconnaissance vocale
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

export default function PreparationEntretien() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [currentSession, setCurrentSession] = useState<any>(null);
    const [reponseText, setReponseText] = useState('');

    // États pour la reconnaissance vocale
    const [modeReponse, setModeReponse] = useState<'texte' | 'audio'>('texte');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [isAudioSupported, setIsAudioSupported] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const recordingStartTimeRef = useRef<number>(0);
    const recognitionRef = useRef<any>(null);

    // Initialiser la caméra et la reconnaissance vocale
    useEffect(() => {
        chargerCategories();
        if (currentStep === 4) {
            setupCamera();
            initialiserReconnaissanceVocale();
        }
    }, [currentStep]);

    // Synchroniser la transcription avec le texte de réponse
    useEffect(() => {
        if (modeReponse === 'audio') {
            setReponseText(transcription);
        }
    }, [transcription, modeReponse]);

    const chargerCategories = async () => {
        try {
            const categoriesData = await entretienService.getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    };

    const setupCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Erreur d'accès à la caméra/micro:", error);
        }
    };

    const initialiserReconnaissanceVocale = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'fr-FR';

            recognitionRef.current.onresult = (event: any) => {
                let texteInterim = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        setTranscription(prev => prev + event.results[i][0].transcript + ' ');
                    } else {
                        texteInterim += event.results[i][0].transcript;
                    }
                }
                // Mettre à jour l'affichage en temps réel
                if (texteInterim) {
                    // Vous pouvez ajouter un état pour l'affichage temporaire si besoin
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Erreur reconnaissance vocale:', event.error);
                setIsSpeaking(false);
                if (event.error === 'not-allowed') {
                    alert('Microphone non autorisé. Veuillez autoriser l\'accès au microphone.');
                }
            };

            recognitionRef.current.onend = () => {
                if (isSpeaking) {
                    // Redémarrer si on est toujours en mode parole
                    try {
                        recognitionRef.current.start();
                    } catch (error) {
                        console.error('Erreur redémarrage reconnaissance:', error);
                        setIsSpeaking(false);
                    }
                }
            };
        } else {
            console.warn('Reconnaissance vocale non supportée par ce navigateur');
            setIsAudioSupported(false);
        }
    };

    const demarrerParole = () => {
        if (recognitionRef.current && !isSpeaking) {
            setTranscription('');
            setReponseText('');
            setIsSpeaking(true);
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error('Erreur démarrage reconnaissance:', error);
                setIsSpeaking(false);
            }
        }
    };

    const arreterParole = () => {
        if (recognitionRef.current && isSpeaking) {
            setIsSpeaking(false);
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Erreur arrêt reconnaissance:', error);
            }
        }
    };

    const toggleModeReponse = () => {
        if (modeReponse === 'audio' && isSpeaking) {
            arreterParole();
        }
        setModeReponse(modeReponse === 'texte' ? 'audio' : 'texte');
        setTranscription('');
    };

    const startRecording = () => {
        if (!videoRef.current || !videoRef.current.srcObject) return;

        setIsRecording(true);
        recordedChunksRef.current = [];
        recordingStartTimeRef.current = Date.now();

        try {
            const stream = videoRef.current.srcObject as MediaStream;
            const options = { mimeType: 'video/webm;codecs=vp9,opus' };
            mediaRecorderRef.current = new MediaRecorder(stream, options);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.start();
        } catch (error) {
            console.error("Erreur lors du démarrage de l'enregistrement:", error);
        }
    };

    const stopRecording = async () => {
        if (!mediaRecorderRef.current || !isRecording || !currentSession || !currentQuestion) return;

        // Arrêter la parole si active
        if (isSpeaking) {
            arreterParole();
        }

        mediaRecorderRef.current.stop();
        setIsRecording(false);

        const dureeReponse = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setIsLoading(true);

        try {
            // Utiliser le texte de réponse (qu'il soit saisi ou transcrit)
            const texteAnalyse = reponseText.trim() || "Réponse enregistrée lors de l'entretien";

            const result = await entretienService.soumettreReponse(
                currentSession.id,
                currentQuestion.id,
                texteAnalyse,
                dureeReponse
            );

            if (result.analyse) {
                setFeedback({
                    pointsForts: result.analyse.points_forts || ["Bon travail !"],
                    axesAmelioration: result.analyse.axes_amelioration || ["Continuez à vous améliorer"],
                    suggestion: result.analyse.suggestions?.[0] || "Excellent entraînement !",
                    scoreGlobal: result.analyse.score_global || 75
                });
            } else {
                setFeedback({
                    pointsForts: ["Votre réponse a été enregistrée avec succès"],
                    axesAmelioration: ["L'analyse IA n'est pas disponible pour le moment"],
                    suggestion: "Réessayez plus tard ou contactez le support",
                    scoreGlobal: 0
                });
            }
            setShowFeedback(true);
        } catch (error) {
            console.error('Erreur API:', error);
            alert("Erreur lors de la soumission ou de l'analyse de la réponse. Réessayez plus tard.");
        } finally {
            setIsLoading(false);
            setReponseText('');
            setTranscription('');
        }
    };

    const handleCategorySelect = async (categoryName: string) => {
        setSelectedCategory(categoryName);
        try {
            const categorieAPI = categories.find((cat: CategoryData) => cat.nom === categoryName);
            if (!categorieAPI) throw new Error("Catégorie non trouvée dans la base.");

            const session = await entretienService.demarrerSession(categorieAPI.id as number, false);
            setCurrentSession(session);

            const questions = await entretienService.getQuestionsByCategory(categorieAPI.id);
            if (questions.length === 0) throw new Error("Aucune question disponible pour cette catégorie.");

            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            setCurrentQuestion(randomQuestion);
            setCurrentStep(4);

        } catch (error) {
            console.error('Erreur catégorie/question:', error);
        }
    };

    const handleNewQuestion = async () => {
        if (!selectedCategory) return;

        const categorieAPI = categories.find((cat: CategoryData) => cat.nom === selectedCategory);
        if (!categorieAPI) return;

        try {
            const questions = await entretienService.getQuestionsByCategory(categorieAPI.id);
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            setCurrentQuestion(randomQuestion);
            setShowFeedback(false);
            setReponseText('');
            setTranscription('');
            if (isSpeaking) {
                arreterParole();
            }
        } catch (error) {
            console.error('Erreur chargement nouvelle question:', error);
        }
    };

    const handleFullSimulation = async () => {
        try {
            const session = await entretienService.demarrerSession(null, true);
            setCurrentSession(session);
            setCurrentStep(4);
        } catch (error) {
            console.error('Erreur simulation:', error);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReponseText(e.target.value);
    };

    const getFormattedCategories = () => {
        return categories.map(cat => ({
            ...cat,
            icon: getCategoryIcon(cat.nom)
        }));
    };

    const getCategoryIcon = (categoryName: string): string => {
        const iconMap: { [key: string]: string } = {
            'Motivation et choix de la France': '🎯',
            'Projet professionnel': '💼',
            'Financement et Logement': '⚡',
            "Projet d'études": '📚',
            'Personnalité': '👤',
            'Présentation': '📝',
            'Questions pièges': '🏆'
        };
        return iconMap[categoryName] || '❓';
    };

    return (
        <>
            <Head>
                <title>Coach d'Entretien IA - Préparation</title>
                <meta name="description" content="Préparez votre admission pour les grandes écoles et universités françaises avec notre coach IA" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="page-inner">
                    <div className="page-header mb-8">
                        <h1 className="text-3xl font-bold mb-3">Coach d'Entretien IA</h1>
                        <p className="text-lg text-gray-600">
                            Préparez votre admission pour les grandes écoles et universités françaises.
                        </p>
                    </div>

                    {/* Étape 1: Accueil */}
                    {currentStep === 1 && (
                        <div className="card bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="flex justify-center mb-6">
                                <span className="text-6xl">🎓</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Préparez votre entretien Campus France</h2>
                            <p className="text-gray-600 mb-6">
                                Entraînez-vous en conditions réelles avec un coach virtuel assisté par l'IA.
                            </p>
                            <p className="text-sm text-gray-500 mb-8">
                                L'application vous posera des questions types. Vous pourrez répondre par texte ou par parole,
                                puis soumettre votre réponse à l'IA pour obtenir une analyse détaillée.
                            </p>
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                            >
                                Commencer la préparation
                            </button>
                        </div>
                    )}

                    {/* Étape 2: Autorisations */}
                    {currentStep === 2 && (
                        <div className="card bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold mb-6">Autorisation nécessaire</h2>
                            <div className="mb-6">
                                <p className="mb-4">
                                    Cette application demande l'autorisation d'accéder à :
                                </p>
                                <ul className="list-disc pl-5 mb-6">
                                    <li>Votre appareil photo</li>
                                    <li>Votre micro (pour la reconnaissance vocale)</li>
                                </ul>
                                <p className="text-sm text-gray-600 mb-6">
                                    N'autorisez l'accès qu'aux applications auxquelles vous faites confiance.
                                    L'application s'actualisera si vous sélectionnez Autoriser.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors flex-1"
                                >
                                    Ne pas autoriser
                                </button>
                                <button
                                    onClick={() => setCurrentStep(3)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors flex-1"
                                >
                                    Autoriser
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Étape 3: Sélection de thème */}
                    {currentStep === 3 && (
                        <div className="card bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold mb-2 text-center">Choisissez un thème</h2>
                            <p className="text-center text-gray-500 mb-8">
                                Sélectionnez une catégorie pour un entraînement ciblé ou lancez une simulation complète.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {getFormattedCategories().map((category) => (
                                    <div
                                        key={category.id}
                                        className="border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleCategorySelect(category.nom)}
                                    >
                                        <div className="text-3xl mb-3">{category.icon}</div>
                                        <h3 className="font-semibold text-lg">{category.nom}</h3>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {category.nombre_questions} questions
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={handleFullSimulation}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors mb-4"
                                >
                                    🚀 Lancer une simulation complète (aléatoire)
                                </button>
                                <div>
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        Retour à l'accueil
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Étape 4: Entretien en cours */}
                    {currentStep === 4 && (
                        <div className="card bg-white rounded-lg shadow-md p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Colonne Vidéo */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-center">Votre retour vidéo</h3>
                                    <div className="bg-gray-200 aspect-video flex items-center justify-center rounded-lg">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="text-xs text-center mt-2 text-gray-400">
                                        Votre vidéo n'est ni enregistrée, ni transmise.
                                    </div>

                                    {/* Sélecteur de mode de réponse */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mode de réponse :
                                        </label>
                                        <div className="flex gap-2 mb-3">
                                            <button
                                                onClick={() => setModeReponse('texte')}
                                                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                                                    modeReponse === 'texte' 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                ✍️ Texte
                                            </button>
                                            <button
                                                onClick={toggleModeReponse}
                                                disabled={!isAudioSupported}
                                                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                                                    modeReponse === 'audio' 
                                                        ? 'bg-green-600 text-white' 
                                                        : isAudioSupported
                                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {!isAudioSupported ? '🎤 Non supporté' : '🎤 Parole'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Zone de réponse */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {modeReponse === 'texte' ? 'Votre réponse :' : 'Transcription en direct :'}
                                        </label>
                                        
                                        {modeReponse === 'audio' && (
                                            <div className="mb-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={isSpeaking ? arreterParole : demarrerParole}
                                                        className={`flex items-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors ${
                                                            isSpeaking 
                                                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                    >
                                                        {isSpeaking ? (
                                                            <>
                                                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                                Arrêter
                                                            </>
                                                        ) : (
                                                            '🎤 Commencer à parler'
                                                        )}
                                                    </button>
                                                    {isSpeaking && (
                                                        <div className="flex items-center text-sm text-green-600">
                                                            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-1"></span>
                                                            En écoute...
                                                        </div>
                                                    )}
                                                </div>
                                                {transcription && (
                                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                                                        <strong>Transcription :</strong> {transcription}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <textarea
                                            value={reponseText}
                                            onChange={handleTextChange}
                                            rows={4}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder={
                                                modeReponse === 'texte' 
                                                    ? "Tapez votre réponse ici..." 
                                                    : "La transcription apparaîtra ici automatiquement lorsque vous parlerez..."
                                            }
                                            readOnly={modeReponse === 'audio'}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {modeReponse === 'texte' 
                                                ? "Cette réponse sera analysée par l'IA Gemini pour vous donner un feedback personnalisé."
                                                : "Parlez clairement. Votre parole sera transcrite et analysée par l'IA."
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Colonne Question & Contrôles */}
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-blue-600 mb-2">
                                            {selectedCategory || 'Simulation complète'}
                                        </h3>
                                        <div className="bg-gray-50 p-6 rounded-lg min-h-[120px] flex items-center justify-center">
                                            <p className="text-xl font-medium text-center">
                                                {currentQuestion?.texte || 'Cliquez sur "Nouvelle Question" pour commencer...'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <button
                                            onClick={handleNewQuestion}
                                            className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                                        >
                                            Nouvelle Question
                                        </button>

                                        {currentQuestion && (
                                            <div className="space-y-3">
                                                <button
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    disabled={modeReponse === 'audio' && !reponseText.trim()}
                                                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                                                        isRecording 
                                                            ? 'bg-red-600 text-white hover:bg-red-700' 
                                                            : (modeReponse === 'audio' && !reponseText.trim())
                                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                                >
                                                    {isRecording 
                                                        ? 'Arrêter & Analyser' 
                                                        : modeReponse === 'audio' && !reponseText.trim()
                                                            ? 'Parlez d\'abord pour analyser'
                                                            : 'Analyser ma réponse'
                                                    }
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                if (isSpeaking) arreterParole();
                                                setCurrentStep(3);
                                            }}
                                            className="w-full text-sm text-gray-500 hover:underline mt-4"
                                        >
                                            Changer de catégorie
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Section Feedback */}
                            {isLoading && (
                                <div className="mt-8 text-center">
                                    <div className="loader border-4 border-gray-200 border-t-blue-600 rounded-full w-12 h-12 animate-spin mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Analyse en cours... L'IA réfléchit à la meilleure façon de vous aider.</p>
                                </div>
                            )}

                            {showFeedback && feedback && (
                                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold">Analyse de votre réponse</h3>
                                        {feedback.scoreGlobal !== undefined && (
                                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                Score: {feedback.scoreGlobal}/100
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold text-green-700 mb-2">Points forts :</h4>
                                        <ul className="list-disc pl-5">
                                            {feedback.pointsForts.map((point, index) => (
                                                <li key={index} className="mb-1">{point}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold text-amber-600 mb-2">Axes d'amélioration :</h4>
                                        <ul className="list-disc pl-5">
                                            {feedback.axesAmelioration.map((point, index) => (
                                                <li key={index} className="mb-1">{point}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-blue-700 mb-2">Suggestion :</h4>
                                        <p>{feedback.suggestion}</p>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => setShowFeedback(false)}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                                        >
                                            Continuer l'entraînement
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}