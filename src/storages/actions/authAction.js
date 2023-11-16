import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@env';

export const loginUser = data => async dispatch => {
  try {
    dispatch({ type: 'USER_LOGIN_PENDING' });
    const result = await axios.post(`${BASE_URL}/users/login`, data);
    // const user = result.data.data;
    dispatch({ type: 'USER_LOGIN_SUCCESS', payload: result.data });
    const token = result.data.token
    console.log(token)
    AsyncStorage.setItem('token', token);

    console.log('User Login success');
  } catch (err) {
    console.log('User Login failed');
    console.log(err);
    console.log(err.response.data.message);
    dispatch({ type: 'USER_LOGIN_ERROR', payload : err.response.data.message });
  }
};

// export const registerUser = data => async dispatch => {
//   try {
//     dispatch({type: 'USER_REGISTER_PENDING'});
//     const result = await axios.post(url + '/auth/register/user', data);
//     // const user = result.data.data;
//     dispatch({type: 'USER_REGISTER_SUCCESS', payload: result.data});
//     console.log('User Register success');
//   } catch (err) {
//     console.log('User Register failed');
//     console.log(err);
//     dispatch({type: 'USER_REGISTER_ERROR'});
//   }
// };



// export const requestOTP = data => async dispatch => {
//   try {
//     dispatch({type: 'REQUEST_OTP_PENDING'});
//     const result = await axios.post(url + '/users/otp', data);
//     // const user = result.data.data;
//     dispatch({type: 'REQUEST_OTP_SUCCESS', payload: result.data});
//     console.log('Request OTP success');
//   } catch (err) {
//     console.log('Request OTP failed');
//     console.log(err);
//     dispatch({type: 'REQUEST_OTP_ERROR'});
//   }
// };
// export const confirmOTP = data => async dispatch => {
//   try {
//     dispatch({type: 'CONFIRM_OTP_PENDING'});
//     const result = await axios.post(url + '/users/otp/confirm', data);
//     // const user = result.data.data;
//     dispatch({type: 'CONFIRM_OTP_SUCCESS', payload: result.data});
//     console.log('CONFIRM OTP success');
//   } catch (err) {
//     console.log('CONFIRM OTP failed');
//     console.log(err);
//     dispatch({type: 'CONFIRM_OTP_ERROR'});
//   }
// };
// export const changePass = data => async dispatch => {
//   try {
//     dispatch({type: 'CHANGE_PW_PENDING'});
//     const result = await axios.post(url + '/users/resetPassword', data);
//     // const user = result.data.data;
//     dispatch({type: 'CHANGE_PW_SUCCESS', payload: result.data});
//     console.log('CONFIRM OTP success');
//   } catch (err) {
//     console.log('CONFIRM OTP failed');
//     console.log(err);
//     dispatch({type: 'CHANGE_PW_ERROR'});
//   }
// };
// export const verifyUser = data => async dispatch => {
//   try {
//     dispatch({type: 'VERIFY_PENDING'});
//     const result = await axios.post(url + '/users/verify', data);
//     // const user = result.data.data;
//     dispatch({type: 'VERIFY_SUCCESS', payload: result.data});
//     console.log('User verify success');
//   } catch (err) {
//     console.log('User verify failed');
//     console.log(err);
//     dispatch({type: 'VERIFY_ERROR'});
//   }
// };
//ADD VERIFYUSER
