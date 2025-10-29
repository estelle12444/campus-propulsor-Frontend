'use client';

import { useState } from 'react';

import ProgressTracker from '@/app/components/student/ProgressTracker';
import CampusFranceGuide from '@/app/(student)/CampusFranceGuide/page';
import ScholarshipFinder from '@/app/(student)/ScholarshipFinder/page';
import CVLetterGenerator from '@/app/(student)/CVLetterGenerator/page';

// import './global.css';


export default function AccompagnementPage() {
  const [currentStep, setCurrentStep] = useState(3); // Commence à l'étape Campus France

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <div>Auto-évaluation (déjà complétée)</div>;
      case 2:
        return <div>Projet Professionnel (déjà complété)</div>;
      case 3:
        return <CampusFranceGuide />;
      case 4:
        return <ScholarshipFinder />;
      case 5:
        return <CVLetterGenerator />;
      case 6:
        return <div>Préparation aux entretiens (à venir)</div>;
      default:
        return <CampusFranceGuide />;
    }
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Accompagnement Complet</h3>
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
              <a href="#">Accompagnement</a>
            </li>
          </ul>
        </div>

        <ProgressTracker
          currentStep={currentStep} 
          onStepChange={setCurrentStep}
        />

        {renderCurrentStep()}
      </div>
    </div>
  );
}