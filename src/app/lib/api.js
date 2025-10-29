// lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/entretien/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    let token;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    } // ou depuis votre store

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Token ${token}` }), // Ajouter le header d'auth
        ...options.headers,
      },
      ...options,
    };


    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
         if (response.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Instance de l'API client
export const apiClient = new ApiClient();

// Services spécifiques pour l'entretien
export const entretienService = {
  // Catégories
  async getCategories() {
    return apiClient.get('/categories/');
  },

  // Questions
  async getQuestions() {
    return apiClient.get('/questions/');
  },

  async getQuestionsByCategory(categoryId) {
    return apiClient.get(`/questions/par_categorie/?categorie_id=${categoryId}`);
  },

  // Sessions
  async demarrerSession(categoryId, modeSimulation = false) {
    return apiClient.post('/sessions/demarrer_session/', {
      categorie_id: categoryId,
      mode_simulation: modeSimulation
    });
  },

  async getSessions() {
    return apiClient.get('/sessions/');
  },

  async terminerSession(sessionId) {
    return apiClient.post(`/sessions/${sessionId}/terminer_session/`);
  },

  // Réponses
  async soumettreReponse(sessionId, questionId, texteReponse, dureeReponse = 0) {
    return apiClient.post('/reponses/soumettre_reponse/', {
      session_id: sessionId,
      question_id: questionId,
      texte_reponse: texteReponse,
      duree_reponse: dureeReponse
    });
  },

  async getReponses() {
    return apiClient.get('/reponses/');
  },

  // Analyses
  async getAnalyses() {
    return apiClient.get('/analyses/');
  },

  // Statistiques
  async getStatistiques() {
    return apiClient.get('/statistiques/utilisateur/');
  }
};