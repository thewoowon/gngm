import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import {LeftArrowIcon} from '../components/Icons';
import {useMe} from '../hooks';
import {User} from '../types/get';
import {ProfileImageUploader} from '../components/ImageUploader/ProfileImageUploader';
import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth';
import {useFocusEffect} from '@react-navigation/native';

const ProfileEditScreen = ({navigation, route}: any) => {
  const {getMe} = useMe();

  const [user, setUser] = useState<Partial<User>>({
    id: 0,
    nickname: '',
    src: '',
    is_job_open: 0,
    job: null,
    job_description: null,
  });
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const onSave = async () => {
    const data = await customAxios.put(
      '/users/update',
      {
        ...user,
        is_job_open: isEnabled ? 1 : 0,
      },
      {
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      },
    );
    if (data.status === 200) {
      Alert.alert('저장되었습니다.');
      navigation.goBack();
    }
  };

  const fetchMe = async () => {
    const data = await getMe();
    if (data) {
      setUser({
        id: data.id,
        nickname: data.nickname,
        src: data.src,
        is_job_open: data.is_job_open,
        job: data.job,
        job_description: data.job_description,
      });

      setIsEnabled(data.is_job_open === 1);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMe();
    }, []),
  );
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <LeftArrowIcon />
          </Pressable>
          <Text style={styles.headerText}>내 정보 수정</Text>
          <Pressable onPress={onSave}>
            <Text style={styles.saveText}>저장</Text>
          </Pressable>
        </View>
        <View style={styles.flexColumn}>
          <View style={styles.flexFull}>
            <ProfileImageUploader
              imageUri={user.src}
              setImageUri={uri => {
                setUser({
                  ...user,
                  src: uri || '',
                });
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
            <Text style={styles.labelText}>닉네임</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="닉네임을 입력해주세요"
              value={user.nickname}
              onChangeText={text => {
                setUser({
                  ...user,
                  nickname: text,
                });
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
            <Text style={styles.labelText}>직업</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="직업을 입력해주세요"
              value={user.job || ''}
              onChangeText={text => {
                setUser({
                  ...user,
                  job: text,
                });
              }}
            />
            <TextInput
              style={styles.titleInput}
              placeholder="직업에 대한 설명을 입력해주세요"
              value={user.job_description || ''}
              onChangeText={text => {
                setUser({
                  ...user,
                  job_description: text,
                });
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
            <Text style={styles.labelText}>직업 공개 여부</Text>
            <View style={styles.flexRow}>
              <Text style={styles.tickLabel}>공개</Text>
              <Switch
                trackColor={{false: '#767577', true: '#1CD7AE'}}
                thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundStyle: {
    flex: 1,
  },
  flexColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  flexFull: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 16,
    paddingRight: 20,
    maxHeight: 50,
  },
  headerText: {
    color: '#181818',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  saveText: {
    color: '#B1BAC0',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Pretendard-Medium',
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#6E7881',
    lineHeight: 19,
    letterSpacing: -0.01,
  },
  titleInput: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E6EAED',
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  tickLabel: {
    color: '#1B1B1B',
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 24,
  },
  backgroundImage: {
    width: 108,
    height: 108,
    borderRadius: 54,
  },
});

export default ProfileEditScreen;
