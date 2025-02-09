import React from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import {Article} from '../../types/get';
import {AMPM_MAP, POSSIBLE_DELIVERY_DESTINATION_MAP} from '../../enums';
import {CalendarIcon, MarkerIcon, TimerIcon} from '../Icons';

type ArticleBottomViewProps = {
  article: Article;
  onPress: () => void;
};

const EX = {
  address: {
    address_string: '서울특별시 용산구 이태원동 228-6',
    latitude: '37.5403498',
    longitude: '126.9929404',
    postal_code: '12345',
  },
  article_type: 'deliverItTo',
  contents: '헬로 비전',
  departure_date: '2025-01-22',
  destination: 'seongdong',
  id: 3,
  number_of_recruits: 5,
  pick_up_date: '2025-01-15~2025-01-17',
  pick_up_location: '서울특별시 용산구 이태원동 228-6',
  pick_up_time: 'am 3-6',
  process_status: 'recruiting',
  title: '헬로',
};

export default function ArticleBottomView({
  article,
  onPress,
}: ArticleBottomViewProps) {
  const dateContext = article.pick_up_date.split('~');
  const startDate = new Date(dateContext[0]);
  const endDate = new Date(dateContext[1]);

  const endDateText = `${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;

  const periodText = `${
    startDate.getMonth() + 1
  }월 ${startDate.getDate()}일 ~ ${
    endDate.getMonth() + 1
  }월 ${endDate.getDate()}일`;

  const timeContext = article.pick_up_time.split(' ');
  const ampm = timeContext[0];
  const time = timeContext[1].split('-');

  return (
    <Pressable style={styles.contents} onPress={onPress}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 6,
        }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F2F4F6',
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 4,
          }}>
          <Text
            style={{
              color: '#1B1B1B',
              fontSize: 12,
              fontFamily: 'Pretendard-Medium',
            }}>
            {article.article_type === 'passItOn'
              ? article.destination
              : POSSIBLE_DELIVERY_DESTINATION_MAP[article.destination]}
          </Text>
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
            }[article.article_type],
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 4,
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
            }[article.article_type]
          }
        </View>
      </View>
      <View
        style={{
          paddingTop: 6,
          paddingBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 4,
        }}>
        <Text
          style={{
            color: '#1F1F1F',
            fontSize: 17,
            fontFamily: 'Pretendard-SemiBold',
          }}>
          {article.title}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 8,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems:
              article.article_type === 'passItOn' ? 'flex-start' : 'center',
          }}>
          <View
            style={{
              width: 44,
            }}>
            <Text style={styles.labelText}>도착</Text>
          </View>
          {article?.article_type === 'passItOn' && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              <View style={styles.flexBox}>
                <CalendarIcon width={16} height={16} color="#1B1B1B" />
                <Text style={styles.boldText}>{endDateText} 전까지</Text>
              </View>
              <View style={styles.flexBox}>
                <MarkerIcon width={16} height={16} color="#B1BAC0" />
                <Text style={styles.promiseText}>{article.destination}</Text>
              </View>
            </View>
          )}
          {article?.article_type === 'deliverItTo' && (
            <View style={styles.flexBox}>
              <View
                style={[
                  styles.flexBox,
                  {
                    height: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <CalendarIcon width={16} height={16} color="#1B1B1B" />
              </View>
              <Text style={styles.boldText}>{article.departure_date}</Text>
            </View>
          )}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              width: 44,
            }}>
            <Text style={styles.labelText}>약속</Text>
          </View>
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <View style={styles.flexBox}>
              <View
                style={[
                  styles.flexBox,
                  {
                    height: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <MarkerIcon width={16} height={16} color="#B1BAC0" />
              </View>
              <Text style={styles.promiseText}>{article.pick_up_location}</Text>
            </View>
            <View style={styles.flexBox}>
              <View
                style={[
                  styles.flexBox,
                  {
                    height: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <CalendarIcon width={16} height={16} color="#B1BAC0" />
              </View>
              <Text style={styles.promiseText}>{periodText}</Text>
            </View>
            <View style={styles.flexBox}>
              <View
                style={[
                  styles.flexBox,
                  {
                    height: 22,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <TimerIcon width={16} height={16} color="#B1BAC0" />
              </View>
              <Text style={styles.promiseText}>
                {AMPM_MAP[ampm]} {time[0]}시 ~ {time[1]}시
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contents: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  labelText: {
    color: '#1B1B1B',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Medium',
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 6,
  },
  boldText: {
    color: '#1B1B1B',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-SeimBold',
    fontWeight: 600,
  },
  promiseText: {
    flex: 1,
    color: '#1B1B1B',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
  },
});
