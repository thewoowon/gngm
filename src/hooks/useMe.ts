import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth';
import {User} from '../types/get';

const useMe = () => {
  const getMe = async (): Promise<User | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('내 정보 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('내 정보 조회 오류:', error);
      return null;
    }
  };

  return {getMe};
};

export default useMe;
