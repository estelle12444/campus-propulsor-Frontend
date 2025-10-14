'use client';

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

interface ProgressTrackerProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function ProgressTracker({ currentStep, onStepChange }: ProgressTrackerProps) {
  const steps: ProgressStep[] = [
    {
      id: 1,
      title: "Auto-évaluation",
      description: "Évaluation de votre profil",
      completed: currentStep > 1,
      progress: 100
    },
    {
      id: 2,
      title: "Projet Professionnel",
      description: "Définition de votre projet",
      completed: currentStep > 2,
      progress: currentStep > 1 ? 100 : 0
    },
    {
      id: 3,
      title: "Plateforme Campus France",
      description: "Création et soumission du dossier",
      completed: currentStep > 3,
      progress: currentStep > 2 ? 25 : 0
    },
    {
      id: 4,
      title: "Recherche de Bourses",
      description: "Financement de vos études",
      completed: currentStep > 4,
      progress: 0
    },
    {
      id: 5,
      title: "CV & Lettres de Motivation",
      description: "Documents de candidature",
      completed: currentStep > 5,
      progress: 0
    },
    {
      id: 6,
      title: "Préparation Entretiens",
      description: "Simulations et conseils",
      completed: false,
      progress: 0
    }
  ];

  const overallProgress = Math.round((currentStep - 1) / 5 * 100);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Progression de votre accompagnement</h4>
          <span className="badge bg-primary">{overallProgress}%</span>
        </div>
        
        <div className="progress mb-4" style={{ height: '10px' }}>
          <div 
            className="progress-bar" 
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>

        <div className="steps-vertical">
          {steps.map(step => (
            <div 
              key={step.id} 
              className={`step-item ${step.completed ? 'completed' : ''} ${currentStep === step.id ? 'active' : ''}`}
              onClick={() => onStepChange(step.id)}
            >
              <div className="step-indicator">
                {step.completed ? '✓' : step.id}
              </div>
              <div className="step-content">
                <h6 className="step-title">{step.title}</h6>
                <p className="step-description">{step.description}</p>
                {step.progress > 0 && (
                  <div className="step-progress">
                    <div className="progress" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                    <small>{step.progress}% complété</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}