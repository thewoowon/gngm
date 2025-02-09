import {StyleSheet, Text, View} from 'react-native';
import {Message} from '../../types/get';

const MyMessages = ({messages}: {messages: Message[]}) => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.assembles}>
          {messages.map((message, index) => {
            const createdAt = new Date(message.created_at);
            // 출력 -> 오후 3:00
            const hours = createdAt.getHours();
            const minutes = createdAt.getMinutes();
            const ampm = hours >= 12 ? '오후' : '오전';
            const displayHours = hours % 12;
            const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const displayLabel = `${ampm} ${displayHours}:${displayMinutes}`;
            return (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                  gap: 6,
                }}>
                <Text style={styles.createdAt}>{displayLabel}</Text>
                <View key={index} style={styles.speechBubble}>
                  <Text style={styles.speechText}>{message.message}</Text>
                </View>
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
    justifyContent: 'flex-end',
    marginBottom: 8,
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
  createdAt: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#B1BAC0',
    lineHeight: 19,
    letterSpacing: -0.01,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 12,
    paddingRight: 12,
    maxWidth: 234,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3.84,
    elevation: 5,
  },
  speechText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#1B1B1B',
    lineHeight: 21,
  },
});

export default MyMessages;
