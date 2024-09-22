import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}`;

class AuthApi {
  async signIn(request) {
    const { username, password } = request;
    
    return axios.post(`${apiUrl}/login`, {
      "username": username,
      "password": password
    });
  }

  async signUp(request) {
    return axios.post(`${apiUrl}/signup`, request)
  }

  me(id) {
    return axios.get(`${apiUrl}/users/${id}`)
  }
}

export const authApi = new AuthApi();
