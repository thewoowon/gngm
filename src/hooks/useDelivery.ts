import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth/token';
import {Delivery} from '../types/get';

const useDelivery = () => {
  const findOneDelivery = async (id: string): Promise<Delivery> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/deliveries/one`, {
        params: {id},
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
      return {} as Delivery;
    }
  };

  const findAllDeliveries = async (): Promise<Delivery[]> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get('/deliveries/all', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('전달 목록 조회 실패');
      }
      return response.data;
    } catch (error: any) {
      console.error('전달 조회 오류:', error);
      return [];
    }
  };

  const createDelivery = async ({
    orderId,
    dateContext,
    timeContext,
    articleId,
  }: {
    orderId: number | null | undefined;
    dateContext: {
      day: number;
      disabled: boolean;
      date: Date;
      isToday?: boolean;
      fullText: string;
    };
    timeContext: {
      label: string;
      ampm: string;
      time: string;
    };
    articleId: number;
  }) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.post(
        '/deliveries/create',
        {
          orderId,
          date: dateContext.fullText,
          time: timeContext.time,
          articleId,
        },
        {
          headers: {Authorization: `Bearer ${accessToken}`},
        },
      );
      if (response.status !== 201 && response.status !== 200) {
        throw new Error('게시글 생성 실패');
      }
      return response.data;
    } catch (error) {
      console.error('전달 생성 오류:', error);
    }
  };

  const updateDelivery = async (
    id: string,
    article: {title: string; content: string},
  ) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.put(`/deliveries/${id}`, article, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      if (response.status !== 200) {
        throw new Error('전달 수정 실패');
      }
      return response.data;
    } catch (error) {
      console.error('전달 수정 오류:', error);
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.delete(`/deliveries/${id}`, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      if (response.status !== 204) {
        throw new Error('전달 삭제 실패');
      }
      return response.data;
    } catch (error) {
      console.error('전달 삭제 오류:', error);
    }
  };

  return {
    findOneDelivery,
    findAllDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery,
  };
};

export default useDelivery;
