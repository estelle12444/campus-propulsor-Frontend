"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface AdmissionFormData {
  // Données académiques
  bacType: string;
  bacMention: string;
  dernierDiplome: string;
  mentionDiplome: string;
  
  // Tests d'aptitude
  testType: string;
  testScore: number;
  greVerbal?: number;
  greQuantitative?: number;
  
  // Anglais
  englishTest: string;
  englishScore: number;
  toeflScore?: number;
  ieltsScore?: number;
  toeicListening?: number;
  toeicSpeaking?: number;
  cambridgeScore?: number;
  
  // Qualitatif
  entretienAnglais: boolean;
}

export default function AdmissionForm({ onEvaluationComplete }: { onEvaluationComplete: (data: any) => void }) {
  const [currentSection, setCurrentSection] = useState(1);
  const [testType, setTestType] = useState("");
  const [englishTest, setEnglishTest] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AdmissionFormData>();

  const onSubmit = (data: AdmissionFormData) => {
    // Simulation de l'évaluation
    const result = evaluateAdmission(data);
    onEvaluationComplete(result);
  };

  const evaluateAdmission = (data: AdmissionFormData) => {
    // Implémentation simplifiée de l'algorithme
    let score = 0;
    
    // Calcul du score basé sur votre algorithme
    // Test d'aptitude (40%)
    score += calculateAptitudeScore(data);
    
    // Dossier académique (35%)
    score += calculateAcademicScore(data);
    
    // Anglais (15%)
    score += calculateEnglishScore(data);
    
    // Qualitatif (10%)
    score += calculateQualitativeScore(data);
    
    return {
      score: Math.round(score),
      rang: getRang(score),
      details: getScoreDetails(data, score),
      recommendations: getRecommendations(score, data)
    };
  };

  const calculateAptitudeScore = (data: AdmissionFormData) => {
    // Implémentation de la logique de calcul
    return 0; // À compléter
  };

  const calculateAcademicScore = (data: AdmissionFormData) => {
    // Implémentation de la logique de calcul
    return 0; // À compléter
  };

  const calculateEnglishScore = (data: AdmissionFormData) => {
    // Implémentation de la logique de calcul
    return 0; // À compléter
  };

  const calculateQualitativeScore = (data: AdmissionFormData) => {
    // Implémentation de la logique de calcul
    return 0; // À compléter
  };

  const getRang = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 75) return "B";
    if (score >= 60) return "C";
    if (score >= 40) return "C (Renforcement nécessaire)";
    return "Profil à renforcer";
  };

  const getScoreDetails = (data: AdmissionFormData, score: number) => {
    // Détails du calcul
    return {
      aptitude: 0,
      academique: 0,
      anglais: 0,
      qualitatif: 0
    };
  };

  const getRecommendations = (score: number, data: AdmissionFormData) => {
    // Recommandations personnalisées
    return [];
  };

  return (
    <div className="admission-form-container">
      <div className="form-header">
        <h2>Évaluation de vos chances d'admission</h2>
        <p>Remplissez ce formulaire pour obtenir une évaluation personnalisée de vos chances dans les établissements français</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="admission-form">
        {/* Section 1: Données Académiques */}
        {currentSection >= 1 && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">1</span>
              <h3>Données Académiques Fondamentales</h3>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="bacType">Type de Baccalauréat Ivoirien *</label>
                  <select 
                    id="bacType"
                    {...register("bacType", { required: "Ce champ est obligatoire" })}
                    className="form-select"
                  >
                    <option value="">Sélectionnez votre bac</option>
                    <option value="A">Série A (Littéraire)</option>
                    <option value="C">Série C (Scientifique)</option>
                    <option value="D">Série D (Scientifique)</option>
                    <option value="B">Série B (Technique - Économie)</option>
                    <option value="AUTRE">Autre BAC Technique</option>
                  </select>
                  {errors.bacType && <span className="error">{errors.bacType.message}</span>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="bacMention">Mention au Baccalauréat *</label>
                  <select 
                    id="bacMention"
                    {...register("bacMention", { required: "Ce champ est obligatoire" })}
                    className="form-select"
                  >
                    <option value="">Sélectionnez votre mention</option>
                    <option value="PASSABLE">Passable</option>
                    <option value="ASSEZ_BIEN">Assez Bien</option>
                    <option value="BIEN">Bien</option>
                    <option value="TRES_BIEN">Très Bien</option>
                  </select>
                  {errors.bacMention && <span className="error">{errors.bacMention.message}</span>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dernierDiplome">Dernier Diplôme Obtenu *</label>
                  <select 
                    id="dernierDiplome"
                    {...register("dernierDiplome", { required: "Ce champ est obligatoire" })}
                    className="form-select"
                  >
                    <option value="">Sélectionnez votre diplôme</option>
                    <option value="LICENCE_3">Licence 3 (180 ECTS)</option>
                    <option value="MASTER_1">Master 1 (240 ECTS)</option>
                    <option value="AUTRE_BAC3">Autre (Niveau BAC+3 minimum)</option>
                  </select>
                  {errors.dernierDiplome && <span className="error">{errors.dernierDiplome.message}</span>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="mentionDiplome">Mention du Dernier Diplôme *</label>
                  <select 
                    id="mentionDiplome"
                    {...register("mentionDiplome", { required: "Ce champ est obligatoire" })}
                    className="form-select"
                  >
                    <option value="">Sélectionnez votre mention</option>
                    <option value="PASSABLE">Passable (10-11.99/20)</option>
                    <option value="ASSEZ_BIEN">Assez Bien (12-13.99/20)</option>
                    <option value="BIEN">Bien (14-15.99/20)</option>
                    <option value="TRES_BIEN">Très Bien (16+/20)</option>
                  </select>
                  {errors.mentionDiplome && <span className="error">{errors.mentionDiplome.message}</span>}
                </div>
              </div>
            </div>

            {currentSection === 1 && (
              <div className="section-actions">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setCurrentSection(2)}
                >
                  Suivant - Tests d'Aptitude
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section 2: Tests d'Aptitude */}
        {currentSection >= 2 && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">2</span>
              <h3>Scores aux Tests d'Aptitude</h3>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="testType">Type de Test *</label>
                  <select 
                    id="testType"
                    {...register("testType", { required: "Ce champ est obligatoire" })}
                    className="form-select"
                    onChange={(e) => setTestType(e.target.value)}
                  >
                    <option value="">Sélectionnez votre test</option>
                    <option value="TAGE_MAGE">TAGE MAGE</option>
                    <option value="GMAT">GMAT / GMAT Focus Edition</option>
                    <option value="GRE">GRE</option>
                  </select>
                  {errors.testType && <span className="error">{errors.testType.message}</span>}
                </div>
              </div>

              <div className="col-md-6">
                {testType === "TAGE_MAGE" && (
                  <div className="form-group">
                    <label htmlFor="testScore">Score TAGE MAGE (0-600)</label>
                    <input 
                      type="number" 
                      id="testScore"
                      {...register("testScore", { 
                        min: 0, 
                        max: 600,
                        required: "Le score TAGE MAGE est requis"
                      })}
                      className="form-control"
                      placeholder="Ex: 350"
                    />
                  </div>
                )}

                {testType === "GMAT" && (
                  <div className="form-group">
                    <label htmlFor="testScore">Score GMAT (200-800)</label>
                    <input 
                      type="number" 
                      id="testScore"
                      {...register("testScore", { 
                        min: 200, 
                        max: 800,
                        required: "Le score GMAT est requis"
                      })}
                      className="form-control"
                      placeholder="Ex: 650"
                    />
                  </div>
                )}

                {testType === "GRE" && (
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="greVerbal">Verbal Reasoning (130-170)</label>
                        <input 
                          type="number" 
                          id="greVerbal"
                          {...register("greVerbal", { 
                            min: 130, 
                            max: 170
                          })}
                          className="form-control"
                          placeholder="Ex: 155"
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="greQuantitative">Quantitative Reasoning (130-170)</label>
                        <input 
                          type="number" 
                          id="greQuantitative"
                          {...register("greQuantitative", { 
                            min: 130, 
                            max: 170
                          })}
                          className="form-control"
                          placeholder="Ex: 160"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {currentSection === 2 && (
              <div className="section-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setCurrentSection(1)}
                >
                  Précédent
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setCurrentSection(3)}
                >
                  Suivant - Maîtrise de l'Anglais
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section 3: Maîtrise de l'Anglais */}
        {currentSection >= 3 && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">3</span>
              <h3>Vérification de la Maîtrise de l'Anglais</h3>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="englishTest">Test d'Anglais *</label>
                  <select 
                    id="englishTest"
                    {...register("englishTest", { required: "Ce champ est obligatoire" })}
                    className="form-select"
                    onChange={(e) => setEnglishTest(e.target.value)}
                  >
                    <option value="">Sélectionnez votre test</option>
                    <option value="TOEFL">TOEFL iBT</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEIC">TOEIC</option>
                    <option value="CAMBRIDGE">Cambridge English</option>
                  </select>
                  {errors.englishTest && <span className="error">{errors.englishTest.message}</span>}
                </div>
              </div>

              <div className="col-md-6">
                {englishTest === "TOEFL" && (
                  <div className="form-group">
                    <label htmlFor="toeflScore">Score TOEFL iBT (0-120)</label>
                    <input 
                      type="number" 
                      id="toeflScore"
                      {...register("toeflScore", { 
                        min: 0, 
                        max: 120,
                        required: "Le score TOEFL est requis"
                      })}
                      className="form-control"
                      placeholder="Ex: 95"
                    />
                  </div>
                )}

                {englishTest === "IELTS" && (
                  <div className="form-group">
                    <label htmlFor="ieltsScore">Score IELTS (1.0-9.0)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      id="ieltsScore"
                      {...register("ieltsScore", { 
                        min: 1.0, 
                        max: 9.0,
                        required: "Le score IELTS est requis"
                      })}
                      className="form-control"
                      placeholder="Ex: 7.0"
                    />
                  </div>
                )}

                {englishTest === "TOEIC" && (
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="toeicListening">Listening & Reading (10-990)</label>
                        <input 
                          type="number" 
                          id="toeicListening"
                          {...register("toeicListening", { 
                            min: 10, 
                            max: 990
                          })}
                          className="form-control"
                          placeholder="Ex: 450"
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="toeicSpeaking">Speaking & Writing (10-400)</label>
                        <input 
                          type="number" 
                          id="toeicSpeaking"
                          {...register("toeicSpeaking", { 
                            min: 10, 
                            max: 400
                          })}
                          className="form-control"
                          placeholder="Ex: 180"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {englishTest === "CAMBRIDGE" && (
                  <div className="form-group">
                    <label htmlFor="cambridgeScore">Score Cambridge (80-230)</label>
                    <input 
                      type="number" 
                      id="cambridgeScore"
                      {...register("cambridgeScore", { 
                        min: 80, 
                        max: 230,
                        required: "Le score Cambridge est requis"
                      })}
                      className="form-control"
                      placeholder="Ex: 180"
                    />
                  </div>
                )}
              </div>
            </div>

            {currentSection === 3 && (
              <div className="section-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setCurrentSection(2)}
                >
                  Précédent
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setCurrentSection(4)}
                >
                  Suivant - Indicateurs Qualitatifs
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section 4: Indicateurs Qualitatifs */}
        {currentSection >= 4 && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">4</span>
              <h3>Indicateurs Qualitatifs de Préparation</h3>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    id="entretienAnglais"
                    {...register("entretienAnglais")}
                    className="form-check-input"
                  />
                  <label htmlFor="entretienAnglais" className="form-check-label">
                    Confirmez-vous être capable de mener un entretien d'admission de 30 minutes entièrement en anglais ?
                  </label>
                </div>
                <div className="form-help">
                  <small className="text-muted">
                    Cette information sera croisée avec vos résultats aux tests d'anglais pour une évaluation plus précise.
                  </small>
                </div>
              </div>
            </div>

            {currentSection === 4 && (
              <div className="section-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setCurrentSection(3)}
                >
                  Précédent
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success"
                >
                  Obtenir mon évaluation
                </button>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Avertissement Campus France */}
      <div className="campus-france-alert mt-5">
        <div className="alert alert-warning">
          <h4>⚠️ AVIS IMPORTANT POUR LES CANDIDATS IVOIRIENS</h4>
          <p><strong>LA PROCÉDURE 'ÉTUDES EN FRANCE' EST OBLIGATOIRE</strong></p>
          <p>En tant que ressortissant de la Côte d'Ivoire, vous devez impérativement utiliser la plateforme 'Études en France' (gérée par Campus France) pour toutes vos candidatures.</p>
          <ul>
            <li>Ceci n'est pas une option, mais une obligation</li>
            <li>Toute candidature soumise en dehors de cette plateforme sera refusée</li>
            <li>Les délais sont stricts (démarrage en octobre pour l'année suivante)</li>
          </ul>
          <a href="https://www.campusfrance.org/fr" target="_blank" className="btn btn-sm btn-outline-warning">
            Consulter Campus France
          </a>
        </div>
      </div>
    </div>
  );
}