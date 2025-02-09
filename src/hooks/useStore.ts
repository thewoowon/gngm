import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth/token';
import {Store} from '../types/get';

const useStore = () => {
  /*
   * 게시글 하나를 조회하는 함수
   **/
  const findOneStore = async (
    id: number,
  ): Promise<Store | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/stores/one/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('스토어 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('스토어 조회 오류:', error);
    }
  };

  /*
   * 스토어명을 조회하는 함수
   **/
  const findBySearchQueryStore = async (
    search_query: string,
  ): Promise<Store[] | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/stores/search/${search_query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('스토어 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('스토어 조회 오류:', error);
    }
  };

  /*
   * 스토어 카테고리를 조회하는 함수
   **/
  const findByCategoryStore = async (
    category: string,
  ): Promise<Store[] | undefined | null> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/stores/category/${category}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('스토어 조회 실패');
      }
      return response.data;
    } catch (error) {
      console.error('스토어 조회 오류:', error);
    }
  };

  return {findOneStore, findBySearchQueryStore, findByCategoryStore};
};

export default useStore;
