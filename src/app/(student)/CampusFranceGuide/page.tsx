'use client';

import { useState } from 'react';

interface CampusFranceTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    videoUrl?: string;
    instructions: string[];
}

interface Appointment {
    date: string;
    duration: string;
    confirmed: boolean;
    meetingLink?: string;
}

export default function CampusFranceGuide() {
    const [tasks, setTasks] = useState<CampusFranceTask[]>([
        {
            id: '1',
            title: 'Créer son compte Campus France',
            description: 'Accédez à la plateforme officielle et créez votre compte',
            completed: false,
            videoUrl: 'https://youtu.be/cGTCoKiVK9I',
            instructions: [
                'Rendez-vous sur https://www.campusfrance.org/fr',
                'Cliquez sur "Créer un compte"',
                'Renseignez votre email personnel',
                'Validez votre email via le lien reçu',
                'Complétez vos informations personnelles'
            ]
        },
        {
            id: '2',
            title: 'Remplir les informations personnelles',
            description: 'Complétez toutes les sections du profil',
            completed: false,
            instructions: [
                'Section État Civil : nom, prénom, date de naissance',
                'Coordonnées : adresse, téléphone avec indicatif +225',
                'Nationalité et situation familiale',
                'Upload de la photo d\'identité'
            ]
        },
        {
            id: '3',
            title: 'Ajouter le parcours académique',
            description: 'Saisir tous vos diplômes et formations',
            completed: false,
            instructions: [
                'Baccalauréat : série, année, mention',
                'Diplômes universitaires avec mentions',
                'Attestations de formation si applicable',
                'Upload des relevés de notes'
            ]
        },
        {
            id: '4',
            title: 'Sélectionner les formations (max 7)',
            description: 'Choisir vos formations dans le catalogue',
            completed: false,
            instructions: [
                'Rechercher par domaine d\'étude',
                'Vérifier les prérequis de chaque formation',
                'Classer par ordre de préférence',
                'Respecter la cohérence du projet'
            ]
        },
        {
            id: '5',
            title: 'Soumettre le dossier et payer',
            description: 'Finalisation et paiement des frais',
            completed: false,
            instructions: [
                'Vérifier l\'intégralité des informations',
                'Valider la soumission définitive',
                'Payer les 80 000 FCFA via les canaux officiels',
                'Télécharger le récépissé de paiement'
            ]
        }
    ]);

    const [showAppointment, setShowAppointment] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const toggleTask = (taskId: string) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    const handleSubmitConfirmation = () => {
        if (completedTasks === tasks.length) {
            alert('Félicitations ! Vous avez soumis votre dossier sur la plateforme officielle! L\'étape cruciale suivante est de préparer des documents parfaits. Passons à la checklist.');
            // Ici vous mettriez à jour la progression globale
        } else {
            alert('Veuillez compléter toutes les étapes avant de confirmer la soumission.');
        }
    };

    const [selectedDuration, setSelectedDuration] = useState('1');
    const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
    const [meetingLink, setMeetingLink] = useState('');

    // Générer les dates disponibles (prochains 7 jours, heures de travail)
    const generateAvailableSlots = () => {
        const slots = [];
        const now = new Date();

        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(now.getDate() + i);

            // Heures de travail : 9h-12h et 14h-17h
            const morningSlots = [9, 10, 11];
            const afternoonSlots = [14, 15, 16];

            morningSlots.forEach(hour => {
                const slotDate = new Date(date);
                slotDate.setHours(hour, 0, 0, 0);
                slots.push(slotDate.toISOString().slice(0, 16));
            });

            afternoonSlots.forEach(hour => {
                const slotDate = new Date(date);
                slotDate.setHours(hour, 0, 0, 0);
                slots.push(slotDate.toISOString().slice(0, 16));
            });
        }

        return slots;
    };

    const [availableSlots] = useState(generateAvailableSlots());

    const handleAppointmentSubmit = async () => {
        if (!selectedDate) {
            alert('Veuillez sélectionner une date et heure');
            return;
        }

        // Simulation de création de meeting
        setAppointmentConfirmed(true);

        // Générer un lien de meeting fictif (en production, intégrer avec Google Calendar API)
        const mockMeetingLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`;
        setMeetingLink(mockMeetingLink);

        // Envoyer un email de confirmation (simulation)
        setTimeout(() => {
            alert(`🎉 Rendez-vous confirmé !\n\nDate: ${new Date(selectedDate).toLocaleString('fr-FR')}\nDurée: ${selectedDuration} heure(s)\nLien: ${mockMeetingLink}\n\nUn email de confirmation vous a été envoyé.`);
        }, 1000);
    };

    return (
        <div className="container">
            <div className="page-inner">
                <div className="campus-france-guide">
                    <div className="row">
                        <div className="col-lg-8">
                            {/* En-tête avec progression */}
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3 className="card-title">Guide Campus France - Étape par Étape</h3>
                                            <p className="text-muted">Calendrier : Ouverture des inscriptions le 1er Octobre</p>
                                        </div>
                                        <div className="text-end">
                                            <div className="h4 mb-1">{progress}%</div>
                                            <small className="text-muted">Progression</small>
                                        </div>
                                    </div>
                                    <div className="progress mt-3">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Liste des tâches */}
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="mb-4">Checklist de soumission</h5>

                                    {tasks.map(task => (
                                        <div key={task.id} className="task-item mb-4 p-3 border rounded">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => toggleTask(task.id)}
                                                    id={`task-${task.id}`}
                                                />
                                                <label className="form-check-label w-100" htmlFor={`task-${task.id}`}>
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h6 className="mb-1">{task.title}</h6>
                                                            <p className="text-muted mb-2">{task.description}</p>

                                                            {/* Instructions détaillées */}
                                                            <div className="instructions">
                                                                <small className="text-muted d-block mb-2">Instructions :</small>
                                                                <ul className="small">
                                                                    {task.instructions.map((instruction, index) => (
                                                                        <li key={index}>{instruction}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            {/* Vidéo tutorielle */}
                                                            {task.videoUrl && (
                                                                <div className="mt-2">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => document.getElementById(`video-${task.id}`)?.classList.toggle('d-none')}
                                                                    >
                                                                        📹 Voir le tutoriel vidéo
                                                                    </button>
                                                                    <div id={`video-${task.id}`} className="mt-2 d-none">
                                                                        <div className="ratio ratio-16x9">
                                                                            <iframe
                                                                                src={task.videoUrl}
                                                                                title={`Tutoriel ${task.title}`}
                                                                                allowFullScreen
                                                                            ></iframe>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className={`badge ${task.completed ? 'bg-success' : 'bg-secondary'}`}>
                                                            {task.completed ? 'Terminé' : 'À faire'}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Bouton de confirmation finale */}
                                    <div className="text-center mt-4">
                                        <button
                                            className="btn btn-success btn-lg"
                                            onClick={handleSubmitConfirmation}
                                            disabled={completedTasks !== tasks.length}
                                        >
                                            ✅ Confirmer la soumission complète du dossier
                                        </button>
                                        <p className="text-muted mt-2">
                                            Je certifie avoir soumis mon dossier et payé les frais de 80 000 FCFA sur les canaux officiels
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            {/* Option accompagnement */}
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Accompagnement Personnalisé</h5>
                                    <p className="text-muted">
                                        Besoin d'aide pour créer votre compte Campus France ?
                                    </p>

                                    {!showAppointment ? (
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() => setShowAppointment(true)}
                                        >
                                            📅 Prendre rendez-vous
                                        </button>
                                    ) : (

                                        //         <h6>Choisissez votre créneau :</h6>

                                        //         <div className="mb-3">
                                        //             <label className="form-label">Date et heure</label>
                                        //             <input
                                        //                 type="datetime-local"
                                        //                 className="form-control"
                                        //                 value={selectedDate}
                                        //                 onChange={(e) => setSelectedDate(e.target.value)}
                                        //                 min={new Date().toISOString().slice(0, 16)}
                                        //             />
                                        //         </div>

                                        //         <div className="mb-3">
                                        //             <label className="form-label">Durée</label>
                                        //             <select className="form-select">
                                        //                 <option value="1">1 heure - 25 000 FCFA</option>
                                        //                 <option value="2">2 heures - 45 000 FCFA</option>
                                        //             </select>
                                        //         </div>

                                        //         <button className="btn btn-success w-100">
                                        //             🎯 Confirmer le rendez-vous Teams
                                        //         </button>
                                        //         <small className="text-muted d-block mt-2">
                                        //             Un lien Google Meet/Teams vous sera envoyé par email
                                        //         </small>
                                        //     </div>
                                        // )}
                                        <div className="appointment-scheduler">
                                            {!appointmentConfirmed ? (
                                                <>
                                                    <h6>Choisissez votre créneau :</h6>

                                                    <div className="mb-3">
                                                        <label className="form-label">Date et heure</label>
                                                        <select
                                                            className="form-select"
                                                            value={selectedDate}
                                                            onChange={(e) => setSelectedDate(e.target.value)}
                                                        >
                                                            <option value="">Sélectionnez un créneau</option>
                                                            {availableSlots.map(slot => (
                                                                <option key={slot} value={slot}>
                                                                    {new Date(slot).toLocaleString('fr-FR', {
                                                                        weekday: 'long',
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <small className="text-muted">
                                                            Créneaux disponibles sur 7 jours
                                                        </small>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Durée</label>
                                                        <select
                                                            className="form-select"
                                                            value={selectedDuration}
                                                            onChange={(e) => setSelectedDuration(e.target.value)}
                                                        >
                                                            <option value="1">1 heure - 25 000 FCFA</option>
                                                            <option value="2">2 heures - 45 000 FCFA</option>
                                                        </select>
                                                    </div>

                                                    <button
                                                        className="btn btn-success w-100 mb-2"
                                                        onClick={handleAppointmentSubmit}
                                                        disabled={!selectedDate}
                                                    >
                                                        🎯 Confirmer le rendez-vous
                                                    </button>

                                                    <button
                                                        className="btn btn-outline-secondary w-100"
                                                        onClick={() => {
                                                            setShowAppointment(false);
                                                            setSelectedDate('');
                                                        }}
                                                    >
                                                        Annuler
                                                    </button>

                                                    <small className="text-muted d-block mt-2">
                                                        Un lien Google Meet vous sera envoyé par email
                                                    </small>
                                                </>
                                            ) : (
                                                <div className="appointment-confirmed text-center">
                                                    <div className="text-success mb-3">
                                                        <i className="fas fa-check-circle fa-3x"></i>
                                                        <h6 className="mt-2">Rendez-vous Confirmé !</h6>
                                                    </div>

                                                    <div className="card bg-light">
                                                        <div className="card-body">
                                                            <p><strong>Date :</strong> {new Date(selectedDate).toLocaleString('fr-FR')}</p>
                                                            <p><strong>Durée :</strong> {selectedDuration} heure(s)</p>
                                                            <p><strong>Prix :</strong> {selectedDuration === '1' ? '25 000' : '45 000'} FCFA</p>

                                                            {meetingLink && (
                                                                <div className="mt-3">
                                                                    <a
                                                                        href={meetingLink}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-primary btn-sm w-100"
                                                                    >
                                                                        🔗 Rejoindre le meeting
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="btn btn-outline-primary w-100 mt-3"
                                                        onClick={() => {
                                                            setShowAppointment(false);
                                                            setAppointmentConfirmed(false);
                                                            setSelectedDate('');
                                                        }}
                                                    >
                                                        Prendre un nouveau rendez-vous
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}


                                </div>
                          
                            <div className="mt-3 p-3 bg-light rounded">
                                <h6>📞 Support Campus & Professional Propul'Sor</h6>
                                <p className="small mb-1">Email : contact@campropulsor.org</p>
                                <p className="small mb-1">Site : site.campropulsor</p>
                                <p className="small">Urgences : +225 XX XX XX XX</p>
                            </div>
                        </div>


                        {/* Rappels importants */}
                        <div className="card mt-4">
                            <div className="card-body">
                                <h6>⏰ Dates importantes</h6>
                                <ul className="small">
                                    <li>1er Octobre : Ouverture des inscriptions</li>
                                    <li>15 Janvier : Date limite première session</li>
                                    <li>1er Mars : Date limite deuxième session</li>
                                    <li>15 Avril : Clôture définitive</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
        .task-item {
          transition: all 0.3s ease;
        }
        
        .task-item:hover {
          background-color: #f8f9fa;
        }
        
        .form-check-input:checked ~ label {
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        .instructions ul {
          padding-left: 1.5rem;
          margin-bottom: 0;
        }
        
        .appointment-scheduler {
          animation: fadeIn 0.3s ease;
        }
             
        
        .appointment-confirmed {
          animation: slideIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
           @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .badge {
          font-size: 0.7em;
        }
      `}</style>
            </div>
        </div>
        </div>

    );
}