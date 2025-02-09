import customAxios from '../axios/customAxios';
import {getAccessToken} from '../services/auth/token';
import {CreateArticlePayload} from '../types/post';
import {Article} from '../types/get';

const useArticle = () => {
  /*
   * 게시글 하나를 조회하는 함수
   **/
  const findOneArticle = async (id: number) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(`/articles/one/${id}`, {
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
    }
  };

  /*
   * 나와 관련된 게시글 목록을 조회하는 함수
   **/
  const findAllArticles = async (): Promise<Article[]> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get('/articles/all', {
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

  /*
   * 나와 관련된 게시글 목록을 조회하는 함수
   **/
  const findAllArticlesWithMessages = async (): Promise<Article[]> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get('/articles/all/with-messages', {
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
  /*
   * 나와 관련된 게시글 목록을 조회하는 함수
   **/
  const findRequestArticles = async (): Promise<Article[]> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get('/articles/request', {
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

  /*
   * 나와 관련된 게시글 목록을 조회하는 함수
   **/
  const findRequestArticlesWithMessages = async (): Promise<Article[]> => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get(
        '/articles/request/with-messages',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status !== 200) {
        throw new Error('게시글 목록 조회 실패');
      }
      return response.data;
    } catch (error: any) {
      // console.error('게시글 목록 조회 오류:', error);
      return [];
    }
  };

  /*
   * 내 위치 기준 10km 이내의 게시글 목록을 조회하는 함수
   **/
  const findAroundArticles = async (params: {
    latitude: number;
    longitude: number;
    distance: number;
  }) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.get('/articles/location', {
        params: params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('게시글 목록 조회 실패');
      }
      return response.data;
    } catch (error: any) {
      return [];
    }
  };

  const createArticle = async (payload: CreateArticlePayload) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.post('/articles/create', payload, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      if (response.status !== 201) {
        throw new Error('게시글 생성 실패');
      }
      return response.data;
    } catch (error) {
      console.error('게시글 생성 오류:', error);
    }
  };

  const updateArticle = async (
    id: string,
    article: {title: string; content: string},
  ) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.put(`/articles/${id}`, article, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      if (response.status !== 200) {
        throw new Error('게시글 수정 실패');
      }
      return response.data;
    } catch (error) {
      console.error('게시글 수정 오류:', error);
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const accessToken = await getAccessToken();
      const response = await customAxios.delete(`/articles/${id}`, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      if (response.status !== 204) {
        throw new Error('게시글 삭제 실패');
      }
      return response.data;
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
    }
  };

  return {
    findOneArticle,
    findAllArticles,
    findAllArticlesWithMessages,
    findRequestArticles,
    findRequestArticlesWithMessages,
    findAroundArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};

export default useArticle;
