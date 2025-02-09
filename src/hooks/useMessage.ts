import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth/token';
import {Message} from '../types/get';

const useMessage = () => {
  const findOneMessage = async (
    id: number,
  ): Promise<Message | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/messages/one/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('메세지 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('메세지 조회 오류:', error);
    }
  };

  /*
   * 채팅 메세지를 조회하는 함수
   **/
  const findMessagesByChatId = async (
    id: number,
    take: number,
    skip: number,
  ): Promise<Message[] | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          take,
          skip,
        },
      });
      if (response.status !== 200) {
        throw new Error('채팅 메세지 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('채팅 메세지 조회 오류:', error);
    }
  };

  const createMessage = async (
    chatId: number,
    content: string,
  ): Promise<number | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.post(
        `/messages/create/${chatId}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status !== 201) {
        throw new Error('채팅 메세지 생성 실패');
      }
      return response.data.message_id;
    } catch (error) {
      console.error('채팅 메세지 생성 오류:', error);
    }
  };

  return {findOneMessage, findMessagesByChatId, createMessage};
};

export default useMessage;
