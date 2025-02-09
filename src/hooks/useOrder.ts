import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth/token';
import {Order} from '../types/get';

const useOrder = () => {
  /*
   * 주문 하나를 조회하는 함수
   **/
  const findOneOrder = async (
    id: number,
  ): Promise<Order | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/stores/one/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('주문 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('주문 조회 오류:', error);
    }
  };

  /*
   * 나의 주문을 조회하는 함수
   **/
  const findMyOrder = async (): Promise<Order[] | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/orders/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('주문 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('주문 조회 오류:', error);
    }
  };

  const createOrder = async ({
    storeId,
    serviceId,
    description,
    orderType,
  }: {
    storeId: number | null | undefined;
    serviceId: number | null | undefined;
    description: string;
    orderType: string;
  }): Promise<Order | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.post(
        `/orders/create`,
        {
          storeId,
          serviceId,
          description,
          orderType,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('주문 생성 실패');
      }
      return response.data;
    } catch (error) {
      console.error('주문 생성 오류:', error);
    }
  };

  return {findOneOrder, findMyOrder, createOrder};
};

export default useOrder;
