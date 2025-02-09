import React, {useState} from 'react';
import {View, Image, Button, StyleSheet, Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {BigProfileIcon} from '../../Icons';

const MerchandiseImageUploader = () => {
  const [imageUri, setImageUri] = useState<string | null | undefined>(null);

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

    const formData = new FormData();
    formData.append('profileImage', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    try {
      const response = await fetch('https://your-backend-url.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.json();
      Alert.alert('Upload successful!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{uri: imageUri}} style={styles.image} />
      ) : (
        <BigProfileIcon />
      )}

      <Button title="Select Image" onPress={selectImage} />
      <Button title="Upload Image" onPress={uploadImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', flex: 1},
  image: {width: 108, height: 108, borderRadius: 56, marginBottom: 20},
});

export default MerchandiseImageUploader;
