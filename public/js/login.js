import { showAlert } from './alert.js';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'post',
      url: '/api/v1/users/signin',
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
export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const result = await axios({
      method: 'post',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
    });
    if ((result.data.status = 'success')) {
      showAlert('success', 'sign up successfully!');
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
    const result = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
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
