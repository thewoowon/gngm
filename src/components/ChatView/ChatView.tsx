import {View} from 'react-native';
import {Chat} from '../../types/get';
import ChatBox from './ChatBox';

type ChatViewProps = {
  chats: Chat[];
};

const ChatView = ({chats}: ChatViewProps) => {
  return (
    <View>
      {chats.map((chat, index) => {
        return <ChatBox key={index} chat={chat} />;
      })}
    </View>
  );
};

export default ChatView;
