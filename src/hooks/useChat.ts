import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth/token';
import {Chat} from '../types/get';

const useChat = () => {
  /*
   * 채팅 하나를 조회하는 함수
   **/
  const findOneChat = async (
    id: number,
    take: number,
    skip: number,
  ): Promise<Chat | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/chats/one/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          take,
          skip,
        },
      });
      if (response.status !== 200) {
        throw new Error('채팅 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('채팅 조회 오류:', error);
    }
  };

  /*
   * 나의 채팅을 조회하는 함수
   **/
  const findMyChat = async (): Promise<Chat[] | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/chats/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('채팅 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('채팅 조회 오류:', error);
    }
  };

  return {findOneChat, findMyChat};
};

export default useChat;
