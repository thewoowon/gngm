import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {PenIcon, RingIcon, GameIcon, ChatIcon} from '../components/Icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DELIVERY_TYPE} from '../constants';
import {useArticle, useMe} from '../hooks';
import {Article, Chat, User} from '../types/get';
import DeliveryView from '../components/DeliveryView/DeliveryView';
import ChatView from '../components/ChatView';
import {useFocusEffect} from '@react-navigation/native';

const DeliveryMainScreen = ({navigation, route}: any) => {
  // BottomSheet 애니메이션 값을 관리하는 shared value
  const bottomSheetTranslateY = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // 바텀 시트의 snap 포인트 정의
  const snapPoints = useMemo(() => [250], []);
  // 애니메이션 스타일 - 버튼의 위치
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: bottomSheetTranslateY.value}],
    };
  });

  const handleGoToChat = () => {
    navigation.navigate('Chat');
  };

  // 내가 생성한 전달 목록
  const [deliveries, setDeliveries] = useState<Article[]>([]);
  // 내가 요청한 전달 목록
  const [requests, setRequests] = useState<Article[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [tab, setTab] = useState<'delivery' | 'chat'>('delivery');

  const [user, setUser] = useState<User>({
    id: 0,
    name: '',
    nickname: '',
    email: '',
    phone_number: '',
    address: '',
    src: '',
    is_auto_login: 0,
    is_job_open: 0,
    job: null,
    job_description: null,
    accident_date: null,
  });

  const {getMe} = useMe();

  const {findAllArticlesWithMessages, findRequestArticlesWithMessages} =
    useArticle();

  // 내가 생성한 전달 목록 조회
  const fetchDeliveries = async () => {
    try {
      const data = await findAllArticlesWithMessages();
      setDeliveries(data);
    } catch (error) {
      console.error('전달 목록 조회 오류:', error);
    }
  };

  // 내가 요청한 전달 목록 조회
  const fetchRequests = async () => {
    try {
      const data = await findRequestArticlesWithMessages();
      setRequests(data);
    } catch (error) {
      console.error('요청 목록 조회 오류:', error);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      const data = await getMe();
      if (data) {
        setUser(data);
      }
    };
    fetchMe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      bottomSheetRef.current?.close();
      fetchDeliveries();
      fetchRequests();
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
          <Text
            style={{
              color: '#C7CDD1',
              fontSize: 20,
              fontFamily: 'Pretendard-ExtraBold',
            }}>
            전달
          </Text>
          <Pressable
            style={styles.ring}
            onPress={() => {
              navigation.navigate('Notification');
            }}>
            <RingIcon />
          </Pressable>
        </View>
        <View style={styles.tabStyle}>
          <Pressable
            style={styles.tabTitle}
            onPress={() => {
              setTab('delivery');
            }}>
            <GameIcon color={tab === 'delivery' ? '#364348' : '#B1BAC0'} />
            <Text
              style={[
                styles.tabFont,
                {
                  color: tab === 'delivery' ? '#394245' : '#D8DCDF',
                },
              ]}>
              진행 중인 전달
            </Text>
          </Pressable>
          <View style={styles.bar} />
          <Pressable
            style={styles.tabTitle}
            onPress={() => {
              setTab('chat');
            }}>
            <ChatIcon color={tab === 'chat' ? '#364348' : '#B1BAC0'} />
            <Text
              style={[
                styles.tabFont,
                {
                  color: tab === 'chat' ? '#394245' : '#D8DCDF',
                },
              ]}>
              모든 채팅
            </Text>
          </Pressable>
        </View>
        {deliveries.length === 0 && requests.length === 0 ? (
          <View style={styles.voidContainer}>
            <Text style={styles.noneText}>진행 중인 전달이 없습니다</Text>
          </View>
        ) : (
          <ScrollView style={styles.orderList}>
            {tab === 'delivery' && (
              <DeliveryView
                articles={deliveries}
                requests={requests}
                user={user}
              />
            )}
            {tab === 'chat' && <ChatView chats={chats} />}
          </ScrollView>
        )}
        {/* 하단 버튼 */}
        <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
          <Pressable
            style={({pressed}) => [
              styles.pen,
              // 좀 더 진한 색으로 변경
              {backgroundColor: pressed ? '#1CCBAE' : '#1CD7AE'},
            ]}
            onPress={
              () => bottomSheetRef.current?.snapToIndex(0) // GPS 버튼을 누르면 BottomSheet 확장
            } // GPS 버튼을 누르면 BottomSheet 확장
          >
            <PenIcon />
          </Pressable>
        </Animated.View>
        <BottomSheet
          ref={bottomSheetRef}
          // BottomSheet는 처음에 펼쳐진 상태로 시작
          index={-1}
          // 일단 스냅 포인트는 300, 550으로 설정
          handleStyle={{display: 'none'}}
          containerStyle={{
            zIndex: 3,
          }}
          // dim 처리
          snapPoints={snapPoints}
          enablePanDownToClose
          enableDynamicSizing={false}
          onAnimate={(fromIndex, toIndex) => {
            if (toIndex === 0) {
              setCurrentIndex(0);
              bottomSheetTranslateY.value = 0;
            } else {
              setCurrentIndex(-1);
              bottomSheetTranslateY.value = 0;
            }
          }}>
          <BottomSheetView>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 17,
              }}>
              <View
                style={{
                  width: '100%',
                  paddingBottom: 16,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#F2F4F6',
                }}>
                <Text
                  style={{
                    color: '#B1BAC0',
                    fontSize: 14,
                    fontFamily: 'Pretendard-SemiBold',
                  }}>
                  어떤 글을 쓰시겠어요?
                </Text>
              </View>
              {DELIVERY_TYPE.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    width: '100%',
                    paddingTop: 16,
                    paddingBottom: 16,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#F2F4F6',
                  }}
                  onPress={() => {
                    navigation.navigate('DeliveryCreate', {
                      deliveryType: item.value,
                    });
                  }}>
                  <Text
                    style={{
                      color: '#181818',
                      fontSize: 16,
                      fontFamily: 'Pretendard-Regular',
                    }}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </BottomSheetView>
        </BottomSheet>
        {/* dim 처리 */}
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 2,
            // bottomSheetRef가 열리면 dim 처리
            display: currentIndex === 0 ? 'flex' : 'none',
          }}
          onTouchStart={() => {
            bottomSheetRef.current?.close();
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F9',
  },
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 13,
    paddingBottom: 13,
    maxHeight: 50,
  },
  backgroundStyle: {
    flex: 1,
  },
  orderList: {
    flex: 1,
    paddingTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  inputBox: {
    flex: 1,
    height: 44,
    padding: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 100,
    backgroundColor: '#F2F4F6',
  },
  input: {
    fontSize: 16,
  },
  ring: {
    width: 44,
    height: 44,
    padding: 10,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pen: {
    width: 56,
    height: 56,
    backgroundColor: '#1CD7AE',
    padding: 10,
    borderRadius: 50,
    // boxShadow: '0 3 11px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  buttonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  tabStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 16,
  },
  tabTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabFont: {
    color: '##394245',
    fontSize: 16,
    fontFamily: 'NanumSquareNeoOTF-Eb',
    fontWeight: 800,
    lineHeight: 24,
    letterSpacing: -0.02,
  },
  bar: {
    width: 1,
    height: 18,
    backgroundColor: '#C7CDD1',
  },
  voidContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noneText: {
    fontSize: 20,
    color: '#C7CDD1',
    fontFamily: 'Prentendard-SemiBold',
    fontWeight: 600,
  },
});

export default DeliveryMainScreen;
