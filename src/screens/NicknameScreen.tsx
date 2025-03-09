import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import {LeftArrowIcon, RefreshIcon, RemoveIcon} from '../components/Icons';
import {useAuth} from '../hooks';
import axios from 'axios';
import {API_PREFIX} from '../constants';
import {useDebounce} from '../hooks';
import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth/token';
import Toast from 'react-native-toast-message';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useSharedValue} from 'react-native-reanimated';
import Markdown from 'react-native-markdown-display';
import {TERMS_OF_SERVICE, PRIVACY_POLICY} from '../constants/index';

const NicknameScreen = ({navigation, route}: any) => {
  const [nickname, setNickname] = useState('');
  const [warning, setWarning] = useState('');
  const {setIsAuthenticated} = useAuth();
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const debouncedString = useDebounce(nickname, 500);
  const [agree, setAgree] = useState(false);
  const [docsContext, setDocsContext] = useState({
    title: '이용약관',
    content: '',
  });

  // BottomSheet 애니메이션 값을 관리하는 shared value
  const bottomSheetTranslateY = useSharedValue(0);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 바텀 시트의 snap 포인트 정의
  const snapPoints = useMemo(() => [650], []);

  const onChangeText = async (text: string) => {
    setNickname(text);
    // 유효하다면
    if (await validationCheck(text)) {
      setIsNicknameValid(true);
      return;
    }

    setIsNicknameValid(false);
  };

  const validationCheck = async (nickname: string): Promise<boolean> => {
    if (nickname.length < 2) {
      setWarning('닉네임은 최소 2글자 이상이어야 합니다');
      return false;
    }

    const response = await customAxios.get(`/users/nickname/${nickname}`);

    if (!response.data.is_available) {
      setWarning('존재하는 닉네임입니다');
      return false;
    }

    const regex = /씨발|새끼/g;

    if (regex.test(nickname)) {
      setWarning('비속어는 포함할 수 없습니다');
      return false;
    }

    setWarning('사용할 수 있는 닉네임입니다');
    return true;
  };

  const onComplete = async () => {
    if (!isNicknameValid) {
      Toast.show({
        position: 'top',
        type: 'custom_type',
        text1:
          '닉네임은 최소 2글자 이상이어야 하며, 중복되지 않아야 합니다. 비속어는 포함할 수 없습니다',
      });
      return;
    }

    if (!agree) {
      Toast.show({
        position: 'top',
        type: 'custom_type',
        text1: '이용약관과 개인정보보호처리방침에 동의해주세요',
      });
      return;
    }

    const accessToken = await getAccessToken();
    if (isNicknameValid) {
      const response = await customAxios.put(
        `/users/update`,
        {
          nickname,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    }
  };

  const onCheck = () => {
    setAgree(!agree);
  };

  const onPressTerms = () => {
    setDocsContext({
      title: '이용약관',
      content: TERMS_OF_SERVICE,
    });
    bottomSheetRef.current?.snapToIndex(0);
  };

  const onPressPrivacy = () => {
    setDocsContext({
      title: '개인정보보호처리방침',
      content: PRIVACY_POLICY,
    });
    bottomSheetRef.current?.snapToIndex(0);
  };

  useEffect(() => {
    onChangeText(debouncedString);
  }, [debouncedString]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.header}>
          {/* 상단 헤더 */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'absolute',
              left: 16,
            }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <LeftArrowIcon />
            </Pressable>
          </View>
          <Text style={styles.headerText}>{'프로필 설정'}</Text>
        </View>
        <View style={styles.layout}>
          <Text style={styles.title}>닉네임을 설정해주세요</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="닉네임을 입력해주세요"
                placeholderTextColor={'#8E979E'}
                defaultValue=""
                value={nickname}
                onChangeText={setNickname}
              />
              <View style={styles.iconContainer}>
                {nickname.length > 0 ? (
                  <Pressable
                    onPress={() => {
                      setNickname('');
                    }}>
                    <RemoveIcon />
                  </Pressable>
                ) : null}
                {nickname.length > 0 ? (
                  <Pressable
                    onPress={() => {
                      validationCheck(nickname);
                    }}>
                    <RefreshIcon />
                  </Pressable>
                ) : null}
              </View>
            </View>
            <Text
              style={{
                ...styles.warning,
                color: isNicknameValid ? '#1CD7AE' : '#FF0000',
              }}>
              {warning}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 20,
            paddingRight: 20,
            gap: 16,
          }}>
          <View style={styles.termsBox}>
            <Pressable onPress={onCheck} style={styles.checkBox}>
              {agree ? (
                <Text style={{fontSize: 10, color: '#1CD7AE'}}>✔️</Text>
              ) : null}
            </Pressable>
            <Text style={styles.termsText}>
              가는김에의{' '}
              <Pressable onPress={onPressTerms} style={styles.termsPressable}>
                <Text style={styles.termsLink}>이용약관</Text>
              </Pressable>
              과
              <Pressable onPress={onPressPrivacy} style={styles.termsPressable}>
                <Text style={styles.termsLink}>개인정보보호처리방침</Text>
              </Pressable>
              에 대해 동의합니다.
            </Text>
          </View>
          <Pressable
            onPress={onComplete}
            style={({pressed}) => [
              {
                width: '100%',
                padding: 16,
                borderRadius: 12,
                backgroundColor: '#1CD7AE',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
              {backgroundColor: pressed ? '#0BBDA1' : '#1CD7AE'},
            ]}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontFamily: 'Pretendard-SemiBold',
              }}>
              가입 완료하기
            </Text>
          </Pressable>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          handleIndicatorStyle={{backgroundColor: '#E6EAED'}}
          snapPoints={snapPoints}
          enablePanDownToClose
          enableDynamicSizing={false}
          onAnimate={(fromIndex, toIndex) => {
            if (toIndex === 0) {
              bottomSheetTranslateY.value = -snapPoints[toIndex] + 10;
            } else {
              bottomSheetTranslateY.value = 0;
            }
          }}>
          <BottomSheetView>
            <View
              style={{
                paddingLeft: 20,
                paddingTop: 8,
                paddingBottom: 20,
              }}>
              <Text
                style={{
                  color: '#00434E',
                  fontSize: 17,
                  fontFamily: 'Pretendard-SemiBold',
                }}>
                {docsContext.title}
              </Text>
            </View>
          </BottomSheetView>
          <BottomSheetScrollView
            contentContainerStyle={{
              gap: 20,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 20,
            }}>
            <Markdown>{docsContext.content}</Markdown>
          </BottomSheetScrollView>
        </BottomSheet>
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
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 11,
    maxHeight: 50,
    borderBottomWidth: 1,
    borderColor: '#F2F4F6',
  },
  headerText: {
    color: '#181818',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1B1B1B',
    fontFamily: 'Pretendard-Medium',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#C7CDD1',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 8,
    paddingRight: 8,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  layout: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    color: '#1B1B1B',
    fontFamily: 'NanumSquareNeoOTF-Bd',
    fontWeight: 'bold',
  },
  warning: {
    fontSize: 14,
    color: '#FF0000',
    fontFamily: 'Pretendard-Regular',
    lineHeight: 22,
    paddingLeft: 8,
  },
  termsBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 6,
  },
  termsPressable: {
    height: 14,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#8E979E',
    fontFamily: 'Pretendard-Regular',
  },
  termsLink: {
    fontSize: 14,
    color: '#1CD7AE',
    fontFamily: 'Pretendard-Regular',
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#C7CDD1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
});

export default NicknameScreen;
