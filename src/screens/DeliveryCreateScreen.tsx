import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  MarkerIcon,
  CalendarIcon,
  LeftArrowIcon,
  RightChevronIcon,
  MiniUpChevronIcon,
  MiniDownChevronIcon,
  XIcon,
} from '../components/Icons';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {
  AMPM,
  PICKUP_TIME_LIST,
  POSSIBLE_DELIVERY_DESTINATION,
} from '../constants';
import {useArticle} from '../hooks';
import {CustomCalendar, PeriodCalendar} from '../components/CustomCalendar';
import {ArticleType, Place} from '../types/get';

const DeliveryCreateScreen = ({navigation, route}: any) => {
  const {
    deliveryType,
    place,
  }: {
    deliveryType: ArticleType;
    place?: Place | null | undefined;
  } = route.params;

  const [form, setForm] = useState<{
    title: string;
    contents: string;
    destination: string;
    departureDate: string;
    location: string;
    startDate: string;
    endDate: string;
    ampm: string;
    time: string;
    latitude1: string; // destination 위도
    longitude1: string; // destination 경도
    latitude2: string; // location 위도
    longitude2: string; // location 경도
  }>({
    title: '', // 제목
    contents: '', // 내용
    destination: '', // 전달해드려요 -> 전달 가능한 목적지, 전달해주세요 -> 전달 목적지
    departureDate: '', // 전달해드려요 -> 예상 출발날짜, 전달해주세요 -> 전달 마감날짜
    location: '', // 전달해드려요 -> 수령 희망장소, 전달해주세요 -> 전달 희망장소
    startDate: '', // 전달해드려요 -> 수령 희망기간, 전달해주세요 -> 전달 희망기간
    endDate: '', // 전달해드려요 -> 수령 희망기간, 전달해주세요 -> 전달 희망기간
    ampm: '', // 전달해드려요 -> 수령 희망시간대, 전달해주세요 -> 전달 희망시간대
    time: '',
    latitude1: '',
    longitude1: '',
    latitude2: '',
    longitude2: '',
  });

  // BottomSheet 애니메이션 값을 관리하는 shared value
  const bottomSheetTranslateY = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // 바텀 시트의 snap 포인트 정의
  const snapPoints = useMemo(() => [560], []);

  const {createArticle} = useArticle();

  const [selectedTab, setSelectedTab] = useState('Tab1');

  const [locationToggle, setLocationToggle] = useState(false);

  const [departureDate, setDepartureDate] = useState('');

  const [pStartDate, setPStartDate] = useState('');
  const [pEndDate, setPEndDate] = useState('');

  const renderContent = (deliveryType: ArticleType) => {
    const context: {
      [key in ArticleType]: any;
    } = {
      deliverItTo: {
        title1: '언제 어디로 가는김에 전달하실건가요?',
        title2: '전달 요청자와 언제, 어디서 만날 수 있나요?',
        title3: '추가적으로 설명을 작성해주세요',
        subtitle1: '전달 가능한 목적지와 예상 출발날짜를 선택해주세요',
        subtitle2: '작업물 수령 가능한 장소와 기간, 시간대를 선택해주세요',
        subtitle3: '제목과 내용을 자유롭게 작성해주세요',
        firstStepComponent1: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
            <Text style={styles.labelText}>전달 가능한 목적지</Text>
            <View
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 8,
              }}>
              {POSSIBLE_DELIVERY_DESTINATION.slice(
                0,
                locationToggle ? POSSIBLE_DELIVERY_DESTINATION.length : 7,
              ).map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    ...styles.selectButton,
                    backgroundColor:
                      form.destination === item.value ? '#1CD7AE' : '#F9FAFB',
                    borderColor:
                      form.destination === item.value ? '#1CD7AE' : '#E6EAED',
                  }}
                  onPress={() => {
                    setForm({
                      ...form,
                      destination: item.value,
                    });
                  }}>
                  <Text
                    style={[
                      styles.selectButtonText,
                      {
                        color:
                          form.destination === item.value
                            ? '#FFFFFF'
                            : '#1B1B1B',
                        fontFamily:
                          form.destination === item.value
                            ? 'Pretendard-Medium'
                            : 'Pretendard-Regular',
                      },
                    ]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.selectButton}
                onPress={() => {
                  setLocationToggle(!locationToggle);
                }}>
                <Text style={styles.selectButtonText}>
                  {locationToggle ? '접기' : '그 외'}
                </Text>
                {locationToggle ? (
                  <MiniUpChevronIcon />
                ) : (
                  <MiniDownChevronIcon />
                )}
              </Pressable>
            </View>
          </View>
        ),
        firstStepComponent2: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
            <Text style={styles.labelText}>예상 출발날짜</Text>
            <Pressable
              style={styles.inputBox}
              onPress={() => {
                bottomSheetRef.current?.expand();
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 6,
                  alignItems: 'center',
                }}>
                <CalendarIcon />
                <Text style={styles.inputBoxText}>
                  {form.departureDate !== ''
                    ? form.departureDate.replaceAll('-', ' / ')
                    : '날짜 선택'}
                </Text>
              </View>
              <RightChevronIcon />
            </Pressable>
          </View>
        ),
        secondStepLabel: '수령',
      },
      passItOn: {
        title1: '언제까지 어디로 전달을 해야하나요?',
        title2: '전달 지원자와 언제, 어디서 만날 수 있나요?',
        title3: '추가적으로 설명을 작성해주세요',
        subtitle1: '전달 목적지와 전달 마감날짜를 선택해주세요',
        subtitle2: '작업물 전달 가능한 장소와 기간, 시간대를 선택해주세요',
        subtitle3: '제목과 내용을 자유롭게 작성해주세요',
        firstStepComponent1: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
            <Text style={styles.labelText}>전달 목적지</Text>
            <Pressable
              style={styles.inputBox}
              onPress={() => {
                navigation.navigate('DeliveryLocation', {
                  deliveryType: deliveryType,
                });
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 6,
                  alignItems: 'center',
                }}>
                <MarkerIcon />
                <Text style={styles.inputBoxText}>
                  {form.destination ? form.destination : '위치 선택'}
                </Text>
              </View>
              <RightChevronIcon />
            </Pressable>
          </View>
        ),
        firstStepComponent2: (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
            <Text style={styles.labelText}>전달 마감날짜</Text>
            <Pressable
              style={styles.inputBox}
              onPress={() => {
                bottomSheetRef.current?.expand();
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 6,
                  alignItems: 'center',
                }}>
                <CalendarIcon />
                <Text style={styles.inputBoxText}>
                  {form.departureDate !== ''
                    ? form.departureDate.replaceAll('-', ' / ')
                    : '날짜 선택'}
                </Text>
              </View>
              <RightChevronIcon />
            </Pressable>
          </View>
        ),
        secondStepLabel: '전달',
      },
      recruitment: {},
    };

    switch (selectedTab) {
      case 'Tab1':
        return (
          <View>
            <Text style={styles.titleText}>{context[deliveryType].title1}</Text>
            <Text style={styles.subtitleText}>
              {context[deliveryType].subtitle1}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
                paddingTop: 40,
              }}>
              {context[deliveryType].firstStepComponent1}
              {context[deliveryType].firstStepComponent2}
            </View>
          </View>
        );
      case 'Tab2':
        return (
          <View>
            <Text style={styles.titleText}>{context[deliveryType].title2}</Text>
            <Text style={styles.subtitleText}>
              {context[deliveryType].subtitle2}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
                paddingTop: 40,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                <Text
                  style={
                    styles.labelText
                  }>{`${context[deliveryType].secondStepLabel} 희망장소`}</Text>
                <Pressable
                  style={styles.inputBox}
                  onPress={() => {
                    navigation.navigate('DeliveryLocation', {
                      deliveryType: deliveryType,
                    });
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 6,
                      alignItems: 'center',
                    }}>
                    <MarkerIcon />
                    <Text style={styles.inputBoxText}>
                      {form.location ? form.location : '위치 선택'}
                    </Text>
                  </View>
                  <RightChevronIcon />
                </Pressable>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                <Text
                  style={
                    styles.labelText
                  }>{`${context[deliveryType].secondStepLabel} 희망기간`}</Text>
                <Pressable
                  style={styles.inputBox}
                  onPress={() => {
                    bottomSheetRef.current?.expand();
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 6,
                      alignItems: 'center',
                    }}>
                    <CalendarIcon />
                    <Text style={styles.inputBoxText}>
                      {form.startDate !== '' && form.endDate !== ''
                        ? `${form.startDate.replaceAll(
                            '-',
                            ' / ',
                          )} ~ ${form.endDate.replaceAll('-', ' / ')}`
                        : '날짜 선택'}
                    </Text>
                  </View>
                  <RightChevronIcon />
                </Pressable>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                <Text
                  style={
                    styles.labelText
                  }>{`${context[deliveryType].secondStepLabel} 희망시간대`}</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 12,
                  }}>
                  {AMPM.map((item, index) => {
                    return (
                      <Pressable
                        key={item.value + index}
                        style={[
                          styles.flexPressable,
                          {
                            backgroundColor:
                              form.ampm === item.value ? '#1CD7AE' : '#F9FAFB',
                            borderColor:
                              form.ampm === item.value ? '#1CD7AE' : '#E6EAED',
                          },
                        ]}
                        onPress={() => {
                          setForm({
                            ...form,
                            ampm: item.value,
                          });
                        }}>
                        <Text
                          style={[
                            styles.flexPressableText,
                            {
                              color:
                                form.ampm === item.value
                                  ? '#FFFFFF'
                                  : '#8E979E',
                            },
                          ]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                  }}>
                  {PICKUP_TIME_LIST.map((item, index) => {
                    return (
                      <Pressable
                        key={item.value + index}
                        style={[
                          styles.flexRoundPressable,
                          {
                            backgroundColor:
                              form.time === item.value ? '#1CD7AE' : '#F9FAFB',
                            borderColor:
                              form.time === item.value ? '#1CD7AE' : '#E6EAED',
                          },
                        ]}
                        onPress={() => {
                          setForm({
                            ...form,
                            time: item.value,
                          });
                        }}>
                        <Text
                          style={[
                            styles.flexPressableText,
                            {
                              color:
                                form.time === item.value
                                  ? '#FFFFFF'
                                  : '#8E979E',
                            },
                          ]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        );
      case 'Tab3':
        return (
          <View>
            <Text style={styles.titleText}>{context[deliveryType].title3}</Text>
            <Text style={styles.subtitleText}>
              {context[deliveryType].subtitle3}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
                paddingTop: 40,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                <Text style={styles.labelText}>제목</Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="게시글의 제목을 입력해주세요"
                  onChangeText={text => {
                    setForm({
                      ...form,
                      title: text,
                    });
                  }}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                <Text style={styles.labelText}>내용</Text>
                <TextInput
                  style={styles.contentsInput}
                  placeholder="게시글 내용을 작성해주세요 (ex. 추가적으로 전달하고싶은 내용, 자세히 설명하고싶은 내용, 주의할 점 등)"
                  multiline={true}
                  numberOfLines={10} // 보여질 줄 수 (줄이 넘어가면 스크롤 가능)
                  onChangeText={text => {
                    setForm({
                      ...form,
                      contents: text,
                    });
                  }}
                />
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // 생성 핸들러
  const buttonHandler = async () => {
    if (selectedTab === 'Tab3') {
      const result = await createArticle({
        title: form.title,
        contents: form.contents,
        articleType: deliveryType,
        pickUpLocation: form.location,
        pickUpDate: `${form.startDate}~${form.endDate}`,
        pickUpTime: `${form.ampm} ${form.time}`,
        destination: form.destination,
        departureDate: form.departureDate,
        numberOfRecruits: 1,
        processStatus: 'beforePickUp',
        latitude1: form.latitude1,
        longitude1: form.longitude1,
        latitude2: form.latitude2,
        longitude2: form.longitude2,
      });
      navigation.navigate('DeliveryDetail', {
        id: result.article_id,
      });
    } else if (selectedTab === 'Tab1') {
      setSelectedTab('Tab2');
    } else {
      setSelectedTab('Tab3');
    }
  };

  const prevHandler = () => {
    if (selectedTab === 'Tab3') {
      setSelectedTab('Tab2');
    } else if (selectedTab === 'Tab2') {
      setSelectedTab('Tab1');
    }
  };

  const discreteDisabled = () => {
    if (selectedTab === 'Tab1') {
      return !form.destination || !form.departureDate;
    } else if (selectedTab === 'Tab2') {
      return !form.location || !form.startDate || !form.endDate || !form.time;
    } else {
      return !form.title || !form.contents;
    }
  };

  const confirmHandler = () => {
    if (selectedTab === 'Tab1') {
      setForm({
        ...form,
        departureDate,
      });
    } else {
      // Tab2인 경우
      setForm({
        ...form,
        startDate: pStartDate,
        endDate: pEndDate,
      });
    }
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    if (place) {
      if (selectedTab === 'Tab1') {
        setForm({
          ...form,
          destination: place.address,
          latitude1: place.mapy.slice(0, 2) + '.' + place.mapy.slice(2),
          longitude1: place.mapx.slice(0, 3) + '.' + place.mapx.slice(3),
        });
      } else {
        setForm({
          ...form,
          location: place.address,
          latitude2: place.mapy.slice(0, 2) + '.' + place.mapy.slice(2),
          longitude2: place.mapx.slice(0, 3) + '.' + place.mapx.slice(3),
        });
      }
    }
  }, [place]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.header}>
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
          <Text style={styles.headerText}>{'게시글 작성하기'}</Text>
        </View>
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, selectedTab === 'Tab1' && styles.activeTab]}
            onPress={() => setSelectedTab('Tab1')}
          />
          <Pressable
            style={[styles.tab, selectedTab === 'Tab2' && styles.activeTab]}
            onPress={() => setSelectedTab('Tab2')}
          />
          <Pressable
            style={[styles.tab, selectedTab === 'Tab3' && styles.activeTab]}
            onPress={() => setSelectedTab('Tab3')}
          />
        </View>
        <View style={styles.content}>{renderContent(deliveryType)}</View>
        <View style={styles.buttonContainer}>
          {selectedTab !== 'Tab1' && (
            <Pressable
              onPress={prevHandler}
              style={({pressed}) => [
                {
                  width: 112,
                  padding: 16,
                  borderRadius: 6,
                  backgroundColor: '#EDFCF9',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 48,
                },
                {backgroundColor: pressed ? '#E9FAF7' : '#EDFCF9'},
              ]}>
              <Text
                style={{
                  color: '#1CD7AE',
                  fontSize: 16,
                  fontFamily: 'Pretendard-Medium',
                }}>
                이전
              </Text>
            </Pressable>
          )}
          <Pressable
            disabled={discreteDisabled()}
            onPress={buttonHandler}
            style={({pressed}) => [
              {
                flex: 1.5,
                padding: 16,
                borderRadius: 6,
                backgroundColor: '#1CD7AE',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 48,
              },
              {
                backgroundColor: discreteDisabled()
                  ? '#E6EAED'
                  : pressed
                  ? '#0BBDA1'
                  : '#1CD7AE',
              },
            ]}>
            <Text
              style={{
                color: discreteDisabled() ? '#B1BAC0' : '#FFFFFF',
                fontSize: 16,
                fontFamily: 'Pretendard-SemiBold',
              }}>
              {selectedTab === 'Tab3' ? '완료' : '다음'}
            </Text>
          </Pressable>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          // BottomSheet는 처음에 펼쳐진 상태로 시작
          index={-1}
          // 일단 스냅 포인트는 300, 550으로 설정
          handleIndicatorStyle={{
            display: 'none',
          }}
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
            ``;
          }}>
          <BottomSheetView
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 6,
              paddingBottom: 20,
            }}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Pretendard-SemiBold',
                  color: '#1B1B1B',
                  lineHeight: 24,
                }}>
                {selectedTab === 'Tab1' ? '날짜 선택' : '기간 선택'}
              </Text>
              <Pressable
                onPress={() => {
                  bottomSheetRef.current?.close();
                }}>
                <XIcon />
              </Pressable>
            </View>
            {selectedTab === 'Tab2' && (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 16,
                }}>
                <TextInput
                  readOnly
                  style={styles.baseInput}
                  value={pStartDate.replaceAll('-', ' / ')}
                />
                <TextInput
                  readOnly
                  style={styles.baseInput}
                  value={pEndDate.replaceAll('-', ' / ')}
                />
              </View>
            )}
            <View
              style={{
                flex: 1,
                width: '100%',
                height: 380,
              }}>
              {selectedTab === 'Tab1' && (
                <CustomCalendar
                  startDate={departureDate}
                  setStartDate={setDepartureDate}
                />
              )}
              {selectedTab === 'Tab2' && (
                <PeriodCalendar
                  startDate={pStartDate}
                  endDate={pEndDate}
                  setStartDate={setPStartDate}
                  setEndDate={setPEndDate}
                />
              )}
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 16,
              }}>
              {selectedTab === 'Tab1' && (
                <TextInput
                  readOnly
                  style={styles.baseInput}
                  value={departureDate.replaceAll('-', ' / ')}
                />
              )}
              <Pressable
                onPress={confirmHandler}
                style={({pressed}) => [
                  styles.baseButton,
                  {backgroundColor: pressed ? '#0BBDA1' : '#1CD7AE'},
                ]}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontFamily: 'Pretendard-SemiBold',
                  }}>
                  확인
                </Text>
              </Pressable>
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
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundStyle: {
    flex: 1,
  },
  orderList: {
    flex: 1,
    paddingTop: 26,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
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
    borderColor: '#E6EAED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#1CD7AE',
  },
  radioText: {
    marginLeft: 10,
  },
  picker: {
    width: '100%',
  },
  inputBox: {
    height: 48,
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E6EAED',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  inputBoxText: {
    flex: 1,
    color: '#1B1B1B',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
    maxWidth: '85%',
    overflow: 'scroll',
  },
  selectButton: {
    width: 81.5,
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E6EAED',
    backgroundColor: '#F9FAFB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  selectButtonText: {
    color: '#1B1B1B',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: '#192628',
  },
  content: {
    flex: 1,
    paddingTop: 32,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  buttonContainer: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 28,
    // -1.5%의 letter spacing
    letterSpacing: -0.015,
  },
  subtitleText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#8E979E',
    lineHeight: 19,
    letterSpacing: -0.01,
    marginTop: 4,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#1B1B1B',
    lineHeight: 22,
  },
  titleInput: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E6EAED',
    borderRadius: 8,
    padding: 12,
  },
  contentsInput: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E6EAED',
    borderRadius: 8,
    padding: 12,
    height: 192,
  },
  flexPressable: {
    height: 40,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E6EAED',
    backgroundColor: '#F9FAFB',
  },
  flexRoundPressable: {
    height: 32,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E6EAED',
    backgroundColor: '#F9FAFB',
  },
  flexPressableText: {
    color: '#8E979E',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Medium',
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  baseInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E6EAED',
    borderRadius: 8,
    padding: 12,
    height: 48,
    fontSize: 16,
    color: '#1B1B1B',
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },
  baseButton: {
    flex: 1,
    padding: 16,
    borderRadius: 6,
    backgroundColor: '#1CD7AE',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
});

export default DeliveryCreateScreen;
