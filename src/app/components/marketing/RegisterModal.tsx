// components/RegisterModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface RegisterFormData {
  // username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  acceptConditions: boolean;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    // username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    acceptConditions: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    if (!formData.acceptConditions) {
      setErrors({ acceptConditions: 'Veuillez accepter les conditions générales' });
      return;
    }

    if (formData.password !== formData.password2) {
      setErrors({ password2: 'Les mots de passe ne correspondent pas' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
          first_name: formData.first_name,
          last_name: formData.last_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Inscription réussie
        console.log('Inscription réussie:', data);
        
        // Stocker le token (vous pouvez utiliser un contexte ou localStorage)
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userId', data.user_id);
          // localStorage.setItem('username', data.username);
        }

        // Fermer le modal et recharger la page ou mettre à jour l'état global
        onClose();
        
        // Réinitialiser le formulaire
        setFormData({
          // username: '',
          email: '',
          password: '',
          password2: '',
          first_name: '',
          last_name: '',
          acceptConditions: false,
        });
         setTimeout(() => {
            alert('Inscription réussie ! Veuillez maintenant vous connecter avec vos identifiants.');
          // Ouvrir automatiquement le modal de connexion
          onSwitchToLogin();
      }, 500);

      } else {
        // Gestion des erreurs du serveur
        // if (data.username) {
        //   setErrors({ username: data.username[0] });
        // }
        if (data.email) {
          setErrors({ email: data.email[0] });
        }
        if (data.password) {
          setErrors({ password: data.password[0] });
        }
        if (data.non_field_errors) {
          setErrors({ general: data.non_field_errors[0] });
        }
        
        console.error('Erreur d\'inscription:', data);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Inscription avec Google');
    // Implémentation Google OAuth à venir
  };

  // Empêcher le défilement du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center pt-20">
      {/* Overlay flouté */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden z-[101] max-h-[90vh] mt-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sticky top-0 z-14">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Créer votre compte
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="px-6 pt-4 mx-2 max-h-[calc(90vh-80px)]">
          {/* Message d'erreur général */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Bouton Google */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            S'inscrire avec Google
          </button>

          {/* Séparateur */}
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre prénom"
                />
                {errors.first_name && (
                  <p className="mt-1 text-red-500 text-xs">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre nom"
                />
                {errors.last_name && (
                  <p className="mt-1 text-red-500 text-xs">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Choisissez un nom d'utilisateur"
              />
              {errors.username && (
                <p className="mt-1 text-red-500 text-xs">{errors.username}</p>
              )}
            </div> */}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                minLength={6}
              />
              {errors.password && (
                <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="password2"
                name="password2"
                required
                value={formData.password2}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password2 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                minLength={6}
              />
              {errors.password2 && (
                <p className="mt-1 text-red-500 text-xs">{errors.password2}</p>
              )}
            </div>

            {/* Checkbox conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptConditions"
                name="acceptConditions"
                checked={formData.acceptConditions}
                onChange={handleChange}
                className={`mt-1 w-4 h-4 text-blue-600 border rounded focus:ring-blue-500 ${
                  errors.acceptConditions ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <label htmlFor="acceptConditions" className="text-sm text-gray-600">
                J'accepte les{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  conditions générales d'utilisation
                </a>{' '}
                et la{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  politique de confidentialité
                </a>
              </label>
            </div>
            {errors.acceptConditions && (
              <p className="text-red-500 text-xs -mt-2">{errors.acceptConditions}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !formData.acceptConditions}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Inscription...
                </div>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="text-center mt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Déjà inscrit ?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}