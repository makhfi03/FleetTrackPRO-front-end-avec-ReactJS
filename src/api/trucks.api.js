const API_BASE_URL = 'http://localhost:5001/api/v1';

export const getCamionsApi = async (token) => {
    const response = await fetch(`${API_BASE_URL}/camions`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Impossible de charger les camions');
    }

    return data.data || [];
};

export const createCamionApi = async (token, camionData) => {
    const response = await fetch(`${API_BASE_URL}/camions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(camionData)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du camion');
    }

    return data.data;
};

export const updateCamionApi = async (token, id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/camions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Impossible de modifier le camion');
    }

    return data.data;
};

export const archiveCamionApi = async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/camions/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'archivage du camion");
    }

    return data.data;
};
