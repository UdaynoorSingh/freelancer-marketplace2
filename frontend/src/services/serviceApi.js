const API_URL = process.env.REACT_APP_SERVER_URL + '/api/services';

export const getService = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
};

export const deleteService = async (id, token) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
};

export const updateService = async (id, formData, token) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    return res.json();
}; 