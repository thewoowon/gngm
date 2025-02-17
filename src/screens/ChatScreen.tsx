import React, {useEffect, useState} from 'react';
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
import {
  HomeIcon,
  LeftArrowIcon,
  MiniUpChevronIcon,
  PlusIcon,
  UpArrowIcon,
} from '../components/Icons';
import {Chat, Message, User} from '../types/get';
import {useChat, useMe, useMessage} from '../hooks';
import {MyMessages, YourMessages} from '../components/Messages';

const CHAT_CONTEXT = [
  {
    id: 1,
    message: '안녕하세요',
    sender: {
      address: '',
      created_at: '2025-02-08T10:22:59',
      email: 'thewoowon76@gmail.com',
      id: 31,
      is_auto_login: 0,
      is_job_open: 1,
      job: 'Hello',
      job_description: 'Hello duel',
      name: '우원',
      nickname: '고구마',
      phone_number: '',
      src: 'file:///Users/mac/Library/Developer/CoreSimulator/Devices/CC50996C-6BF8-422A-86C3-56D80406AECF/data/Containers/Data/Application/79D557B7-F536-456D-AFE0-D7A8334CFB31/tmp/E11F1E91-58C0-4FF8-8058-0D7AAEB42471.jpg',
      updated_at: '2025-02-08T13:08:10',
      accident_date: '2025-02-08',
    },
    created_at: '2025-02-08T10:22:30',
    updated_at: '2025-02-08T10:22:30',
  },
  {
    id: 2,
    message: '안녕하세요',
    sender: {
      address: '',
      created_at: '2025-02-08T10:22:59',
      email: 'thewoowon76@gmail.com',
      id: 31,
      is_auto_login: 0,
      is_job_open: 1,
      job: 'Hello',
      job_description: 'Hello duel',
      name: '우원',
      nickname: '고구마',
      phone_number: '',
      src: 'file:///Users/mac/Library/Developer/CoreSimulator/Devices/CC50996C-6BF8-422A-86C3-56D80406AECF/data/Containers/Data/Application/79D557B7-F536-456D-AFE0-D7A8334CFB31/tmp/E11F1E91-58C0-4FF8-8058-0D7AAEB42471.jpg',
      updated_at: '2025-02-08T13:08:10',
      accident_date: '2025-02-08',
    },
    created_at: '2025-02-08T10:22:40',
    updated_at: '2025-02-08T10:22:40',
  },
  {
    id: 3,
    message: '안녕하세요',
    sender: {
      address: '',
      created_at: '2025-02-08T10:22:59',
      email: 'thewoowon76@gmail.com',
      id: 31,
      is_auto_login: 0,
      is_job_open: 1,
      job: 'Hello',
      job_description: 'Hello duel',
      name: '우원',
      nickname: '고구마',
      phone_number: '',
      src: 'file:///Users/mac/Library/Developer/CoreSimulator/Devices/CC50996C-6BF8-422A-86C3-56D80406AECF/data/Containers/Data/Application/79D557B7-F536-456D-AFE0-D7A8334CFB31/tmp/E11F1E91-58C0-4FF8-8058-0D7AAEB42471.jpg',
      updated_at: '2025-02-08T13:08:10',
      accident_date: '2025-02-08',
    },
    created_at: '2025-02-08T10:22:59',
    updated_at: '2025-02-08T10:22:59',
  },
  {
    id: 4,
    message: '제 이름은 고구마입니다',
    sender: {
      address: '',
      created_at: '2025-02-08T10:22:59',
      email: 'thewoowon76@gmail.com',
      id: 31,
      is_auto_login: 0,
      is_job_open: 1,
      job: 'Hello',
      job_description: 'Hello duel',
      name: '우원',
      nickname: '고구마',
      phone_number: '',
      src: 'file:///Users/mac/Library/Developer/CoreSimulator/Devices/CC50996C-6BF8-422A-86C3-56D80406AECF/data/Containers/Data/Application/79D557B7-F536-456D-AFE0-D7A8334CFB31/tmp/E11F1E91-58C0-4FF8-8058-0D7AAEB42471.jpg',
      updated_at: '2025-02-08T13:08:10',
      accident_date: '2025-02-08',
    },
    created_at: '2025-02-08T10:23:01',
    updated_at: '2025-02-08T10:23:01',
  },
  {
    id: 5,
    message: '뒤지실래요?',
    sender: {
      address: '',
      created_at: '2025-02-08T10:22:59',
      email: 'jiwon@gmail.com',
      id: 22,
      is_auto_login: 0,
      is_job_open: 1,
      job: 'Hello',
      job_description: 'fuck',
      name: '박지원',
      nickname: '감자',
      phone_number: '',
      src: 'file:///Users/mac/Library/Developer/CoreSimulator/Devices/CC50996C-6BF8-422A-86C3-56D80406AECF/data/Containers/Data/Application/79D557B7-F536-456D-AFE0-D7A8334CFB31/tmp/E11F1E91-58C0-4FF8-8058-0D7AAEB42471.jpg',
      updated_at: '2025-02-08T13:08:10',
      accident_date: '2025-02-08',
    },
    created_at: '2025-02-08T10:24:30',
    updated_at: '2025-02-08T10:24:30',
  },
  {
    id: 6,
    message: '지금 저랑 장난치세요?',
    sender: {
      address: '',
      created_at: '2025-02-08T10:22:59',
      email: 'jiwon@gmail.com',
      id: 22,
      is_auto_login: 0,
      is_job_open: 1,
      job: 'Hello',
      job_description: 'fuck',
      name: '박지원',
      nickname: '감자',
      phone_number: '',
      src: 'file:///Users/mac/Library/Developer/CoreSimulator/Devices/CC50996C-6BF8-422A-86C3-56D80406AECF/data/Containers/Data/Application/79D557B7-F536-456D-AFE0-D7A8334CFB31/tmp/E11F1E91-58C0-4FF8-8058-0D7AAEB42471.jpg',
      updated_at: '2025-02-08T13:08:10',
      accident_date: '2025-02-08',
    },
    created_at: '2025-02-08T10:24:40',
    updated_at: '2025-02-08T10:24:40',
  },
  {
    id: 7,
    message: '싸우기 마세요... 무서운데..ㅜㅜ',
    sender: {
      address: '',
      created_at: '2025-02-08T10:22:59',
      email: 'guwon@gmail.com',
      id: 12,
      is_auto_login: 0,
      is_job_open: 1,
      job: 'Hello',
      job_description: 'fuck',
      name: '이구원',
      nickname: '옥수수',
      phone_number: '',
      src: 'file:///Users/mac/Library/Developer/CoreSimulator/Devices/CC50996C-6BF8-422A-86C3-56D80406AECF/data/Containers/Data/Application/79D557B7-F536-456D-AFE0-D7A8334CFB31/tmp/E11F1E91-58C0-4FF8-8058-0D7AAEB42471.jpg',
      updated_at: '2025-02-08T13:08:10',
      accident_date: '2025-02-08',
    },
    created_at: '2025-02-08T10:24:41',
    updated_at: '2025-02-08T10:24:41',
  },
];

// 내 정보 가져오고, 채팅 정보 가져오고, 메세지 가져오고
const ChatScreen = ({navigation, route}: any) => {
  // 채팅은 무조건 나의 채팅방임.
  // chatId, articleId 타입 정의
  const {
    chatId,
    articleId,
  }: {
    chatId: number;
    articleId: number;
  } = route.params;
  const [input, setInput] = useState<string>('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
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

  // 내 정보 가져오기 먼저
  const {getMe} = useMe();
  // 채팅 정보 가져오기
  const {findOneChat} = useChat();
  // 메세지 정보 가져오기
  const {findOneMessage, findMessagesByChatId, createMessage} = useMessage();

  const fetchChat = async () => {
    const user = await getMe();

    if (!user) {
      Alert.alert('사용자를 찾을 수 없습니다.');
      return;
    }
    setUser(user);
    // 처음에 메세지는 100개만 가져옴
    const chat = await findOneChat(chatId, 100, 0);

    if (!chat) {
      Alert.alert('채팅방을 찾을 수 없습니다.');
      return;
    }

    setChat(chat);

    // messages를 사용자별 일자별, 시간별로 묶음처리
  };

  const fetchMessages = async () => {
    const messages = await findMessagesByChatId(chatId, 100, 0);

    if (!messages) {
      Alert.alert('메세지를 찾을 수 없습니다.');
      return;
    }

    setMessages(messages);
  };

  const sendMessage = async () => {
    if (!input) {
      Alert.alert('메세지를 입력해주세요.');
      return;
    }

    // 메세지 보내기
    const message = await createMessage(chatId, input);

    if (!message) {
      Alert.alert('메세지를 보낼 수 없습니다.');
      return;
    }

    // 메세지 보내고 나서 메세지 가져오기
    const result = await findOneMessage(message);

    if (!result) {
      Alert.alert('메세지를 가져올 수 없습니다.');
      return;
    }

    setInput('');
    setMessages([...messages, result]);
  };

  useEffect(() => {
    fetchChat();
    // fetchMessages();
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
              gap: 4,
            }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <LeftArrowIcon />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('Around');
              }}>
              <HomeIcon />
            </Pressable>
          </View>
          <Text style={styles.headerText}>
            {chat
              ? chat.participants?.map(p => p.user.nickname).join(', ')
              : ''}
          </Text>
        </View>
        <View style={styles.layout}>
          <View style={styles.chatMain}>
            {messages.length === 0 ? (
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <Text style={styles.voidText}>
                  {chat
                    ? chat.participants?.map(p => p.user.nickname).join(', ')
                    : ''}
                  님과의 채팅방입니다.
                </Text>
                <Text style={styles.voidText}>
                  타인에게 피해가 되는 언행은 삼가해주세요
                </Text>
              </View>
            ) : (
              messages.map((message, index) => {
                if (message.sender.id === user.id) {
                  return <MyMessages key={index} messages={[message]} />;
                }
                return <YourMessages key={index} messages={[message]} />;
              })
            )}
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Pressable
                onPress={() => {
                  console.log('send message');
                }}>
                <PlusIcon />
              </Pressable>
            </View>
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
              <TextInput
                style={styles.input}
                placeholder="메시지를 입력해주세요"
                placeholderTextColor={'#8E979E'}
                value={input}
                onChangeText={text => {
                  setInput(text);
                }}
                onKeyPress={e => {
                  if (e.nativeEvent.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              <Pressable
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 32,
                  height: 32,
                  backgroundColor: '#1CD7AE',
                  borderRadius: 50,
                }}
                onPress={sendMessage}>
                <UpArrowIcon width={16} height={16} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    borderBottomWidth: 1,
    borderColor: '#E6EAED',
  },
  headerText: {
    color: '#181818',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  layout: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatMain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#F2F4F6',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#F2F4F6',
    gap: 12,
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  arrowContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    padding: 10,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    backgroundColor: '#F2F4F6',
    borderRadius: 6,
    maxHeight: 44,
  },
  voidText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#C7CDD1',
    lineHeight: 20,
  },
});

export default ChatScreen;
