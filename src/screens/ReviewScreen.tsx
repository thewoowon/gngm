import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LeftArrowIcon} from '../components/Icons';
import {Review} from '../types/get';
import {useFocusEffect} from '@react-navigation/native';
import useReview from '../hooks/useReview';

const ReviewScreen = ({navigation, route}: any) => {
  const {
    storeId,
  }: {
    storeId: number;
  } = route.params;
  const [reviewData, setReviewData] = useState<Review[]>([]);
  const [reviewContext, setReviewContext] = useState<{
    reviewCount: number;
    reviewAverage: number;
  }>({
    reviewCount: 0,
    reviewAverage: 0,
  });
  const {findReviewByStoreId} = useReview();

  const fetchReviewData = async () => {
    const reviewData = await findReviewByStoreId(storeId);
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

  useEffect(() => {
    fetchReviewData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReviewData();
    }, []),
  );

  return (
    <GestureHandlerRootView style={styles.container}>
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
          <Text style={styles.headerText}>리뷰</Text>
        </View>
        {reviewData.length > 0 && (
          <ScrollView
            style={{
              flex: 1,
            }}>
            {reviewData.map(review => {
              return (
                <View key={review.id} style={styles.notificationItem}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}>
                      <Text
                        style={{
                          color: '#394245',
                          fontSize: 16,
                          fontFamily: 'Pretendard-SemiBold',
                        }}>
                        {review.title}
                      </Text>
                      <Text
                        style={{
                          color: '#6E7881',
                          fontSize: 14,
                          fontFamily: 'Pretendard-Regular',
                        }}>
                        {review.score}점
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: '#6E7881',
                        fontSize: 14,
                        fontFamily: 'Pretendard-Regular',
                      }}>
                      {review.contents}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
        {reviewData.length === 0 && (
          <View style={styles.none}>
            <Text style={styles.noneText}>아무것도 없어요</Text>
          </View>
        )}
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
    color: '#1F1F1F',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  notificationItem: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },
  notificationCircle: {
    width: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: '#E6EAED',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  none: {
    flex: 1,
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

export default ReviewScreen;
