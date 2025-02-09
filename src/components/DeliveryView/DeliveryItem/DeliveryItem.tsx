import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Article} from '../../../types/get';
import {
  LogoIcon,
  MarkerIcon,
  MiniRightChevronIcon,
  ProfileIcon,
  TimerIcon,
} from '../../Icons';
import {PROCESS_STATUS_MAP} from '../../../enums';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type DeliveryBoxProps = {
  article: Article;
  deliveryType: 'article' | 'request';
  userId: number;
};

const DeliveryItem = ({article, deliveryType, userId}: DeliveryBoxProps) => {
  type NavigationProp = StackNavigationProp<
    {
      Chat: {chatId: number; articleId: number};
      MyPage: {screen: 'CustomerService'};
    },
    'Chat' | 'MyPage'
  >;
  const navigation = useNavigation<NavigationProp>();
  const dateContext = article.pick_up_date.split('~');
  const startDate = dateContext[0];
  const endDate = dateContext[1];
  const handleGoToChat = () => {
    navigation.navigate('Chat', {
      chatId: article.chat.id,
      articleId: article.id,
    });
  };

  const handleGoToCS = () => {
    navigation.navigate('MyPage', {
      screen: 'CustomerService',
    });
  };

  const onComplete = () => {
    // navigation.navigate('Main');
  };

  const isNicknameValid = true;

  const myDeliveries = article?.deliveries.filter(
    delivery => delivery.user_id === userId,
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}>
        {deliveryType === 'request' && (
          <View
            style={[
              styles.flexColumnBox,
              {
                flex: 1,
                gap: 10,
                alignItems: 'flex-start',
              },
            ]}>
            <View
              style={[
                styles.flexColumnBox,
                {
                  flex: 1,
                  alignItems: 'flex-start',
                },
              ]}>
              <View
                style={[
                  styles.flexBox,
                  {
                    width: '100%',
                    justifyContent: 'space-between',
                  },
                ]}>
                <Text style={styles.requestTitleText}>
                  {PROCESS_STATUS_MAP[article.process_status]}
                </Text>
                <View></View>
              </View>
              <View>
                <Text style={styles.titleText}>
                  {article.user.nickname}님과의 약속
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.flexColumnBox,
                {
                  width: '100%',
                  gap: 10,
                  alignItems: 'flex-start',
                },
              ]}>
              {article.deliveries.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                  <View>
                    <Text style={styles.voidText}>
                      정상적으로 요청을 불러오지 못했어요
                    </Text>
                  </View>
                </View>
              )}
              {myDeliveries.map((delivery, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.flexColumnBox,
                      {
                        paddingLeft: 4,
                        alignItems: 'flex-start',
                      },
                    ]}>
                    <View
                      style={[
                        styles.flexBox,
                        {
                          width: '100%',
                          gap: 6,
                          alignItems: 'center',
                        },
                      ]}>
                      <TimerIcon width={15} height={15} color="#B1BAC0" />
                      <Text style={styles.valueCommonText}>
                        {article.departure_date}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.flexBox,
                        {
                          width: '100%',
                          gap: 6,
                          alignItems: 'center',
                        },
                      ]}>
                      <MarkerIcon width={15} height={15} color="#B1BAC0" />
                      <Text style={styles.valueCommonText}>
                        {article.pick_up_location}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        {deliveryType === 'article' && (
          <View
            style={[
              styles.flexColumnBox,
              {
                gap: 10,
                alignItems: 'flex-start',
              },
            ]}>
            <View
              style={[
                styles.flexBox,
                {
                  width: '100%',
                  justifyContent: 'space-between',
                },
              ]}>
              <Text style={styles.titleText}>내 전달</Text>
              <Pressable
                style={[
                  styles.flexBox,
                  {
                    gap: 2,
                  },
                ]}>
                <Text style={styles.detailText}>자세히보기</Text>
                <MiniRightChevronIcon width={15} height={15} color="#B1BAC0" />
              </Pressable>
            </View>
            <View
              style={[
                styles.flexColumnBox,
                {
                  width: '100%',
                  gap: 10,
                  alignItems: 'flex-start',
                },
              ]}>
              {article.deliveries.length === 0 && (
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 44,
                  }}>
                  <Text style={styles.noneText}>아직 들어온 요청이 없어요</Text>
                </View>
              )}
              {article.deliveries.map((delivery, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.flexColumnBox,
                      {
                        paddingLeft: 4,
                        alignItems: 'flex-start',
                      },
                    ]}>
                    <View
                      style={[
                        styles.flexBox,
                        {
                          width: '100%',
                          gap: 6,
                          alignItems: 'center',
                        },
                      ]}>
                      <TimerIcon width={15} height={15} color="#B1BAC0" />
                      <Text style={styles.valueCommonText}>
                        {article.departure_date}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.flexBox,
                        {
                          width: '100%',
                          gap: 6,
                          alignItems: 'center',
                        },
                      ]}>
                      <MarkerIcon width={15} height={15} color="#B1BAC0" />
                      <Text style={styles.valueCommonText}>
                        {article.pick_up_location}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {article.deliveries.length !== 0 && (
              <Pressable
                onPress={onComplete}
                disabled={!isNicknameValid}
                style={({pressed}) => [
                  styles.buttonStyle,
                  {backgroundColor: pressed ? '#0BBDA1' : '#1CD7AE'},
                  {
                    marginTop: 6,
                  },
                ]}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 14,
                    lineHeight: 22,
                    fontFamily: 'Pretendard-Medium',
                  }}>
                  전달 시작
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
      <View style={styles.divisor}></View>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={[
            styles.flexBox,
            {
              width: '100%',
              justifyContent: 'space-between',
            },
          ]}>
          <View
            style={[
              styles.flexBox,
              {
                gap: 2,
              },
            ]}>
            <Text style={styles.titleText}>채팅</Text>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 19,
                fontFamily: 'Pretendard-Regular',
                color: '#B1BAC0',
                fontWeight: 400,
              }}>
              {1 + article.deliveries.length}
            </Text>
          </View>
          <Pressable
            onPress={handleGoToChat}
            style={[
              styles.flexBox,
              {
                gap: 2,
              },
            ]}>
            <Text style={styles.detailText}>전체보기</Text>
            <MiniRightChevronIcon width={15} height={15} color="#B1BAC0" />
          </Pressable>
        </View>
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
            gap: 6,
          }}>
          {article?.chat?.id ? (
            (article.messages?.length ?? 0) > 0 ? (
              article.messages?.slice(0, 3)?.map((message, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={handleGoToChat}
                    style={({pressed}) => [
                      {
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 16,
                      },
                    ]}>
                    <ProfileIcon width={48} height={48} />
                    <View
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        position: 'relative',
                      }}>
                      <View
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 22,
                            fontFamily: 'Pretendard-Medium',
                            fontWeight: 500,
                            color: '#1B1B1B',
                          }}>
                          {message.sender?.nickname}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            lineHeight: 19,
                            fontFamily: 'Pretendard-Medium',
                            fontWeight: 400,
                            color: '#B1BAC0',
                          }}>
                          {
                            new Date(message.created_at)
                              .toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                              .split(' ')[0]
                          }
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 22,
                          fontFamily: 'Pretendard-Regular',
                          fontWeight: 400,
                          color: '#1B1B1B',
                        }}>
                        {message.message}
                      </Text>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 44,
                }}>
                <Text style={styles.voidText}>
                  아직 채팅이 없어요, 먼저 인사해보세요!
                </Text>
              </View>
            )
          ) : (
            <View
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6,
              }}>
              <View>
                <Text style={styles.voidText}>
                  정상적으로 채팅을 불러오지 못했어요
                </Text>
              </View>
              <Pressable
                onPress={handleGoToCS}
                style={({pressed}) => [
                  styles.buttonStyle,
                  {backgroundColor: pressed ? '#0BBDA1' : '#1CD7AE'},
                ]}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 14,
                    lineHeight: 22,
                    fontFamily: 'Pretendard-Medium',
                  }}>
                  문의하기
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 20,
    gap: 13,
    borderRadius: 12,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Pretendard-SemiBold',
    color: '#394245',
    fontWeight: 600,
  },
  requestTitleText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Medium',
    color: '#1CD7AE',
    fontWeight: 500,
  },
  detailText: {
    fontSize: 12,
    lineHeight: 19,
    fontFamily: 'Pretendard-Medium',
    letterSpacing: -0.01,
    color: '#B1BAC0',
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flexColumnBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  valueCommonText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
    color: '#1B1B1B',
  },
  divisor: {
    backgroundColor: '#F2F4F6',
    height: 1,
    width: '100%',
    marginTop: 6,
    marginBottom: 4,
  },
  buttonStyle: {
    width: '100%',
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 6,
    backgroundColor: '#1CD7AE',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noneText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#C7CDD1',
    fontFamily: 'Prentendard-SemiBold',
    fontWeight: 600,
  },
  voidText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#C7CDD1',
    fontFamily: 'Prentendard-Regular',
    fontWeight: 400,
  },
});

export default DeliveryItem;
