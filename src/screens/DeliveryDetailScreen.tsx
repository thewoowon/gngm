import React, {useMemo, useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {LeftArrowIcon, ProfileIcon, ThreeDotIcon} from '../components/Icons';
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Animated, {useSharedValue} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import {WEEK_NAME} from '../constants';
import {useArticle, useDelivery, useMe} from '../hooks';
import {Article, Order, User} from '../types/get';
import {AMPM_MAP, POSSIBLE_DELIVERY_DESTINATION_MAP} from '../enums';
import ArticleDetailModal from '../components/ArticleDetailModal';
import {
  isSameWeek,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  format,
} from 'date-fns';
import useOrder from '../hooks/useOrder';

const articleTypeLabelMap = {
  passItOn: [
    '전달 가능한 목적지',
    '예상 출발 날짜',
    '수령 희망 장소',
    '수령 희망 기간',
    '수령 희망 시간대',
  ],
  deliverItTo: [
    '전달 목적지',
    '전달 마감날짜',
    '전달 희망 장소',
    '전달 희망 기간',
    '전달 희망 시간대',
  ],
  recruitment: [
    '전달 가능한 목적지',
    '예상 출발 날짜',
    '수령 희망 장소',
    '수령 희망 기간',
    '수령 희망 시간대',
  ],
};

const DeliveryDetailScreen = ({navigation, route}: any) => {
  const {
    id,
  }: {
    id: number;
  } = route.params;

  const {findOneArticle, findRequestArticles} = useArticle();
  const {createDelivery} = useDelivery();
  const {findMyOrder} = useOrder();

  const {getMe} = useMe();

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

  const [orders, setOrders] = useState<Order[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [requests, setRequests] = useState<Article[]>([]);
  const [articleInfo, setArticleInfo] = useState<string[]>(Array(5).fill(''));
  const [dateContext, setDateContext] = useState<
    {
      day: number;
      disabled: boolean;
      date: Date;
      isToday?: boolean;
      fullText: string;
    }[][]
  >([]);
  const [timeContext, setTimeContext] = useState<
    {
      label: string;
      ampm: string;
      time: string;
    }[]
  >([]);
  // 전달 시청할 거래 선택
  const [form, setForm] = useState<{
    orderId: number | null | undefined;
    dateContext: {
      day: number;
      disabled: boolean;
      date: Date;
      isToday?: boolean;
      fullText: string;
    };
    timeContext: {
      label: string;
      ampm: string;
      time: string;
    };
    articleId: number;
  }>({
    orderId: null,
    dateContext: {
      day: 0,
      disabled: false,
      date: new Date(),
      isToday: false,
      fullText: '',
    },
    timeContext: {
      label: '',
      ampm: '',
      time: '',
    },
    articleId: id,
  });
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  const bottomSheetTranslateY = useSharedValue(0);

  const bottomSheetRef1 = useRef<BottomSheet>(null);
  const bottomSheetRef2 = useRef<BottomSheet>(null);

  const snapPoints1 = useMemo(() => [300], []);
  const snapPoints2 = useMemo(() => [500], []);

  const showToast = () => {
    Toast.show({
      position: 'bottom',
      type: 'custom_type',
      text1:
        '전달신청이 완료되었습니다. 시간조율이 필요하다면 채팅으로 전달자와 약속시간을 정해주세요',
    });
  };

  const handleGoToChat = () => {
    navigation.navigate('Chat');
  };

  const handleRequestDelivery = async () => {
    await fetchMyOrders();
    bottomSheetRef1.current?.snapToIndex(0);
  };

  const fromCreateToNow = (date: string | undefined | null) => {
    if (!date) {
      return 0;
    }
    const from = new Date(date);
    const now = new Date();
    const diff = now.getTime() - from.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // 이번 주와 다음 주의 날짜 계산
  const getWeeksRange = (startDate: Date, endDate: Date) => {
    const weekStartsOn = 0; // 월요일 시작 기준

    // 같은 주차인지 확인
    const sameWeek = isSameWeek(startDate, endDate, {weekStartsOn});

    if (sameWeek) {
      // 같은 주차인 경우: 해당 주차의 시작일자와 종료일자 반환
      const weekStart = startOfWeek(startDate, {weekStartsOn});
      const weekEnd = endOfWeek(startDate, {weekStartsOn});

      return [
        {
          weekStart: format(weekStart, 'yyyy-MM-dd'),
          weekEnd: format(weekEnd, 'yyyy-MM-dd'),
        },
      ];
    } else {
      // 다른 주차인 경우: 포함된 모든 주차의 시작일자와 종료일자 반환
      const weeks = eachWeekOfInterval(
        {start: startDate, end: endDate},
        {weekStartsOn},
      );

      return weeks.map(weekStart => {
        const weekEnd = endOfWeek(weekStart, {weekStartsOn});

        return {
          weekStart: format(weekStart, 'yyyy-MM-dd'),
          weekEnd: format(weekEnd, 'yyyy-MM-dd'),
        };
      });
    }
  };

  const fetchDeliveryDetail = async () => {
    const article = (await findOneArticle(id)) as Article;

    // 희망 수령 기간에 따라 날짜 선택 가능 기간 설정
    const dateContext = article.pick_up_date.split('~');
    const startDate = new Date(dateContext[0]);
    const endDate = new Date(dateContext[1]);

    const periodText = `${
      startDate.getMonth() + 1
    }월 ${startDate.getDate()}일 ~ ${
      endDate.getMonth() + 1
    }월 ${endDate.getDate()}일`;

    const articleTimeContext = article.pick_up_time.split(' ');
    const ampm = articleTimeContext[0];
    const time = articleTimeContext[1].split('-');

    setArticle(article);
    if (article.article_type === 'passItOn') {
      setArticleInfo([
        article.destination,
        periodText,
        article.pick_up_location,
        periodText,
        `${AMPM_MAP[ampm]} ${time[0]}시 ~ ${time[1]}시`,
      ]);
    } else {
      setArticleInfo([
        POSSIBLE_DELIVERY_DESTINATION_MAP[article.destination],
        periodText,
        article.pick_up_location,
        periodText,
        `${AMPM_MAP[ampm]} ${time[0]}시 ~ ${time[1]}시`,
      ]);
    }

    const result = getWeeksRange(startDate, endDate);
    const dateContextResult: {
      day: number;
      disabled: boolean;
      date: Date;
      isToday?: boolean;
      fullText: string;
    }[][] = [];
    result.forEach(week => {
      const weekStart = new Date(week.weekStart);
      const weekEnd = new Date(week.weekEnd);
      const weekContext: {
        day: number;
        disabled: boolean;
        date: Date;
        isToday?: boolean;
        fullText: string; // yyyy-MM-dd
      }[] = [];

      for (let i = weekStart; i <= weekEnd; i.setDate(i.getDate() + 1)) {
        weekContext.push({
          day: i.getDate(),
          // 오늘 이전 날짜는 선택 불가능 or startDate와 endDate 사이의 날짜만 선택 가능
          disabled: i < new Date() || i < startDate || i > endDate,
          date: new Date(i),
          isToday: i.toDateString() === new Date().toDateString(),
          fullText: format(i, 'yyyy-MM-dd'),
        });
      }

      dateContextResult.push(weekContext);
    });

    setDateContext(dateContextResult);

    const timeContextResult: {
      label: string;
      ampm: string;
      time: string;
    }[] = [];

    for (let i = Number(time[0]); i < Number(time[1]); i++) {
      timeContextResult.push({
        label: `${AMPM_MAP[ampm]} ${i}시`,
        ampm,
        time: `${i}`,
      });
    }
    setTimeContext(timeContextResult);
  };

  const fetchRequests = async () => {
    try {
      const data = await findRequestArticles();
      setRequests(data);
    } catch (error) {
      console.error('요청 목록 조회 오류:', error);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const data = await findMyOrder();
      if (!data) {
        setOrders([]);
      } else {
        setOrders(data);
      }
    } catch (error) {
      console.error('나의 주문 조회 오류:', error);
    }
  };

  const initStates = () => {
    setForm({
      ...form,
      orderId: null,
      dateContext: {
        day: 0,
        disabled: false,
        date: new Date(),
        isToday: false,
        fullText: '',
      },
      timeContext: {
        label: '',
        ampm: '',
        time: '',
      },
    });
  };

  const createDeliveryMutate = async () => {
    try {
      await createDelivery(form);
      showToast();
    } catch (error) {
      console.error('전달 신청 오류:', error);
    }
  };

  const handleCreateDelivery = async () => {
    await createDeliveryMutate();
    initStates();
    bottomSheetRef2.current?.close();
    showToast();
  };

  useEffect(() => {
    fetchDeliveryDetail();
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
                navigation.navigate('Around', {
                  screen: 'AroundMain',
                });
              }}>
              <LeftArrowIcon />
            </Pressable>
          </View>
          <Text style={styles.headerText}>{'게시글'}</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'absolute',
              right: 16,
            }}>
            <Pressable
              onPress={() => {
                setIsVisible(true);
              }}>
              <ThreeDotIcon />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            paddingTop: 12,
            paddingBottom: 24,
            paddingLeft: 20,
            paddingRight: 20,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
              paddingTop: 15,
              paddingBottom: 15,
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: 8,
              gap: 15,
            }}>
            <ProfileIcon />
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 5,
              }}>
              <Text
                style={{
                  color: '#6E7881',
                  fontSize: 16,
                  fontFamily: 'Pretendard-SemiBold',
                }}>
                {user.nickname}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 12,
                }}>
                {/* 무사고 여부 */}
                <Text
                  style={{
                    color: '#192628',
                    fontSize: 14,
                    fontFamily: 'Pretendard-Medium>',
                  }}>{`무사고 전달 ${fromCreateToNow(
                  user.accident_date,
                )}일차 ∙`}</Text>
                <Text
                  style={{
                    color: '#192628',
                    fontSize: 14,
                    fontFamily: 'Pretendard-Medium>',
                  }}>{`${requests.length}회 전달`}</Text>
              </View>
              <Text
                style={{
                  color: '#C7CDD1',
                  fontSize: 12,
                  fontFamily: 'Pretendard-SeimBold',
                }}>
                {user.job_description}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: {
                passItOn: '#F8E9FC',
                deliverItTo: '#E9F9FC',
                recruitment: '#F9F7D7',
              }[article?.article_type || 'passItOn'],
              paddingTop: 3,
              paddingBottom: 3,
              paddingLeft: 8,
              paddingRight: 8,
              borderRadius: 4,
              alignSelf: 'flex-start',
              marginTop: 26,
            }}>
            {
              {
                passItOn: (
                  <Text
                    style={{
                      color: '#D395D6',
                      fontSize: 12,
                      fontFamily: 'Pretendard-Medium',
                    }}>
                    전달해주세요
                  </Text>
                ),
                deliverItTo: (
                  <Text
                    style={{
                      color: '#3CBACD',
                      fontSize: 12,
                      fontFamily: 'Pretendard-Medium',
                    }}>
                    전달해드려요
                  </Text>
                ),
                recruitment: (
                  <Text
                    style={{
                      color: '#C9A92C',
                      fontSize: 12,
                      fontFamily: 'Pretendard-Medium',
                    }}>
                    팀 모집해요
                  </Text>
                ),
              }[article?.article_type || 'passItOn']
            }
          </View>
          <Text
            style={{
              color: '#181818',
              fontSize: 18,
              fontFamily: 'Pretendard-SemiBold',
              marginTop: 5,
            }}>
            {article?.title}
          </Text>
          <Text
            style={{
              color: '#1F1F1F',
              fontSize: 16,
              fontFamily: 'Pretendard-Regular',
              lineHeight: 24,
              marginTop: 15,
            }}>
            {article?.contents}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingTop: 20,
              gap: 2,
            }}>
            {articleTypeLabelMap[article?.article_type || 'passItOn'].map(
              (value, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }}>
                    <Text
                      style={{
                        color: '#1B1B1B',
                        fontSize: 14,
                        fontFamily: 'Pretendard-Medium',
                        lineHeight: 22,
                        width: 120,
                      }}>
                      {value}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: '#1B1B1B',
                        fontSize: 14,
                        fontFamily: 'Pretendard-Regular',
                        lineHeight: 22,
                      }}>
                      {articleInfo[index]}
                    </Text>
                  </View>
                );
              },
            )}
          </View>
        </View>
        {article?.user.id !== user.id && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 20,
              paddingRight: 20,
              gap: 7,
            }}>
            <Pressable
              disabled={article?.user_id === user.id}
              onPress={handleGoToChat}
              style={({pressed}) => [
                {
                  padding: 16,
                  borderRadius: 6,
                  backgroundColor: '#1CD7AE',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 112,
                },
                {
                  backgroundColor:
                    article?.user_id === user.id
                      ? '#C7CDD1'
                      : pressed
                      ? '#F6FAFD'
                      : '#EDFCF9',
                },
              ]}>
              <Text
                style={{
                  color: '#1CD7AE',
                  fontSize: 16,
                  fontFamily: 'Pretendard-SemiBold',
                }}>
                채팅하기
              </Text>
            </Pressable>
            <Pressable
              disabled={article?.user_id === user.id}
              onPress={handleRequestDelivery}
              style={({pressed}) => [
                {
                  padding: 16,
                  borderRadius: 6,
                  backgroundColor: '#1CD7AE',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                },
                {
                  backgroundColor:
                    article?.user_id === user.id
                      ? '#C7CDD1'
                      : pressed
                      ? '#0BBDA1'
                      : '#1CD7AE',
                },
              ]}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontFamily: 'Pretendard-SemiBold',
                }}>
                전달 신청하기
              </Text>
            </Pressable>
          </View>
        )}
        <BottomSheet
          ref={bottomSheetRef1}
          // BottomSheet는 처음에 펼쳐진 상태로 시작
          index={-1}
          // 일단 스냅 포인트는 300
          handleStyle={{display: 'none'}}
          containerStyle={{
            zIndex: 3,
          }}
          snapPoints={snapPoints1}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          enableHandlePanningGesture={false}
          enableOverDrag={false}
          enableContentPanningGesture={false}
          onAnimate={(fromIndex, toIndex) => {
            if (toIndex === 0) {
              setCurrentIndex(0);
              bottomSheetTranslateY.value = -snapPoints1[toIndex] + 10;
            } else {
              setCurrentIndex(-1);
              bottomSheetTranslateY.value = 0;
            }
          }}>
          <BottomSheetView
            style={{
              paddingTop: 26,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 34,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <Text
              style={{
                color: '#181818',
                fontSize: 20,
                lineHeight: 26,
                fontFamily: 'Pretendard-SemiBold',
                paddingBottom: 25,
              }}>
              전달 신청할 거래 고르기
            </Text>
            {orders.length === 0 && (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text
                  style={{
                    color: '#707070',
                    fontSize: 16,
                    fontFamily: 'Pretendard-Regular',
                  }}>
                  전달 신청할 거래가 없습니다.
                </Text>
              </View>
            )}
            <BottomSheetScrollView
              contentContainerStyle={{
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                gap: 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              {orders.map(order => (
                <View
                  key={order.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 11,
                  }}>
                  <Pressable
                    style={styles.radioContainer}
                    onPress={() => setForm({...form, orderId: order.id})}>
                    <View style={[styles.radioCircle]}>
                      {form.orderId === order.id && (
                        <View
                          style={{
                            height: 11,
                            width: 11,
                            borderRadius: 5,
                            backgroundColor: '#1CD7AE',
                          }}
                        />
                      )}
                    </View>
                  </Pressable>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 7,
                      }}>
                      <Text
                        style={{
                          color: '#181818',
                          fontSize: 16,
                          fontFamily: 'Pretendard-Regular',
                        }}>
                        {order.store.name}과(와)의 거래
                      </Text>
                      {/* <Text
                        style={{
                          color: '#707070',
                          fontSize: 12,
                          fontFamily: 'Pretendard-Regular',
                        }}>
                        {order.order_type === 'processing'
                          ? '진행중'
                          : '픽업 진행중'}
                      </Text> */}
                    </View>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('DealDetail', {
                          orderId: order.id,
                        });
                      }}>
                      <Text
                        style={{
                          color: '#002920',
                          fontSize: 12,
                          fontFamily: 'Pretendard-Medium',
                        }}>
                        거래 자세히 보기
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </BottomSheetScrollView>
            <Pressable
              onPress={() => {
                bottomSheetRef1.current?.close();
                bottomSheetRef2.current?.snapToIndex(0);
              }}
              style={({pressed}) => [
                {
                  height: 50,
                  padding: 16,
                  borderRadius: 6,
                  backgroundColor: '#1CD7AE',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 25,
                },
                {backgroundColor: pressed ? '#0BBDA1' : '#1CD7AE'},
              ]}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontFamily: 'Pretendard-SemiBold',
                }}>
                다음
              </Text>
            </Pressable>
          </BottomSheetView>
        </BottomSheet>
        <BottomSheet
          ref={bottomSheetRef2}
          // BottomSheet는 처음에 펼쳐진 상태로 시작
          index={-1}
          // 일단 스냅 포인트는 300, 550으로 설정
          handleStyle={{display: 'none'}}
          containerStyle={{
            zIndex: 3,
          }}
          snapPoints={snapPoints2}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          enableHandlePanningGesture={false}
          enableOverDrag={false}
          enableContentPanningGesture={false}
          onAnimate={(fromIndex, toIndex) => {
            if (toIndex === 0) {
              setCurrentIndex(0);
              bottomSheetTranslateY.value = -snapPoints2[toIndex] + 10;
            } else {
              setCurrentIndex(-1);
              bottomSheetTranslateY.value = 0;
            }
          }}>
          <BottomSheetView
            style={{
              paddingTop: 26,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 34,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}>
            <Text
              style={{
                color: '#181818',
                fontSize: 20,
                lineHeight: 26,
                fontFamily: 'Pretendard-SemiBold',
                paddingBottom: 20,
              }}>
              날짜/시간 선택
            </Text>
            <View style={styles.weekStyle}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 20,
                  margin: 'auto',
                }}>
                {WEEK_NAME.map((day, index) => (
                  <View
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 29,
                      height: 29,
                    }}>
                    <Text
                      style={{
                        color: '#B1BAC0',
                        fontSize: 12,
                        fontFamily: 'Pretendard-Regular',
                      }}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
              {dateContext.map((array, index1) => {
                return (
                  <View
                    key={index1}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 20,
                    }}>
                    {array.map((item, index2) => (
                      <Pressable
                        key={`${index1}-${index2}`}
                        style={[
                          styles.dayStyle,
                          {
                            backgroundColor:
                              form.dateContext.fullText === item.fullText
                                ? '#002920'
                                : item.isToday
                                ? '#F2F4F6'
                                : '#FFFFFF',
                          },
                        ]}
                        onPress={() => {
                          if (!item.disabled) {
                            setForm({
                              ...form,
                              dateContext: item,
                            });
                          }
                        }}>
                        <Text
                          style={{
                            color: item.disabled
                              ? '#C7CDD1'
                              : form.dateContext.fullText === item.fullText
                              ? '#FFFFFF'
                              : item.isToday
                              ? '#C7CDD1'
                              : '#1F1F1F',
                            fontSize: 14,
                            fontFamily: 'Pretendard-Regular',
                          }}>
                          {item.day}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                );
              })}
            </View>
            <View
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 18,
                paddingBottom: 18,
                borderWidth: 1,
                borderColor: '#E6EAED',
                borderRadius: 6,
                flex: 1,
              }}>
              <BottomSheetScrollView
                contentContainerStyle={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  height: 'auto',
                  gap: 20,
                }}>
                {timeContext.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 11,
                    }}>
                    <Pressable
                      style={styles.radioContainer}
                      onPress={() => {
                        setForm({
                          ...form,
                          timeContext: item,
                        });
                      }}>
                      <View style={[styles.radioCircle]}>
                        {form.timeContext.label === item.label && (
                          <View
                            style={{
                              height: 11,
                              width: 11,
                              borderRadius: 5,
                              backgroundColor: '#1CD7AE',
                            }}
                          />
                        )}
                      </View>
                    </Pressable>
                    <Text
                      style={{
                        color: '#181818',
                        fontSize: 16,
                        fontFamily: 'Pretendard-Regular',
                      }}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </BottomSheetScrollView>
            </View>
            <Pressable
              disabled={
                form.orderId === null ||
                form.dateContext.fullText === '' ||
                form.timeContext.label === ''
              }
              onPress={handleCreateDelivery}
              style={({pressed}) => [
                {
                  height: 50,
                  padding: 16,
                  borderRadius: 6,
                  backgroundColor: '#1CD7AE',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 25,
                },
                {
                  backgroundColor:
                    form.orderId === null ||
                    form.dateContext.fullText === '' ||
                    form.timeContext.label === ''
                      ? '#C7CDD1'
                      : pressed
                      ? '#0BBDA1'
                      : '#1CD7AE',
                },
              ]}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontFamily: 'Pretendard-SemiBold',
                }}>
                전달신청 완료
              </Text>
            </Pressable>
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
            initStates();
            bottomSheetRef1.current?.close();
            bottomSheetRef2.current?.close();
          }}
        />
        <ArticleDetailModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          isOwner={article?.user.id === user.id}
        />
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
  radioContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7CDD1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#1CD7AE',
  },
  radioText: {
    marginLeft: 10,
  },
  weekStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 25,
  },
  dayStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 29,
    height: 29,
    borderRadius: 50,
  },
});

export default DeliveryDetailScreen;
