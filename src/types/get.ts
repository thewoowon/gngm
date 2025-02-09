export interface User {
  address: string;
  email: string;
  id: number;
  name: string;
  nickname: string;
  phone_number: string;
  src: string;
  is_auto_login: number;
  is_job_open: number;
  job: string | null;
  job_description: string | null;
  accident_date: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Place {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

// passItOn -> 전달해주세요, deliverItTo -> 전달해드려요, recruitment -> 팀원모집
export type ArticleType = 'passItOn' | 'deliverItTo' | 'recruitment';

export interface Article {
  id: number;
  title: string;
  contents: string;
  article_type: ArticleType;
  pick_up_location: string;
  pick_up_date: string;
  pick_up_time: string;
  destination: string;
  departure_date: string;
  number_of_recruits: string;
  process_status: ProcessStatus;
  user_id: number;
  address: {
    id: number;
    postal_code: string;
    address_string: string;
    latitude: string;
    longitude: string;
  };
  deliveries: Delivery[];
  user: User;
  chat: TinyChat;
  messages?: Message[];
}

export interface Delivery {
  id: number;
  request_date: string;
  request_time: string;
  user_id: number;
  article_id: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  message: string;
  sender: User;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: number;
  user: User;
  role: 'founder' | 'participant';
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export type TinyChat = Pick<Chat, 'id' | 'founder' | 'participants'>;

export interface Chat {
  id: number;
  founder: User;
  participants: ChatParticipant[];
  messages?: Message[];
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  contents: string;
  notification_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: number;
  code: string;
  name: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  unit: string;
  price: number;
  discount_rate: number;
  is_representative: number;
  representative_image: string;
  service_category: ServiceCategory;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  store_type: string;
  business_hours: string;
  phone_number: string;
  representative_image: string | null | undefined;
  created_at: string;
  updated_at: string;
  services: Service[];
}

export interface Review {
  id: number;
  title: string;
  contents: string;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  description: string;
  order_type: string;
  created_at: string;
  updated_at: string;

  store: {
    name: string;
    address: string;
    store_type: string;
    business_hours: string;
    phone_number: string;
    representative_image: string;
  };
}
