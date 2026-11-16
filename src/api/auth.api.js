const API_BASE_URL = 'http://localhost:5001/api/v1';

export const loginApi = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            let message = data.message || 'Erreur lors de la tentative de connexion';

            if (response.status === 401) {
                message = 'Identifiants incorrects (email ou mot de passe invalide)';
            } else if (response.status === 403) {
                message = 'Accès refusé : votre compte est suspendu';
            } else if (response.status === 429) {
                message = 'Trop de tentatives de connexion. Veuillez réessayer dans quelques instants';
            }

            const error = new Error(message);
            error.status = response.status;
            throw error;
        }

        return data.data;
    } catch (err) {
        if (!err.status) {
            const networkError = new Error('Impossible de joindre le serveur API (vérifiez que le backend est actif)');
            networkError.status = 0;
            throw networkError;
        }
        throw err;
    }
};

export const logoutApi = async (token) => {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch {
        return;
    }
};
