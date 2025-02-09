import axios from 'axios';
import {Platform} from 'react-native';
import {API_PREFIX} from '../constants';
import {getRefreshToken, setAccessToken} from '../services/auth';

const BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:8000', // iOS 시뮬레이터
  android: 'http://127.0.0.1:8000', // Android 에뮬레이터
});

const basicUrl = `${BASE_URL}${API_PREFIX}`;

const customAxios = axios.create({
  baseURL: basicUrl,
  timeout: 10000, // 10초 제한
  headers: {
    'Content-Type': 'application/json',
  },
});

// const refreshToken = await getRefreshToken();
//   if (!refreshToken) return false;

//   try {
//     const response = await customAxios.post('/auth/refresh-token', {
//       refresh_token: refreshToken,
//     });
//     await setAccessToken(response.data.access_token);
//     return true;
//   } catch (error) {
//     return false;
//   }

customAxios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    // 401 에러 발생 시 토큰 갱신
    if (error.response?.status === 401) {
      // console.error('토큰 만료');
      // 토큰 갱신 로직
      // const refreshToken = await getRefreshToken();
      // if (!refreshToken) return false;
      // try {
      //   const response = await customAxios.post('/auth/refresh-token', {
      //     refresh_token: refreshToken,
      //   });
      //   await setAccessToken(response.data.access_token);
      //   return true;
      // } catch (error) {
      //   return false;
      // }
    }
    return Promise.reject(error);
  },
);

export default customAxios;
