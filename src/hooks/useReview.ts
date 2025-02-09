import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth/token';
import {Review, Store} from '../types/get';

const useReview = () => {
  /*
   * 리뷰 하나를 조회하는 함수
   **/
  const findOneReview = async (
    id: number,
  ): Promise<Review | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/reviews/one/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('리뷰 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('리뷰 조회 오류:', error);
    }
  };

  /*
   * 리뷰를 조회하는 함수
   **/
  const findReviewByStoreId = async (
    storeId: number,
  ): Promise<Review[] | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/reviews/store/${storeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('리뷰 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('리뷰 조회 오류:', error);
    }
  };

  return {findOneReview, findReviewByStoreId};
};

export default useReview;
