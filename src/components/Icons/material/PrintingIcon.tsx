import React from 'react';
import Svg, {Path} from 'react-native-svg';

const Icon = ({width = 32, height = 32, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
    <Path
      d="M10.9908 28.0653C13.4492 29.3561 14.6784 30.0001 16 30.0001V16.0001L2.8932 9.10229C2.87415 9.13333 2.85548 9.1646 2.8372 9.19609C2 10.6157 2 12.3839 2 15.9189V16.0827C2 19.6163 2 21.3845 2.8358 22.8041C3.673 24.2251 5.1794 25.0161 8.1908 26.5967L10.9908 28.0653Z"
      fill="#F1D562"
    />
    <Path
      opacity="0.7"
      d="M23.8077 5.4048L21.0077 3.9348C18.5507 2.6454 17.3215 2 15.9999 2C14.6769 2 13.4491 2.644 10.9907 3.9348L8.19067 5.4048C5.24507 6.9504 3.73867 7.74 2.89307 9.1008L15.9999 16L29.1067 9.1022C28.2583 7.74 26.7547 6.9504 23.8077 5.4048Z"
      fill="#F1D562"
    />
    <Path
      opacity="0.5"
      d="M29.1642 9.19609C29.1455 9.16459 29.1263 9.13332 29.1068 9.10229L16 16.0001V30.0001C17.3216 30.0001 18.5508 29.3561 21.0092 28.0653L23.8092 26.5953C26.8206 25.0147 28.327 24.2251 29.1642 22.8041C30 21.3845 30 19.6163 30 16.0841V15.9203C30 12.3853 30 10.6157 29.1642 9.19609Z"
      fill="#F1D562"
    />
  </Svg>
);

export default Icon;
