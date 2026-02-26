import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

export const getAuthMe = async () => {
    const { data } = await api.get('/auth/me');
    return data;
};

export const logout = async () => {
    const { data } = await api.post('/auth/logout');
    return data;
};

export const listPosts = async () => {
    const { data } = await api.get('/posts');
    return data;
};

export const getPublicPosts = async () => {
    const { data } = await api.get('/public/posts');
    return data;
};

export const createPost = async (payload) => {
    const { data } = await api.post('/posts', payload);
    return data;
};

export const updatePost = async (payload) => {
    const { data } = await api.put('/posts', payload);
    return data;
};

export const deletePost = async (path) => {
    const { data } = await api.delete('/posts', { data: { path } });
    return data;
};

// File base64 conversion utility logic moved here
export const uploadMedia = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result;
            try {
                const { data } = await api.post('/posts/media', {
                    filename: file.name,
                    base64Data
                });
                resolve(data);
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default api;
