import axios from 'axios';
import { showAlert } from './alert';
export const updateSetting = async (data, type) => {
  try {
    console.log('hey there');
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updatepassword'
        : 'http://localhost:3000/api/v1/users/updateme';
    const result = await axios({
      method: 'patch',
      url,
      data,
    });

    if ((result.data.status = 'success')) {
      showAlert('success', `user ${type} updated successfully`);
    }
    console.log(result);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
