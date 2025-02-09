import React from 'react';
import Svg, {Polygon} from 'react-native-svg';

const UpArrowIcon = ({width = 20, height = 20, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20">
    <Polygon
      points="9 3.828 2.929 9.899 1.515 8.485 10 0 10.707 .707 18.485 8.485 17.071 9.899 11 3.828 11 20 9 20 9 3.828"
      fill={color}
    />
  </Svg>
);

export default UpArrowIcon;
