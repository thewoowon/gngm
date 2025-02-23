import {useEffect, useState} from 'react';

const loaderFrames = [
  require('../assets/images/delivery_marker.png'),
  require('../assets/images/delivery_marker.png'),
  require('../assets/images/current_marker.png'),
  require('../assets/images/delivery_marker.png'),
];

const useFrame = () => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % loaderFrames.length);
    }, 100); // 0.1초 간격으로 프레임 변경
    return () => clearInterval(interval);
  }, []);

  return {currentFrame, loaderFrames};
};

export default useFrame;
