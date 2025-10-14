"use client";

interface EvaluationResultProps {
  data: {
    score: number;
    rang: string;
    details: any;
    recommendations: string[];
  } | null;
}

export default function EvaluationResult({ data }: EvaluationResultProps) {
  if (!data) return null;

  const getRangColor = (rang: string) => {
    switch (rang) {
      case "A": return "success";
      case "B": return "primary";
      case "C": return "warning";
      default: return "secondary";
    }
  };

  const getRangDescription = (rang: string) => {
    switch (rang) {
      case "A": return "Profil Excellent pour le Rang A";
      case "B": return "Profil Compétitif pour le Rang A / Profil Solide pour le Rang B";
      case "C": return "Profil Compétitif pour le Rang B / Profil Solide pour le Rang C";
      default: return "Profil nécessitant un renforcement";
    }
  };

  return (
    <div className="evaluation-result">
      <div className="result-header text-center mb-5">
        <h2>Résultat de votre évaluation</h2>
        <p className="lead">D'après l'analyse de votre profil, voici votre positionnement</p>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* Score Principal */}
          <div className="score-card text-center mb-4">
            <div className="score-circle">
              <span className="score-number">{data.score}</span>
              <span className="score-label">/100</span>
            </div>
            <div className={`rang-badge badge bg-${getRangColor(data.rang)}`}>
              {data.rang}
            </div>
            <h3 className="mt-3">{getRangDescription(data.rang)}</h3>
          </div>

          {/* Détails du Score */}
          <div className="score-details card mb-4">
            <div className="card-header">
              <h4>Détail de votre Score de Force du Candidat</h4>
            </div>
            <div className="card-body">
              <div className="score-breakdown">
                <div className="score-item">
                  <span className="score-category">Test d'Aptitude</span>
                  <span className="score-value">{data.details.aptitude}/40</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Dossier Académique</span>
                  <span className="score-value">{data.details.academique}/35</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Maîtrise de l'Anglais</span>
                  <span className="score-value">{data.details.anglais}/15</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Indicateurs Qualitatifs</span>
                  <span className="score-value">{data.details.qualitatif}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          <div className="recommendations card">
            <div className="card-header">
              <h4>Recommandations Personnalisées</h4>
            </div>
            <div className="card-body">
              <ul className="recommendations-list">
                {data.recommendations.map((rec, index) => (
                  <li key={index} className="recommendation-item">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    {rec}
                  </li>
                ))}
              </ul>
              
              {/* Prochaine étape */}
              <div className="next-step mt-4 p-3 bg-light rounded">
                <h5>🎉 Étape 1 terminée !</h5>
                <p className="mb-2">Votre progression passe à <strong>10%</strong></p>
                <p className="mb-3">Découvrez maintenant comment créer votre dossier officiel sur la plateforme 'Études en France'</p>
                <a href="/dashboard/admission/etape2" className="btn btn-primary">
                  Passer à l'étape 2
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}