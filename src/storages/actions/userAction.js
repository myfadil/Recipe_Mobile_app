import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@env';

const url = `${BASE_URL}/users/`;

async function getToken() {
  try {
    const token = await AsyncStorage.getItem('token');

    if (token !== null) {
      // Token berhasil diambil dari penyimpanan
      return token;
    } else {
      throw new Error('Token tidak ditemukan dalam penyimpanan.');
    }
  } catch (error) {
    console.error('Gagal mengambil token dari penyimpanan:', error);
    throw error; // Meneruskan kesalahan ke atas
  }
}



export const editProfile = (token, data, id) => async dispatch => {
  try {
    // let config = {
    //   headers: {
    //     Authorization: 'Bearer ' + token,
    //     'Content-Type': 'multipart/form-data',
    //   },
    // };
    dispatch({type: 'EDIT_PROFILE_PENDING'});
    const result = await axios.put(`${BASE_URL}/users/` + id, data, {headers: {
      'Authorization': `Bearer ${token}`
       }});
       const payload = result.data;
    dispatch({type: 'EDIT_PROFILE_SUCCESS', payload});
  } catch (err) {
    dispatch({type: 'EDIT_PROFILE_FAILED', payload: err.response.data.message});
    console.log('Edit Profile error');
    console.log('data = ', data);
    console.log(err);
    console.log(token)
    console.log(id)
    console.log('url: ', url + id);
  }
};
