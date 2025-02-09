export interface CreateArticlePayload {
  title: string;
  contents: string;
  articleType: string;
  pickUpLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  destination: string;
  departureDate: string;
  numberOfRecruits: number;
  processStatus: ProcessStatus;
  latitude1: string;
  longitude1: string;
  latitude2: string;
  longitude2: string;
}
