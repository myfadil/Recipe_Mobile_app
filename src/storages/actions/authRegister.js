import axios from 'axios';
import {BASE_URL} from '@env';

export const registerUser = data => async dispatch => {
      try {
        dispatch({type: 'USER_REGISTER_PENDING'});
        const result = await axios.post(`${BASE_URL}/users/register`, data);
        // const user = result.data.data;
        dispatch({type: 'USER_REGISTER_SUCCESS', payload: result.data});
        console.log('User Register success');
      } catch (err) {
        console.log('User Register failed');
        console.log(err);
        dispatch({type: 'USER_REGISTER_ERROR'});
      }
    };