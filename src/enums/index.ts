export const POSSIBLE_DELIVERY_DESTINATION_MAP: {
  [key: string]: string;
} = {
  dongdaemun: '동대문구',
  seongdong: '성동구',
  jongro: '종로구',
  gwangjin: '광진구',
  jung: '중구',
  mapo: '마포구',
  seodaemun: '서대문구',
  gangseo: '강서구',
  yangcheon: '양천구',
  guro: '구로구',
  yeongdeungpo: '영등포구',
  geumcheon: '금천구',
  dongjak: '동작구',
  gwanak: '관악구',
  seocho: '서초구',
  gangnam: '강남구',
  songpa: '송파구',
  gangdong: '강동구',
  eunpyeong: '은평구',
  yongsan: '용산구',
  dobong: '도봉구',
  gangbuk: '강북구',
  seongbuk: '성북구',
  nowon: '노원구',
  jungrang: '중랑구',
};

export const AMPM_MAP: {
  [key: string]: string;
} = {
  am: '오전',
  pm: '오후',
};

export const SERVICE_CATEGORY_MAP: {
  [key: string]: string;
} = {
  METAL: '금속가공',
  WOOD: '목재가공',
  '3DPRINT': '3D프린팅',
  ACRYLIC: '아크릴가공',
  PRINT: '인쇄',
  ENGRAVE: '각인',
  PAINT: '도색',
  PLASTIC: '플라스틱가공',
  ETC: '그외',
};

export const PROCESS_STATUS_MAP: {
  [key in ProcessStatus]: string;
} = {
  beforePickUp: '수령 전',
  beforeDelivery: '전달 전',
  onDelivery: '전달 중',
  afterDelivery: '전달완료',
};
