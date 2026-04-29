'use strict';
'use strict';

const ApiService = {
  baseUrl: 'https://jsonplaceholder.typicode.com',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options
    };

    const response = await fetch(url, config);
    
    // Si la respuesta no es 200-299, lanza error para el catch
    if (!response.ok) {
      throw new Error(`Fallo en el servidor: ${response.status}`);
    }
    
    return await response.json();
  },

  getPosts: (limit = 20) => ApiService.request(`/posts?_limit=${limit}`),
  createPost: (data) => ApiService.request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id, data) => ApiService.request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id) => ApiService.request(`/posts/${id}`, { method: 'DELETE' })
};