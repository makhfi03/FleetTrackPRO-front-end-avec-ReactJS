const API_BASE_URL = 'http://localhost:5001/api/v1';

export const getMyTrajetsApi = async (token) => {
    const response = await fetch(`${API_BASE_URL}/chauffeur/trajets`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || 'Impossible de récupérer vos trajets');
    }

    return data.data || [];
};
