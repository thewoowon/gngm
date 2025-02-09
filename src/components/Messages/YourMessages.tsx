import {Image, StyleSheet, Text, View} from 'react-native';
import {Message} from '../../types/get';

const YourMessages = ({messages}: {messages: Message[]}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{uri: messages[0].sender.src}}
        style={{width: 32, height: 32, borderRadius: 16}}
      />
      <View style={styles.main}>
        <Text style={styles.nickname}>{messages[0].sender.nickname}</Text>
        <View style={styles.assembles}>
          {messages.map((message, index) => {
            return (
              <View key={index} style={styles.speechBubble}>
                <Text style={styles.speechText}>{message.message}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    gap: 13,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 4,
  },
  assembles: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  nickname: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#1B1B1B',
    lineHeight: 19,
    letterSpacing: -0.01,
  },
  speechBubble: {
    backgroundColor: '#1CD7AE',
    borderRadius: 8,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 12,
    paddingRight: 12,
    maxWidth: 234,
  },
  speechText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#FFFFFF',
    lineHeight: 21,
  },
});

export default YourMessages;
