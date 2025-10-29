// app/questionnaire-projet/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function QuestionnaireProjet() {
  const [currentSection, setCurrentSection] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nom: '',
    prenom: '',
    email: ''
  });
  const [formData, setFormData] = useState({
    // Section 1: Informations Personnelles et Académiques
    personalInfo: {
      date_naissance: '',
      nationalite: '',
      telephone: ''
    },
    baccalaureat: {
      serie: '',
      mention: '',
      annee_obtention: '',
      moyenne: ''
    },
    diplomes: [{
      diplome: '',
      etablissement: '',
      annee: '',
      mention: '',
      specialite: ''
    }],

    // Section 2: Compétences Linguistiques
    competences_linguistiques: {
      niveau_francais: '',
      score_tcf: '',
      date_test: '',
      autres_langues: ''
    },

    // Section 3: Projet de Formation en France
    formations: [{
      universite: '',
      programme: '',
      niveau: '',
      lien: '',
      pourquoi_programme: '',
      pourquoi_ville: ''
    }],

    // Section 4: Projet Professionnel
    projet_professionnel: {
      job_title_target: '',
      secteur_activite: '',
      short_term_goal: '',
      medium_term_goal: '',
      long_term_goal: '',
      plan_b_roles: '',
      contribution_to_ci: ''
    },

    // Section 5: Motivations et Atouts Personnels
    motivations: {
      atouts_academiques: '',
      realisation_fiere: '',
      pourquoi_france: '',
      pourquoi_formation_choisie: ''
    }
  });
  // Récupérer les infos de l'utilisateur connecté
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/auth/profile/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserInfo({
            nom: userData.last_name || '',
            prenom: userData.first_name || '',
            email: userData.email || ''
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos utilisateur:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const sections = [
    { id: 1, title: "Informations Personnelles et Académiques", icon: "👤" },
    { id: 2, title: "Compétences Linguistiques", icon: "🗣️" },
    { id: 3, title: "Projet de Formation en France", icon: "🎓" },
    { id: 4, title: "Projet Professionnel", icon: "💼" },
    { id: 5, title: "Motivations et Atouts Personnels", icon: "🌟" }
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section: string, index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section as keyof typeof prev] as any[]).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addFormation = () => {
    setFormData(prev => ({
      ...prev,
      formations: [...prev.formations, {
        universite: '',
        programme: '',
        niveau: '',
        lien: '',
        pourquoi_programme: '',
        pourquoi_ville: ''
      }]
    }));
  };

  const removeFormation = (index: number) => {
    if (formData.formations.length > 1) {
      setFormData(prev => ({
        ...prev,
        formations: prev.formations.filter((_, i) => i !== index)
      }));
    }
  };

  const addDiplome = () => {
    setFormData(prev => ({
      ...prev,
      diplomes: [...prev.diplomes, {
        diplome: '',
        etablissement: '',
        annee: '',
        mention: '',
        specialite: ''
      }]
    }));
  };

  const removeDiplome = (index: number) => {
    if (formData.diplomes.length > 1) {
      setFormData(prev => ({
        ...prev,
        diplomes: prev.diplomes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleExportToWord = async (projectId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/export-word/${projectId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        // Télécharger le fichier Word
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `projet_etudes_${userInfo.nom}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Document Word téléchargé avec succès !');
      } else {
        alert('Erreur lors de l\'export Word');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('❌ Vous n\'êtes pas connecté. Veuillez vous reconnecter.');
        window.location.href = '/connexion'; // Rediriger vers la page de connexion
        return;
      }

      // 1. Mettre à jour le profil utilisateur avec les infos personnelles
      const profileResponse = await fetch('http://localhost:8000/api/auth/user/profile/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          full_name: userInfo.nom +' '+ userInfo.prenom,
          date_of_birth: formData.personalInfo.date_naissance,
          nationality: formData.personalInfo.nationalite,
          phone_number: formData.personalInfo.telephone,
          bac_serie: formData.baccalaureat.serie,
          bac_score: formData.baccalaureat.moyenne,
          niveau_francais: formData.competences_linguistiques.niveau_francais,
          score_tcf: formData.competences_linguistiques.score_tcf,
          academic_history: formData.diplomes,
          skills:formData.competences_linguistiques,
        })
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        console.error('Erreur profil:', errorData);
        throw new Error('Erreur mise à jour profil');
      }


      // 2. Créer les choix de formation
      console.log('Formations à créer:', formData.formations);
      const formationPromises = formData.formations.map(async (formation) => {
        const formationData = {
          institution_name: formation.universite,
          programme: formation.programme,
          niveau: formation.niveau,
          lien: formation.lien,
          pourquoi_programme: formation.pourquoi_programme,
          pourquoi_ville: formation.pourquoi_ville
        };

        console.log('Envoi formation:', formationData);

        const response = await fetch('http://localhost:8000/api/formations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify(formationData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Erreur formation:', errorData);
          throw new Error(`Erreur création formation: ${errorData.message || 'Unknown error'}`);
        }

        return response.json();
      });

      const formationResults = await Promise.all(formationPromises);
      console.log('Formations créées:', formationResults);


      // 3. Générer le projet professionnel
      const projectData = {
        projet_professionnel: formData.projet_professionnel,
        motivations: formData.motivations,
        formations: formData.formations // Ajouter les formations ici aussi
      };

      console.log('Données projet:', projectData);

      const response = await fetch('http://localhost:8000/api/generate-project/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur génération projet:', errorData);
        throw new Error('Erreur lors de la génération du projet');
      }

      const result = await response.json();
      console.log('Projet généré:', result);

      alert('Projet généré avec succès !');


      // Proposer l'export Word
      if (confirm('Voulez-vous télécharger votre projet en format Word ?')) {
        await handleExportToWord(result.project_id);
      }

    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsGenerating(false); // ✅ Fin du chargement
    }
  };

  const renderSection1 = () => (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <i className="icon-user mr-2"></i>
              Informations Personnelles
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={userInfo.nom}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={userInfo.prenom}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={userInfo.email}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="date_naissance">Date de Naissance *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date_naissance"
                    value={formData.personalInfo.date_naissance}
                    onChange={(e) => handleInputChange('personalInfo', 'date_naissance', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="nationalite">Nationalité *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nationalite"
                    value={formData.personalInfo.nationalite}
                    onChange={(e) => handleInputChange('personalInfo', 'nationalite', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="telephone">Téléphone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telephone"
                    value={formData.personalInfo.telephone}
                    onChange={(e) => handleInputChange('personalInfo', 'telephone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Baccalauréat */}
        <div className="card mt-4">
          <div className="card-header">
            <div className="card-title">
              <i className="icon-graduation mr-2"></i>
              Baccalauréat
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="bac_serie">Série *</label>
                  <select
                    className="form-select"
                    id="bac_serie"
                    value={formData.baccalaureat.serie}
                    onChange={(e) => handleInputChange('baccalaureat', 'serie', e.target.value)}
                    required
                  >
                    <option value="">Choisir...</option>
                    <option value="C">Série C</option>
                    <option value="D">Série D</option>
                    <option value="A1">Série A1</option>
                    <option value="A2">Série A2</option>
                    <option value="B">Série B</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="bac_mention">Mention</label>
                  <select
                    className="form-select"
                    id="bac_mention"
                    value={formData.baccalaureat.mention}
                    onChange={(e) => handleInputChange('baccalaureat', 'mention', e.target.value)}
                  >
                    <option value="">Choisir...</option>
                    <option value="excellent">Excellent</option>
                    <option value="tres_bien">Très Bien</option>
                    <option value="bien">Bien</option>
                    <option value="assez_bien">Assez Bien</option>
                    <option value="passable">Passable</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="bac_annee">Année d'Obtention *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="bac_annee"
                    min="1980"
                    max="2025"
                    value={formData.baccalaureat.annee_obtention}
                    onChange={(e) => handleInputChange('baccalaureat', 'annee_obtention', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label htmlFor="bac_moyenne">Moyenne/20 *</label>
                  <input
                    type="number"
                    className="form-control"
                    id="bac_moyenne"
                    step="0.01"
                    min="0"
                    max="20"
                    value={formData.baccalaureat.moyenne}
                    onChange={(e) => handleInputChange('baccalaureat', 'moyenne', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diplômes Post-Bac */}
        <div className="card mt-4">
          <div className="card-header">
            <div className="card-title d-flex justify-content-between align-items-center">
              <span>
                <i className="icon-book-open mr-2"></i>
                Diplômes Post-Bac
              </span>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addDiplome}
              >
                <i className="fa fa-plus mr-1"></i>
                Ajouter un diplôme
              </button>
            </div>
          </div>
          <div className="card-body">
            {formData.diplomes.map((diplome, index) => (
              <div key={index} className="border-bottom pb-4 mb-4">
                {index > 0 && (
                  <div className="text-right mb-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeDiplome(index)}
                    >
                      <i className="fa fa-trash mr-1"></i>
                      Supprimer
                    </button>
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={`diplome_${index}`}>Diplôme </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`diplome_${index}`}
                        placeholder="Ex: Licence en Informatique"
                        value={diplome.diplome}
                        onChange={(e) => handleArrayChange('diplomes', index, 'diplome', e.target.value)}

                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={`etablissement_${index}`}>Établissement </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`etablissement_${index}`}
                        placeholder="Ex: Université Félix Houphouët-Boigny"
                        value={diplome.etablissement}
                        onChange={(e) => handleArrayChange('diplomes', index, 'etablissement', e.target.value)}

                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor={`annee_${index}`}>Année </label>
                      <input
                        type="number"
                        className="form-control"
                        id={`annee_${index}`}
                        min="2000"
                        max="2025"
                        value={diplome.annee}
                        onChange={(e) => handleArrayChange('diplomes', index, 'annee', e.target.value)}

                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor={`mention_${index}`}>Mention</label>
                      <select
                        className="form-select"
                        id={`mention_${index}`}
                        value={diplome.mention}
                        onChange={(e) => handleArrayChange('diplomes', index, 'mention', e.target.value)}
                      >
                        <option value="">Choisir...</option>
                        <option value="excellent">Excellent</option>
                        <option value="tres_bien">Très Bien</option>
                        <option value="bien">Bien</option>
                        <option value="assez_bien">Assez Bien</option>
                        <option value="passable">Passable</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor={`specialite_${index}`}>Spécialité</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`specialite_${index}`}
                        placeholder="Ex: Intelligence Artificielle"
                        value={diplome.specialite}
                        onChange={(e) => handleArrayChange('diplomes', index, 'specialite', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <i className="icon-speech mr-2"></i>
              Compétences Linguistiques
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="niveau_francais">Niveau de Français *</label>
                  <select
                    className="form-select"
                    id="niveau_francais"
                    value={formData.competences_linguistiques.niveau_francais}
                    onChange={(e) => handleInputChange('competences_linguistiques', 'niveau_francais', e.target.value)}
                    required
                  >
                    <option value="">Choisir votre niveau...</option>
                    <option value="a1">A1 - Débutant</option>
                    <option value="a2">A2 - Élémentaire</option>
                    <option value="b1">B1 - Intermédiaire</option>
                    <option value="b2">B2 - Avancé</option>
                    <option value="c1">C1 - Autonome</option>
                    <option value="c2">C2 - Maîtrise</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="score_tcf">Score TCF (si applicable)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="score_tcf"
                    placeholder="Ex: 450"
                    value={formData.competences_linguistiques.score_tcf}
                    onChange={(e) => handleInputChange('competences_linguistiques', 'score_tcf', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="date_test">Date du Test</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date_test"
                    value={formData.competences_linguistiques.date_test}
                    onChange={(e) => handleInputChange('competences_linguistiques', 'date_test', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="autres_langues">Autres Langues</label>
                  <input
                    type="text"
                    className="form-control"
                    id="autres_langues"
                    placeholder="Ex: Anglais B2, Espagnol A1"
                    value={formData.competences_linguistiques.autres_langues}
                    onChange={(e) => handleInputChange('competences_linguistiques', 'autres_langues', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-title d-flex justify-content-between align-items-center">
              <span>
                <i className="icon-graduation mr-2"></i>
                Projet de Formation en France (jusqu'à 7 formations)
              </span>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addFormation}
                disabled={formData.formations.length >= 7}
              >
                <i className="fa fa-plus mr-1"></i>
                Ajouter une formation
              </button>
            </div>
          </div>
          <div className="card-body">
            {formData.formations.map((formation, index) => (
              <div key={index} className="border-bottom pb-4 mb-4">
                {index > 0 && (
                  <div className="text-right mb-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFormation(index)}
                    >
                      <i className="fa fa-trash mr-1"></i>
                      Supprimer
                    </button>
                  </div>
                )}

                <h6 className="text-primary mb-3">Formation {index + 1}</h6>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={`universite_${index}`}>Université/École *</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`universite_${index}`}
                        placeholder="Ex: Université Paris-Saclay"
                        value={formation.universite}
                        onChange={(e) => handleArrayChange('formations', index, 'universite', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={`programme_${index}`}>Programme/Formation *</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`programme_${index}`}
                        placeholder="Ex: Master en Intelligence Artificielle"
                        value={formation.programme}
                        onChange={(e) => handleArrayChange('formations', index, 'programme', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor={`niveau_${index}`}>Niveau *</label>
                      <select
                        className="form-select"
                        id={`niveau_${index}`}
                        value={formation.niveau}
                        onChange={(e) => handleArrayChange('formations', index, 'niveau', e.target.value)}
                        required
                      >
                        <option value="">Choisir...</option>
                        <option value="licence1">Licence 1</option>
                        <option value="licence2">Licence 2</option>
                        <option value="licence3">Licence 3</option>
                        <option value="master1">Master 1</option>
                        <option value="master2">Master 2</option>
                        <option value="doctorat">Doctorat</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-group">
                      <label htmlFor={`lien_${index}`}>Lien vers le programme</label>
                      <input
                        type="url"
                        className="form-control"
                        id={`lien_${index}`}
                        placeholder="https://..."
                        value={formation.lien}
                        onChange={(e) => handleArrayChange('formations', index, 'lien', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={`pourquoi_programme_${index}`}>
                        Pourquoi ce programme ? *
                        <small className="form-text text-muted d-block">
                          Expliquez en quoi cette formation correspond à votre projet
                        </small>
                      </label>
                      <textarea
                        className="form-control"
                        id={`pourquoi_programme_${index}`}
                        rows={3}
                        value={formation.pourquoi_programme}
                        onChange={(e) => handleArrayChange('formations', index, 'pourquoi_programme', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={`pourquoi_ville_${index}`}>
                        Pourquoi cet établissement/cette ville ? *
                        <small className="form-text text-muted d-block">
                          Justifiez votre choix géographique
                        </small>
                      </label>
                      <textarea
                        className="form-control"
                        id={`pourquoi_ville_${index}`}
                        rows={3}
                        value={formation.pourquoi_ville}
                        onChange={(e) => handleArrayChange('formations', index, 'pourquoi_ville', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <i className="icon-briefcase mr-2"></i>
              Projet Professionnel
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="job_title_target">Poste visé principal *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="job_title_target"
                    placeholder="Ex: Ingénieur en Intelligence Artificielle"
                    value={formData.projet_professionnel.job_title_target}
                    onChange={(e) => handleInputChange('projet_professionnel', 'job_title_target', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="secteur_activite">Secteur d'activité *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="secteur_activite"
                    placeholder="Ex: Technologie, Santé, Finance..."
                    value={formData.projet_professionnel.secteur_activite}
                    onChange={(e) => handleInputChange('projet_professionnel', 'secteur_activite', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Objectifs temporels */}
            <div className="row mt-4">
              <div className="col-md-12">
                <h6 className="text-primary mb-3">📅 Structuration de votre trajectoire de carrière</h6>
              </div>

              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title text-success">Court Terme (1-3 ans)</h6>
                    <div className="form-group">
                      <label htmlFor="short_term_goal" className="small">
                        Poste d'entrée et compétences à mettre en œuvre *
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        id="short_term_goal"
                        rows={4}
                        placeholder="Quel premier poste visez-vous après votre diplôme ? Quelles compétences acquises en France seront immédiatement utiles ?"
                        value={formData.projet_professionnel.short_term_goal}
                        onChange={(e) => handleInputChange('projet_professionnel', 'short_term_goal', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title text-warning">Moyen Terme (5-10 ans)</h6>
                    <div className="form-group">
                      <label htmlFor="medium_term_goal" className="small">
                        Évolution de carrière envisagée *
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        id="medium_term_goal"
                        rows={4}
                        placeholder="Vers quelle spécialisation ou poste de management souhaitez-vous évoluer ?"
                        value={formData.projet_professionnel.medium_term_goal}
                        onChange={(e) => handleInputChange('projet_professionnel', 'medium_term_goal', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title text-info">Long Terme (15+ ans)</h6>
                    <div className="form-group">
                      <label htmlFor="long_term_goal" className="small">
                        Ambition ultime *
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        id="long_term_goal"
                        rows={4}
                        placeholder="Quelle est votre vision à long terme ? Création d'entreprise, poste de direction, expertise reconnue..."
                        value={formData.projet_professionnel.long_term_goal}
                        onChange={(e) => handleInputChange('projet_professionnel', 'long_term_goal', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan B et Contribution */}
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="plan_b_roles">
                    Plan B - Rôles alternatifs *
                    <small className="form-text text-muted d-block">
                      Citez 2-3 autres métiers possibles avec vos compétences transférables
                    </small>
                  </label>
                  <textarea
                    className="form-control"
                    id="plan_b_roles"
                    rows={3}
                    placeholder="Ex: Analyste de données, Chef de projet technique, Consultant..."
                    value={formData.projet_professionnel.plan_b_roles}
                    onChange={(e) => handleInputChange('projet_professionnel', 'plan_b_roles', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="contribution_to_ci">
                    Contribution au développement de ton pays d'origine
                    <small className="form-text text-muted d-block">
                      Comment votre formation en France pourra bénéficier à votre pays ?
                    </small>
                  </label>
                  <textarea
                    className="form-control"
                    id="contribution_to_ci"
                    rows={3}
                    placeholder="Ex: Transfert de compétences, création d'emplois, innovation technologique..."
                    value={formData.projet_professionnel.contribution_to_ci}
                    onChange={(e) => handleInputChange('projet_professionnel', 'contribution_to_ci', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <i className="icon-star mr-2"></i>
              Motivations et Atouts Personnels
            </div>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="atouts_academiques">
                Quels sont vos principaux atouts académiques ? *
                <small className="form-text text-muted d-block">
                  Mentionnez vos forces, compétences spécifiques, résultats remarquables...
                </small>
              </label>
              <textarea
                className="form-control"
                id="atouts_academiques"
                rows={3}
                value={formData.motivations.atouts_academiques}
                onChange={(e) => handleInputChange('motivations', 'atouts_academiques', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="realisation_fiere">
                Décrivez une réalisation dont vous êtes particulièrement fier
                <small className="form-text text-muted d-block">
                  Projet, stage, participation à une compétition, engagement associatif...
                </small>
              </label>
              <textarea
                className="form-control"
                id="realisation_fiere"
                rows={3}
                value={formData.motivations.realisation_fiere}
                onChange={(e) => handleInputChange('motivations', 'realisation_fiere', e.target.value)}

              />
            </div>

            <div className="form-group">
              <label htmlFor="pourquoi_france">
                Pourquoi avoir choisi la France plutôt qu'un autre pays ? *
                <small className="form-text text-muted d-block">
                  Qualité de l'enseignement, reconnaissance des diplômes, environnement culturel...
                </small>
              </label>
              <textarea
                className="form-control"
                id="pourquoi_france"
                rows={3}
                value={formData.motivations.pourquoi_france}
                onChange={(e) => handleInputChange('motivations', 'pourquoi_france', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pourquoi_formation_choisie">
                Pourquoi cette formation spécifiquement ? *
                <small className="form-text text-muted d-block">
                  En quoi ce programme est-il unique et correspond-il parfaitement à vos objectifs ?
                </small>
              </label>
              <textarea
                className="form-control"
                id="pourquoi_formation_choisie"
                rows={3}
                value={formData.motivations.pourquoi_formation_choisie}
                onChange={(e) => handleInputChange('motivations', 'pourquoi_formation_choisie', e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1: return renderSection1();
      case 2: return renderSection2();
      case 3: return renderSection3();
      case 4: return renderSection4();
      case 5: return renderSection5();
      default: return renderSection1();
    }
  };

  return (
    <div className="container">
      <div className="page-inner">
        <div className="page-header">
          <h3 className="fw-bold mb-3">Questionnaire de Projet d'Études et Professionnel</h3>
          <ul className="breadcrumbs mb-3">
            <li className="nav-home">
              <a href="/AssistantCampusFrance">
                <i className="icon-home"></i>
              </a>
            </li>
            <li className="separator">
              <i className="icon-arrow-right"></i>
            </li>
            <li className="nav-item">
              <a href="/AssistantCampusFrance">Assistant Campus France</a>
            </li>
            <li className="separator">
              <i className="icon-arrow-right"></i>
            </li>
            <li className="nav-item">
              <a href="#">Questionnaire Projet</a>
            </li>
          </ul>
        </div>

        {/* Navigation des sections */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="progress mb-4">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${(currentSection / sections.length) * 100}%` }}
                  >
                    {Math.round((currentSection / sections.length) * 100)}%
                  </div>
                </div>

                <div className="nav nav-pills nav-secondary nav-pills-no-bd nav-pills-icons justify-content-center">
                  {sections.map((section) => (
                    <div key={section.id} className="nav-item">
                      <a
                        className={`nav-link ${currentSection === section.id ? 'active' : ''}`}
                        onClick={() => setCurrentSection(section.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="d-block" style={{ fontSize: '24px' }}>
                          {section.icon}
                        </span>
                        <span className="d-block mt-1 small">{section.title}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la section actuelle */}
        {renderCurrentSection()}

        {/* Navigation */}
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentSection(prev => Math.max(1, prev - 1))}
                    disabled={currentSection === 1}
                  >
                    <i className="fa fa-arrow-left mr-2"></i>
                    Précédent
                  </button>

                  {currentSection < sections.length ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => setCurrentSection(prev => Math.min(sections.length, prev + 1))}
                    >
                      Suivant
                      <i className="fa fa-arrow-right ml-2"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={handleSubmit}
                    >
                      {isGenerating ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Génération en cours...
                        </span>
                      ) : (
                        <>
                          <i className="fa fa-rocket mr-2"></i>
                          Générer mon projet avec l'IA
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}