import React from 'react';
import {
  View,
  Image,
  Button,
  StyleSheet,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs'; // 파일 시스템 라이브러리 설치 필요
import {BigProfileIcon} from '../../Icons';
import {
  RESULTS,
  PERMISSIONS,
  request,
  requestLocationAccuracy,
  requestMultiple,
} from 'react-native-permissions';
import customAxios from '../../../axios/customAxios';
import {getAccessToken} from '../../../services/auth';

const ProfileImageUpload = ({
  imageUri,
  setImageUri,
}: {
  imageUri: string | null | undefined;
  setImageUri: (uri: string | null | undefined) => void;
}) => {
  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });

    if (result.didCancel) {
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Please select an image first');
      return;
    }

    try {
      // 파일 경로에서 파일 읽기
      const fileStat = await RNFS.stat(imageUri); // 파일 메타데이터 가져오기
      const fileData = await RNFS.readFile(imageUri, 'base64'); // Base64로 읽기

      // FormData에 파일 추가
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg', // MIME 타입 설정
        name: fileStat.name || 'profile.jpg', // 파일 이름
        data: fileData, // Base64 데이터
      });

      // 서버 요청
      const accessToken = await getAccessToken();
      const response = await customAxios.post('/upload/profile', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Upload successful!');
        response.data && setImageUri(response.data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={selectImage}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.image} />
        ) : (
          <BigProfileIcon />
        )}
      </Pressable>

      {/* <Button title="Select Image" onPress={selectImage} />
      <Button title="Upload Image" onPress={uploadImage} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
  image: {width: 108, height: 108, borderRadius: 56, marginBottom: 20},
});

export default ProfileImageUpload;
