import axios from 'axios';
import { showAlert } from './alert';
export const updateSetting = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatepassword'
        : '/api/v1/users/updateme';
    const result = await axios({
      method: 'patch',
      url,
      data,
    });

    if ((result.data.status = 'success')) {
      showAlert('success', `user ${type} updated successfully`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
