import axiosInstance from './axiosConfig';

export const authService = {
  async loginWithGoogle(token: string) {
    try {
      const response = await axiosInstance.post('/auth/regular-login', { providerName: "GOOGLE", token });
      const data = await response.data;

      console.log(data);

      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}; 