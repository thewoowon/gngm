import React from 'react';
import Svg, {Path} from 'react-native-svg';

const ChatIcon = ({width = 24, height = 24, color = '#B1BAC0'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 5C7.403 5 4 8.073 4 11.5C4 13.514 5.141 15.372 7.042 16.596C7.78 17.072 7.981 17.999 8.014 18.818C8.767 18.508 9.272 17.658 10.186 17.832C10.7693 17.9427 11.374 17.9987 12 18C16.597 18 20 14.927 20 11.5C20 8.073 16.597 5 12 5ZM2 11.5C2 6.643 6.656 3 12 3C17.344 3 22 6.643 22 11.5C22 16.357 17.344 20 12 20C11.346 19.9993 10.709 19.9477 10.089 19.845C9.996 19.918 9.836 20.05 9.639 20.189C9.07 20.59 8.249 21 7 21C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20C6 19.45 6.143 18.766 5.906 18.244C3.577 16.723 2 14.298 2 11.5Z"
      fill={color}
    />
  </Svg>
);

export default ChatIcon;
