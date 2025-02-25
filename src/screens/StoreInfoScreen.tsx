import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  LeftArrowIcon,
  MiniPhoneIcon,
  MiniStarIcon,
  MiniWatchIcon,
} from '../components/Icons';
import {NaverMap} from '../components/NaverMap';
import {Review, Store} from '../types/get';
import useReview from '../hooks/useReview';
import {SERVICE_CATEGORY_MAP} from '../enums';
import {useFocusEffect} from '@react-navigation/native';

const StoreInfoScreen = ({navigation, route}: any) => {
  const {
    store,
  }: {
    store: Store;
  } = route.params;

  if (!store) {
    return (
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}>
        <Text>해당 업체 정보가 없습니다.</Text>
        <Text>잠시 후 다시 시도해주세요.</Text>
      </View>
    );
  }

  const businessHours = store.business_hours.split('-');
  // 중복되지 않는 서비스 카테고리만 추출
  const uniqueServiceCategories = Array.from(
    new Set(store.services.map(service => service.service_category.code)),
  );

  const [reviewData, setReviewData] = useState<Review[]>([]);
  const [reviewContext, setReviewContext] = useState<{
    reviewCount: number;
    reviewAverage: number;
  }>({
    reviewCount: 0,
    reviewAverage: 0,
  });
  // 처음에는 아무것도 선택되지 않은 상태
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    store.services[0].service_category.code,
  );

  const {findReviewByStoreId} = useReview();

  const fetchReviewData = async () => {
    const reviewData = await findReviewByStoreId(store.id);
    if (reviewData) {
      setReviewData(reviewData);
      setReviewContext({
        reviewCount: reviewData.length,
        reviewAverage:
          reviewData.reduce((acc, cur) => acc + cur.score, 0) /
          reviewData.length,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviewData();
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
          <Text style={styles.headerText}>{store.name}</Text>
        </View>
        <View style={styles.container}>
          <View
            style={{
              height: 141,
              maxHeight: 141,
            }}>
            <NaverMap />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingTop: 24,
              paddingBottom: 24,
              paddingLeft: 20,
              paddingRight: 20,
              backgroundColor: '#FFFFFF',
            }}>
            <Text
              style={{
                color: '#181818',
                fontSize: 20,
                fontFamily: 'Pretendard-SemiBold',
              }}>
              {store.name}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
              <Pressable
                onPress={() => {
                  navigation.navigate('Review', {
                    storeId: store.id,
                  });
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <MiniStarIcon />
                <Text
                  style={{
                    color: '#394245',
                    fontSize: 14,
                    fontFamily: 'Pretendard-Medium',
                  }}>{`${
                  reviewContext.reviewAverage.toFixed(1) || '0.0'
                } (후기 ${reviewContext.reviewCount}개)`}</Text>
              </Pressable>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 4,
                }}>
                {uniqueServiceCategories.map((code: string, index: number) => (
                  <Text
                    key={index}
                    style={{
                      color: '#6E7881',
                      fontSize: 11,
                      fontFamily: 'Pretendard-Regular',
                      backgroundColor: '#F9FAFB',
                      paddingLeft: 8,
                      paddingRight: 8,
                      paddingTop: 4,
                      paddingBottom: 4,
                    }}>
                    {SERVICE_CATEGORY_MAP[code]}
                  </Text>
                ))}
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                marginTop: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                }}>
                <MiniWatchIcon />
                <Text
                  style={{
                    color: '#B1BAC0',
                    fontSize: 14,
                    fontFamily: 'Pretendard-Medium',
                  }}>
                  영업시간
                </Text>
              </View>
              <Text
                style={{
                  color: '#6E7881',
                  fontSize: 14,
                  fontFamily: 'Pretendard-Medium',
                }}>
                {`오전 ${businessHours[0]} - 오전 ${businessHours[1]}`}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                }}>
                <MiniPhoneIcon />
                <Text
                  style={{
                    color: '#B1BAC0',
                    fontSize: 14,
                    fontFamily: 'Pretendard-Medium',
                  }}>
                  전화번호
                </Text>
              </View>
              <Text
                style={{
                  color: '#6E7881',
                  fontSize: 14,
                  fontFamily: 'Pretendard-Medium',
                }}>
                {store.phone_number}
              </Text>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 14,
                  fontFamily: 'Pretendard-Medium',
                }}>
                {'전화하기 >'}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              backgroundColor: '#FFFFFF',
            }}>
            {/* 헤더영역 */}
            <View
              style={{
                height: 48,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: 20,
                paddingRight: 20,
              }}>
              {uniqueServiceCategories.map((code: string, index: number) => (
                <Pressable
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 4,
                    paddingBottom: 4,
                    position: 'relative',
                    height: 48,
                    width: 'auto',
                  }}
                  onPress={() => {
                    setSelectedCategory(code);
                  }}>
                  {selectedCategory === code && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 3,
                      }}>
                      <View
                        style={{
                          height: 3,
                          width: 38,
                          backgroundColor: '#1F1F1F',
                        }}></View>
                    </View>
                  )}
                  <Text
                    style={{
                      color: '#1F1F1F',
                      fontSize: 16,
                      fontFamily: 'Pretendard-SemiBold',
                    }}>
                    {SERVICE_CATEGORY_MAP[code]}
                  </Text>
                </Pressable>
              ))}
            </View>
            {/* 리스트 영역 */}
            <ScrollView
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 22,
                gap: 20,
              }}>
              {store.services.length === 0 && (
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text>등록된 서비스가 없습니다.</Text>
                </View>
              )}
              <View>
                {store.services
                  .filter(
                    service =>
                      service.service_category.code === selectedCategory,
                  )
                  .map((service, index: number) => (
                    <Pressable
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 7,
                        borderBottomWidth: 1,
                        borderBottomColor: '#F9FAFB',
                        paddingTop: 18,
                        paddingBottom: 18,
                      }}
                      onPress={() => {
                        navigation.navigate('OrderSheet', {
                          store,
                          service,
                        });
                      }}>
                      <Text
                        style={{
                          color: '#394245',
                          fontSize: 16,
                          fontFamily: 'Pretendard-SemiBold',
                        }}>
                        {service.name}
                      </Text>
                      <Text
                        style={{
                          color: '#6E7881',
                          fontSize: 14,
                          fontFamily: 'Pretendard-Regular',
                        }}>
                        {`100${
                          service.unit
                        }당 ${service.price.toLocaleString()}`}
                        원
                      </Text>
                    </Pressable>
                  ))}
              </View>
            </ScrollView>
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
    backgroundColor: '#F9FAFB',
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
});

export default StoreInfoScreen;
