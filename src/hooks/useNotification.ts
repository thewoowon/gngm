import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth';
import {Notification} from '../types/get';

const useNotification = () => {
  const findOneNotification = async (id: number): Promise<Notification> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/notifications/one/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('게시글 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('게시글 조회 오류:', error);
      return {} as Notification;
    }
  };

  const findAllNotifications = async (): Promise<Notification[]> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get('/notifications/all', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('게시글 목록 조회 실패');
      }
      return response.data;
    } catch (error: any) {
      // console.error('게시글 목록 조회 오류:', error);
      return [];
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.delete(`/notifications/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('게시글 삭제 실패');
      }
      return response.data;
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.delete(`/notifications/delete/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('게시글 삭제 실패');
      }
      return response.data;
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
    }
  };

  return {
    findOneNotification,
    findAllNotifications,
    deleteNotification,
    deleteAllNotifications,
  };
};

export default useNotification;
