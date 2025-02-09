import React from 'react';
import Svg, {Path} from 'react-native-svg';

const PaymentIcon = ({width = 24, height = 24, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 5.5C3 4.83696 3.26339 4.20107 3.73223 3.73223C4.20107 3.26339 4.83696 3 5.5 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V20C21 20.1779 20.9526 20.3526 20.8626 20.5061C20.7726 20.6596 20.6433 20.7863 20.488 20.8731C20.3327 20.96 20.157 21.0038 19.9791 21.0001C19.8012 20.9963 19.6275 20.9452 19.476 20.852L16.75 19.174L14.024 20.852C13.8664 20.9489 13.685 21.0003 13.5 21.0003C13.315 21.0003 13.1336 20.9489 12.976 20.852L10.25 19.174L7.524 20.852C7.37245 20.9452 7.19878 20.9963 7.02088 21.0001C6.84299 21.0038 6.66733 20.96 6.51202 20.8731C6.35672 20.7863 6.22739 20.6596 6.13738 20.5061C6.04737 20.3526 5.99995 20.1779 6 20V14H4C3.73478 14 3.48043 13.8946 3.29289 13.7071C3.10536 13.5196 3 13.2652 3 13V5.5ZM8 18.21L9.726 17.148C9.88359 17.0511 10.065 16.9997 10.25 16.9997C10.435 16.9997 10.6164 17.0511 10.774 17.148L13.5 18.826L16.226 17.148C16.3836 17.0511 16.565 16.9997 16.75 16.9997C16.935 16.9997 17.1164 17.0511 17.274 17.148L19 18.21V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H7.95C7.98333 5.162 8 5.32867 8 5.5V18.21ZM5.5 5C5.36739 5 5.24021 5.05268 5.14645 5.14645C5.05268 5.24021 5 5.36739 5 5.5V12H6V5.5C6 5.36739 5.94732 5.24021 5.85355 5.14645C5.75979 5.05268 5.63261 5 5.5 5ZM10 9C10 8.73478 10.1054 8.48043 10.2929 8.29289C10.4804 8.10536 10.7348 8 11 8H16C16.2652 8 16.5196 8.10536 16.7071 8.29289C16.8946 8.48043 17 8.73478 17 9C17 9.26522 16.8946 9.51957 16.7071 9.70711C16.5196 9.89464 16.2652 10 16 10H11C10.7348 10 10.4804 9.89464 10.2929 9.70711C10.1054 9.51957 10 9.26522 10 9ZM10 13C10 12.7348 10.1054 12.4804 10.2929 12.2929C10.4804 12.1054 10.7348 12 11 12H15C15.2652 12 15.5196 12.1054 15.7071 12.2929C15.8946 12.4804 16 12.7348 16 13C16 13.2652 15.8946 13.5196 15.7071 13.7071C15.5196 13.8946 15.2652 14 15 14H11C10.7348 14 10.4804 13.8946 10.2929 13.7071C10.1054 13.5196 10 13.2652 10 13Z"
      fill="#1B1B1B"
    />
  </Svg>
);

export default PaymentIcon;
