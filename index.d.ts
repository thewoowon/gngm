declare module '@env' {
  export const KAKAO_MAP_API_KEY: string;
  export const GOOGLE_MAP_API_KEY: string;
  export const NAVER_MAP_CLIENT_ID: string;
  export const NAVER_MAP_CLIENT_SECRET: string;
  export const GOOGLE_IOS_CLIENT_ID: string;
  export const GOOGLE_IOS_URL_SCHEME: string;
  export const GOOGLE_AOS_CLIENT_ID: string;
  export const GOOGLE_SHA1: string;
  export const API_URL: string;
}

declare module '*.svg' {
  import {FC, SVGProps} from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

type ContentsCategory = 'passItOn' | 'deliverItTo' | 'recruitment';
// 수령 전 - 전달 전 - 전달 중 - 전달완료
type ProcessStatus =
  | 'beforePickUp'
  | 'beforeDelivery'
  | 'onDelivery'
  | 'afterDelivery';

type StoreType = 'ONLINE' | 'OFFLINE' | 'BOTH';

type ContentsType = {
  id: string;
  from: string;
  to: string;
  title: string;
  description: string;
  period?: string;
  enableTime?: string;
  startTime?: string;
  pickUpLocation?: string;
  destination?: string;
  participants?: number;
  TotalParticipants?: number;
  category: ContentsCategory;
  processStatus: ProcessStatus;
};

type OrderType = {
  id: string;
  title: string;
  description: string;
  price: number;
  // 예상작업완료일
  dueDate: string;
  // 상태
  status: string;
};

type NotificationType = {
  id: string;
  title: string;
  description: string;
};

type SearchType = {
  id: string;
  // company id
  companyId: string;
  // 상호
  name: string;
  type: string[];
  // 1 회당 가격
  price: number;
  // 주소
  address: string;
  src: string;
};

type CompanyType = {
  id: string;
  // 상호
  name: string;
  // 카테고리
  type: string[];
  // 영업시간 오픈-클로즈
  businessHours: string;
  // 전화번호
  phoneNumber: string;
  // 주소
  address: string;
  // 서비스
  services: ServiceType[];
};
// 제공 서비스
type ServiceType = {
  id: string;
  // 서비스명
  name: string;
  // 서비스 설명
  description: string;
  // unit
  unit: string;
  // 가격
  price: number;
  // 할인율
  discountRate: number;
  // 할인가
  discountPrice: number;
  // 이미지
  src: string;
  // type
  type: string;
};

type ReviewType = {
  id: string;
  companyId: string;
  title: string;
  score: number;
  review: string;
  date: string;
  user: UserType;
};

type UserType = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  src: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}
