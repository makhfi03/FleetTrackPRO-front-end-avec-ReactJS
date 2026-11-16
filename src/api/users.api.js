const API_BASE_URL = 'http://localhost:5001/api/v1';

export const getChauffeursApi = async (token) => {
    const response = await fetch(`${API_BASE_URL}/chauffeurs`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Impossible de charger les chauffeurs');
    }

    return data.data || [];
};

export const createChauffeurApi = async (token, chauffeurData) => {
    const response = await fetch(`${API_BASE_URL}/chauffeurs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(chauffeurData)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du chauffeur');
    }

    return data.data;
};

export const updateChauffeurStatusApi = async (token, id, statut) => {
    const response = await fetch(`${API_BASE_URL}/chauffeurs/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ statut })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Impossible de modifier le statut');
    }

    return data.data;
};
