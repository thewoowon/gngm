import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {NewNaverMap} from '../components/NaverMap';
import {SearchIcon, RingIcon, GPSIcon} from '../components/Icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {useArticle, useNotification} from '../hooks';
import Geolocation from 'react-native-geolocation-service';
import {Article} from '../types/get';
import ArticleBottomView from '../components/ArticleBottomView';
import {useFocusEffect} from '@react-navigation/native';

const AroundMainScreen = ({navigation, route}: any) => {
  const [text, setText] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnread, setIsUnread] = useState(false);

  // BottomSheet 애니메이션 값을 관리하는 shared value
  const bottomSheetTranslateY = useSharedValue(0);

  // useArticle 훅을 사용하여 데이터를 가져옴
  const {findAroundArticles} = useArticle();
  const {findAllNotifications} = useNotification();

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 바텀 시트의 snap 포인트 정의
  const snapPoints = useMemo(() => [300, 550], []);

  const handlePress = () => {
    navigation.navigate('Notification');
  };

  // 애니메이션 스타일 - 버튼의 위치
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: bottomSheetTranslateY.value}],
    };
  });

  // BottomSheet 애니메이션 값 반응 설정
  useAnimatedReaction(
    () => bottomSheetTranslateY.value,
    (prepared, previous) => {
      bottomSheetTranslateY.value = prepared; // BottomSheet와 버튼이 동시에 움직이도록 설정
    },
  );

  const fetchArticles = async () => {
    if (!currentLocation) {
      getCurrentLocation();
    }
    const response = await findAroundArticles({
      latitude: currentLocation?.latitude || 37.5665,
      longitude: currentLocation?.longitude || 126.978,
      distance: 10,
    });
    setArticles(response);
  };

  const openBottomSheet = () => bottomSheetRef.current?.snapToIndex(0);
  const closeBottomSheet = () => bottomSheetRef.current?.close();

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        setIsLoading(false);
      },
      () => {
        // Alert.alert('위치 오류', '현재 위치를 가져올 수 없습니다.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const fetchNotifications = async () => {
    const notifications = await findAllNotifications();
    const unread = notifications.some(
      notification => notification.status === 'unread',
    );
    setIsUnread(unread);
  };

  // 네이버 지도에서 사용자의 위치를 받아오는 함수
  // 네이버 지도에 실시간 위치를 받아오기
  useEffect(() => {
    fetchArticles();
    fetchNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchArticles();
      fetchNotifications();
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
        <NewNaverMap
          isLoading={isLoading}
          currentLocation={currentLocation}
          openBottomSheet={openBottomSheet}
          closeBottomSheet={closeBottomSheet}
          getCurrentLocation={getCurrentLocation}
          setIsLoading={setIsLoading}
          markers={articles.map(article => {
            return {
              articleId: article.id,
              latitude: parseFloat(article.address.latitude),
              longitude: parseFloat(article.address.longitude),
              articleType: article.article_type,
            };
          })}
        />
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            paddingLeft: 20,
            paddingRight: 20,
          }}>
          <View style={styles.inputBox}>
            <SearchIcon color="#8E979E" />
            <TextInput
              style={styles.input}
              placeholder="내 주변 전달 찾기"
              placeholderTextColor={'#8E979E'}
              value={text}
              onChangeText={setText}
            />
          </View>
          <Pressable
            style={({pressed}) => [
              styles.ring,
              {backgroundColor: pressed ? '#eeeeee' : 'white'},
            ]}
            onPress={handlePress}>
            <RingIcon />
            {
              // 확인되지 않은 알림이 있을 경우 빨간색 동그라미 표시
              isUnread && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    borderRadius: 50,
                    backgroundColor: 'red',
                    zIndex: 1,
                    ...{borderWidth: 1, borderColor: 'white'},
                  }}
                />
              )
            }
          </Pressable>
        </View>

        {/* 하단 버튼 */}
        <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
          <Pressable
            style={({pressed}) => [
              styles.gps,
              {backgroundColor: pressed ? '#eeeeee' : 'white'},
            ]}
            onPress={getCurrentLocation}>
            <GPSIcon />
          </Pressable>
        </Animated.View>
        <BottomSheet
          ref={bottomSheetRef}
          // BottomSheet는 처음에 펼쳐진 상태로 시작
          index={0}
          // 일단 스냅 포인트는 300, 550으로 설정
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
                내 주변 전달
              </Text>
            </View>
          </BottomSheetView>
          <BottomSheetScrollView
            contentContainerStyle={{
              gap: 20,
            }}>
            {articles.map((article, index) => (
              <ArticleBottomView
                key={index}
                article={article}
                onPress={() => {
                  navigation.navigate('DeliveryDetail', {id: article.id});
                }}
              />
            ))}
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
  inputBox: {
    flex: 1,
    height: 44,
    padding: 14,
    // boxShadow: '0 3 16px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  input: {
    fontSize: 16,
  },
  ring: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    // boxShadow: '0 3 11px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gps: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    // boxShadow: '0 3 11px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});

export default AroundMainScreen;
