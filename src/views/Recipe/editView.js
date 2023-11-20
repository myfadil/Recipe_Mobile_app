/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React, {useEffect, useState} from 'react';
import ImageResizer from 'react-native-image-resizer';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused} from '@react-navigation/native';
import {MainStyle} from '../../AppStyles';
import {useDispatch, useSelector} from 'react-redux';
import {
  editRecipe,
  getDetailRecipe,
  getCategories,
} from '../../storages/actions/recipeAction';
export default function EditView({route, navigation }) {
  const dispatch = useDispatch();
  const {itemId} = route.params;
  const id = JSON.stringify(itemId);
  const token = useSelector(state => state.auth.data.data.token);
  const users_id = useSelector(state => state.auth.data.data[0].id);
  console.log(users_id);
  const data = useSelector(state => state.edit);
  const categories = useSelector(state => state.categories);
  const detail = useSelector(state => state.detail);
  const detaildata = useSelector(state => state.detail);
  const [filePath, setFilePath] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [title, setTitle] = useState('');
  const [posted, setPosted] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [categories_id, setCategories_id] = useState('');
  const isFocused = useIsFocused();


  useEffect(() => {
    dispatch(getDetailRecipe(token, id));
    dispatch(getCategories());
    if(isFocused){
      setPosted(false);
    }
  }, [dispatch, id, token, isFocused]);

  useEffect(() => {
    if (detail.data) {
      setTitle(detail.data.title);
      setIngredients(detail.data.ingredients);
      setFilePath(detail.data.photo);
      setCategories_id(detail.data.category_id);
    }
    if(isFocused){
      setPosted(false);
    }
  }, [detail, isFocused]);
  const postForm = async (e) => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter Recipe title');
      return;
    }

    if (ingredients.trim() === '') {
      Alert.alert('Error', 'Please enter Recipe ingredients');
      return;
    }

    if (!filePath) {
      Alert.alert('Error', 'Please select a photo');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('category_id', parseInt(categories_id, 10));
    formData.append('users_id', users_id);
    formData.append(
      'image',
      fileName
        ? {
            uri: filePath,
            type: fileType,
            name: fileName,
          }
        : detail.photo,
    );
    console.log(formData);
    dispatch(editRecipe(token, formData, id))
  .then(() => {
    console.log(data)
    // Ini hanya dijalankan jika permintaan berhasil
    setPosted(true);
    setTimeout(() => {
      navigation.navigate('MyMenu');
    }, 1500);
  })
  .catch((err) => {
    // Ini dijalankan jika ada kesalahan
    console.log('Edit Recipe error');
    console.log('data = ', data);
    console.log(err);
    // Anda juga dapat menambahkan penanganan kesalahan di sini jika diperlukan
  });

  };
  const cameraLaunch = async () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, async response => {
      if (response.didCancel) {
        alert('Upload photo canceled');
        return;
      } else if (response.errorCode === 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode === 'permission') {
        alert('Permission not granted');
        return;
      } else if (response.errorCode === 'others') {
        alert(response.errorMessage);
        return;
      }
      let assets = response.assets[0];

      console.log('fileName = ', assets.fileName);
      console.log('type = ', assets.type);
      console.log('uri = ', assets.uri);

      const resizedImage = await ImageResizer.createResizedImage(
        assets.uri,
        800, // Lebar yang Anda inginkan
        600, // Tinggi yang Anda inginkan
        'JPEG', // Format gambar yang diinginkan
        80, // Kualitas gambar (0-100)
        0, // Rotasi (0 untuk tidak ada rotasi)
      );
  
      setFilePath(resizedImage.uri);
      setFileName(assets.fileName);
      setFileType(assets.type);
    });
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        cameraLaunch();
      } else {
        alert('Camera Permission not granted');
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const chooseFile = type => {
    let options = {
      mediaType: type,
      quality: 1,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        alert('Upload photo canceled');
        return;
      } else if (response.errorCode === 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode === 'permission') {
        alert('Permission not granted');
        return;
      } else if (response.errorCode === 'others') {
        alert(response.errorMessage);
        return;
      }
      let assets = response.assets[0];

      const resizedImage = await ImageResizer.createResizedImage(
        assets.uri,
        800,
        600,
        'JPEG',
        80,
        0,
      );
  
        console.log('fileName = ', assets.fileName);
        console.log('type = ', assets.type);
        console.log('uri = ', assets.uri);
        setFilePath(resizedImage.uri);
        setFileName(assets.fileName);
        setFileType(assets.type);
    });
  };
  if (detail == null) {
    return (
      <View style={MainStyle.container}>
        <View style={MainStyle.main}>
          <ActivityIndicator
            size={'large'}
            color={'#EFC81A'}
            style={{alignSelf: 'center'}}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={MainStyle.container}>
      <View style={MainStyle.main}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={MainStyle.headerText}>Edit Recipe</Text>
          {categories.isLoading && (
            <View style={{marginVertical: 16}}>
              <View>
                <ActivityIndicator
                  size={'large'}
                  color={'#EFC81A'}
                  style={{alignSelf: 'center'}}
                />
              </View>
            </View>
          )}
          {detaildata.isLoading && (
            <View style={{marginVertical: 16}}>
              <View>
                <ActivityIndicator
                  size={'large'}
                  color={'#EFC81A'}
                  style={{alignSelf: 'center'}}
                />
              </View>
            </View>
          )}
          <Text style={styles.label}>Title</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={value => setTitle(value)}
            />
          </View>
          <Text style={styles.label}>Ingredients</Text>
          <TextInput
            multiline={true}
            textAlignVertical="top"
            style={styles.inputLarge}
            placeholder="Ingredients"
            value={ingredients}
            onChangeText={value => setIngredients(value)}
          />
          <Text style={styles.label}>Photo Preview</Text>
          {filePath === null ? (
            <Image
              source={{
                uri: 'https://res.cloudinary.com/dedas1ohg/image/upload/v1680855181/recipes_images/toppng.com-clipart-free-seaweed-clipart-draw-food-placeholder-323x257_bl22rr.png',
              }}
              style={{
                width: 319,
                height: 200,
                alignSelf: 'center',
                borderRadius: 16,
                backgroundColor: 'grey',
              }}
            />
          ) : (
            <Image
              source={{uri: filePath}}
              style={{
                width: 319,
                height: 200,
                alignSelf: 'center',
                borderRadius: 16,
                backgroundColor: 'grey',
                marginBottom: 10,
              }}
            />
          )}
          <Text style={styles.label}>Upload Photo</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 319,
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.btn2}
              onPress={() => requestCameraPermission()}>
              <Text style={styles.btnlabel}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.btn2}
              onPress={() => chooseFile('photo')}>
              <Text style={styles.btnlabel}>Gallery</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Category</Text>
          <Picker
            style={styles.input}
            selectedValue={categories_id}
            onValueChange={item => setCategories_id(item)}>
            {categories.data?.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.category_name}
                value={item.category_id}
              />
            ))}
          </Picker>
          {posted && <Text style={styles.label}>Edit Recipe Successful!</Text>}
          {data.isError && (
            <Text style={styles.label}>Edit Recipe Failed.</Text>
          )}
          <TouchableOpacity style={styles.btn} onPress={postForm}>
            <Text style={styles.btnlabel}>
              {data.isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                'POST'
              )}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 319,
    height: 50,
    elevation: 5,
    color: 'black',
  },
  inputLarge: {
    marginBottom: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 319,
    height: 200,
    elevation: 5,
    color: 'black',
  },
  label: {
    marginBottom: 10,
    color: 'black',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#EFC81A',
    padding: 10,
    borderRadius: 15,
    width: 183,
    height: 50,
    marginBottom: 16,
  },
  btn2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFC81A',
    padding: 10,
    borderRadius: 15,
    width: 100,
    height: 50,
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  btnlabel: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: 'white',
  },
});
