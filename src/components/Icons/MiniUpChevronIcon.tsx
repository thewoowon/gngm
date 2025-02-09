import React from 'react';
import Svg, {Path, G, Defs, Rect, ClipPath} from 'react-native-svg';

const MiniUpChevronIcon = ({width = 17, height = 16, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 17 16" fill="none">
    <G clipPath="url(#clip0_971_8812)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.27879 5.52869C8.40381 5.40371 8.57334 5.3335 8.75012 5.3335C8.9269 5.3335 9.09644 5.40371 9.22145 5.52869L12.9928 9.30002C13.1142 9.42575 13.1814 9.59416 13.1799 9.76895C13.1784 9.94375 13.1083 10.111 12.9847 10.2346C12.8611 10.3582 12.6939 10.4283 12.5191 10.4298C12.3443 10.4313 12.1759 10.3641 12.0501 10.2427L8.75012 6.94269L5.45012 10.2427C5.32439 10.3641 5.15598 10.4313 4.98119 10.4298C4.80639 10.4283 4.63918 10.3582 4.51557 10.2346C4.39197 10.111 4.32186 9.94375 4.32034 9.76895C4.31882 9.59416 4.38601 9.42575 4.50745 9.30002L8.27879 5.52869Z"
        fill="#1B1B1B"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_971_8812">
        <Rect width="16" height="16" fill="white" transform="translate(0.75)" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default MiniUpChevronIcon;
