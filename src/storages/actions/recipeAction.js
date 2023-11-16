import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@env';


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
export const getAllRecipe = (search) => async dispatch => {

  try {
    const token = await getToken();
    dispatch({ type: 'GET_RECIPE_PENDING' });
    const result = await axios.get(`${BASE_URL}/recipe`, {headers: {
      'Authorization': `Bearer ${token}`
       },
       params: {
         limit: 100,
         searchBY: 'title',
         searchRecipe: search,
       },});
    console.log(token)
    let res = result.data.data;
    console.log(result.data);
    dispatch({ type: 'GET_RECIPE_SUCCESS', payload: res });
  } catch (error) {
    dispatch({ type: 'GET_RECIPE_ERROR' });
    console.log(error)
  }
};

export const getSearchRecipe = (search) => async dispatch => {

  try {
    const token = await getToken();
    dispatch({ type: 'GET_SEARCHRECIPE_PENDING' });
    const result = await axios.get(`${BASE_URL}/recipe`, {headers: {
      'Authorization': `Bearer ${token}`
       },
       params: {
         limit: 100,
         searchBY: 'title',
         searchRecipe: search,
       },});
    console.log(search)
    let res = result.data.data;
    dispatch({ type: 'GET_SEARCHRECIPE_SUCCESS', payload: res });
    console.log(result.data);
  } catch (error) {
    dispatch({ type: 'GET_SEARCHRECIPE_ERROR' });
    console.log(error)
  }
};

export const getRecipeByCategory = (search) => async dispatch => {
  try {
    const token = await getToken();
    dispatch({ type: 'GET_RECIPE_CAT_PENDING' });
    const result = await axios.get(
      `${BASE_URL}/recipe/` + '?searchBy=categories_id::text' + '&search=' + search,
      {headers: {
        'Authorization': `Bearer ${token}`
         }});
    let res = result.data.data;
    dispatch({ type: 'GET_RECIPE_CAT_SUCCESS', payload: res });
  } catch (error) {
    console.log(search)
    dispatch({ type: 'GET_RECIPE_CAT_ERROR' });
  }
};

export const getMyRecipe = token => async dispatch => {
  const token = await getToken();
  try {
    dispatch({ type: 'GET_MY_RECIPE_PENDING' });
    const result = await axios.get(`${BASE_URL}/recipe/` + 'my-recipe', {headers: {
      'Authorization': `Bearer ${token}`
       }});
    let res = result.data.data;
    dispatch({ type: 'GET_MY_RECIPE_SUCCESS', payload: res });
  } catch (error) {
    console.log(error)
    // console.log(error.response.data.message)
    dispatch({ type: 'GET_MY_RECIPE_ERROR' , payload: error.response.data.message});
  }
};

export const getDetailRecipe = (token, id) => async dispatch => {
  try {
    const token = await getToken();
    dispatch({ type: 'GET_DETAIL_RECIPE_PENDING' });
    const result = await axios.get(`${BASE_URL}/recipe/` + id, {headers: {
      'Authorization': `Bearer ${token}`
       }});
    let res = result.data.data;
    dispatch({ type: 'GET_DETAIL_RECIPE_SUCCESS', payload: res });
  } catch (error) {
    dispatch({ type: 'GET_DETAIL_RECIPE_ERROR' });
  }
};

export const addRecipe = (token, formData) => async dispatch => {
  try {
    dispatch({ type: 'ADD_RECIPE_PENDING' });
    const result = await axios.post(`${BASE_URL}/recipe`, formData, {headers: {
      'Content-Type' : 'multipart/form-data',
      'Authorization': `Bearer ${token}`
       }});
    dispatch({ type: 'ADD_RECIPE_SUCCESS', payload : result.data });
  } catch (err) {
    dispatch({ type: 'ADD_RECIPE_FAILED', payload: err.response.data.message });
    // console.log(payload)
    console.log('Error', err);
    // console.log(err);
    console.log('Add Recipe error');
  }
};

export const editRecipe = (token, data, id) => async dispatch => {
  try {
    const token = await getToken();
    dispatch({ type: 'EDIT_RECIPE_PENDING' });
    const result = await axios.put(`${BASE_URL}/recipe/` + id, data, {headers: {
      'Authorization': `Bearer ${token}`
       }});
    const payload = result.data;
    dispatch({ type: 'EDIT_RECIPE_SUCCESS', payload });
  } catch (err) {
    dispatch({ type: 'EDIT_RECIPE_FAILED', payload: err.response.data.message });
    console.log('Edit Recipe error');
    console.log('data = ', data);
    console.log(err);
  }
};

export const deleteRecipe = (token, id) => async dispatch => {
  try {
    const token = await getToken();
    dispatch({ type: 'DELETE_RECIPE_PENDING' });
    const result = await axios.delete(`${BASE_URL}/recipe/` + `${id}`, {headers: {
      'Authorization': `Bearer ${token}`
       }});
    const recipe = result.data;
    dispatch({ type: 'DELETE_RECIPE_SUCCESS', payload: recipe });
  } catch (err) {
    dispatch({
      type: 'DELETE_RECIPE_FAILED',
      payload: err.response.data.message,
    });
    console.log('Delete Recipe error');
    console.log(err);
  }
};

// export const sendNotifs = () => async dispatch => {
//   const url_onesignal = 'https://onesignal.com/api/v1/notifications';
//   let data = {
//     included_segments: 'Subscribed Users',
//     app_id: `${process.env.ONESIGNAL_APP_ID}`,
//     headings: {en: 'New Recipe has been added'},
//     contents: {en: 'Check it out now!'},
//     name: 'RECIPES_ADDED_NOTIFS',
//   };
//   let config = {
//     headers: {
//       accept: 'application/json',
//       Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
//       'content-type': 'application/json',
//     },
//   };
//   try {
//     const result = await axios.post(url_onesignal, data, config);
//     console.log(result.data);
//   } catch (err) {
//     console.log('Send notifs error');
//     console.log(err);
//   }
// };

export const getCategories = (token) => async dispatch => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  try {
    dispatch({ type: 'GET_CATEGORIES_PENDING' });
    const result = await axios.get(`${BASE_URL}/category`, config);
    let res = result.data.data;
    dispatch({ type: 'GET_CATEGORIES_SUCCESS', payload: res });
  } catch (error) {
    dispatch({ type: 'GET_CATEGORIES_ERROR' });
  }
};
