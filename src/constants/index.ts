import {ArticleType} from '../types/get';

const API_PREFIX = '/api/v1';
export {API_PREFIX};

export const DELIVERY_TYPE: {
  label: string;
  value: ArticleType;
}[] = [
  {label: '전달해드려요', value: 'deliverItTo'},
  {label: '전달해주세요', value: 'passItOn'},
];

export const POSSIBLE_DELIVERY_DESTINATION: {
  label: string;
  value: string;
}[] = [
  {label: '동대문구', value: 'dongdaemun'},
  {label: '성동구', value: 'seongdong'},
  {label: '종로구', value: 'jongro'},
  {label: '광진구', value: 'gwangjin'},
  {label: '중구', value: 'jung'},
  {label: '마포구', value: 'mapo'},
  {label: '서대문구', value: 'seodaemun'},
  {label: '강서구', value: 'gangseo'},
  {label: '양천구', value: 'yangcheon'},
  {label: '구로구', value: 'guro'},
  {label: '영등포구', value: 'yeongdeungpo'},
  {label: '금천구', value: 'geumcheon'},
  {label: '동작구', value: 'dongjak'},
  {label: '관악구', value: 'gwanak'},
  {label: '서초구', value: 'seocho'},
  {label: '강남구', value: 'gangnam'},
  {label: '송파구', value: 'songpa'},
  {label: '강동구', value: 'gangdong'},
  {label: '은평구', value: 'eunpyeong'},
  {label: '용산구', value: 'yongsan'},
  {label: '도봉구', value: 'dobong'},
  {label: '강북구', value: 'gangbuk'},
  {label: '성북구', value: 'seongbuk'},
  {label: '노원구', value: 'nowon'},
  {label: '중랑구', value: 'jungrang'},
];

export const WEEK_NAME = ['일', '월', '화', '수', '목', '금', '토'];

export const AMPM = [
  {
    label: '오전',
    value: 'am',
  },
  {
    label: '오후',
    value: 'pm',
  },
];

export const PICKUP_TIME_LIST = [
  {label: '12시 ~ 3시', value: '12-3'},
  {label: '3시 ~ 6시', value: '3-6'},
  {label: '6시 ~ 9시', value: '6-9'},
  {label: '9시 ~ 12시', value: '9-12'},
];

export const ADDRESS_DATA = [
  {
    address: '서울특별시 종로구 종로 139-1, 주얼리타운 ',
    latitude: 37.5707538249968,
    longitude: 126.993161458905,
  },
  {
    address: '서울 종로구 돈화문로10가길 23, 새하얀 도금',
    latitude: 37.5734277517211,
    longitude: 126.992400619828,
  },
  {
    address: '봉익동 18-3번지 1층 종로구 서울특별시 KR, 호로록 분식',
    latitude: 37.5725131542701,
    longitude: 126.992440106076,
  },
  {
    address: '서울특별시 종로구 돈화문로 35-1 2층, 진1926',
    latitude: 37.5716841832285,
    longitude: 126.991617354163,
  },
  {
    address: '서울특별시 종로구 돈화문로6가길 29, 아림주물',
    latitude: 37.5720293026915,
    longitude: 126.992175723415,
  },
  {
    address: '서울 종로구 종로3가 28, 대림주얼리',
    latitude: 37.5707429078644,
    longitude: 126.992905749012,
  },
  {
    address: '서울 종로구 종로3가 28',
    latitude: 37.5707429078644,
    longitude: 126.992905749012,
  },
  {
    address: '서울특별시 종로구 돈화문로9길 17, 닭한마리',
    latitude: 37.5716318667707,
    longitude: 126.990827352272,
  },
  {
    address: '서울특별시 종로구 돈화문로20길 17, 장안성',
    latitude: 37.5711516142842,
    longitude: 126.991749628086,
  },
];
