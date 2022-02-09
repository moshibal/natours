import axios from 'axios';
import { showAlert } from './alert.js';
export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/users/signin',
      data: {
        email,
        password,
      },
    });
    if ((result.data.status = 'success')) {
      showAlert('success', 'logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
export const logout = async () => {
  try {
    console.log('im log out');
    const result = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });

    if (result.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
