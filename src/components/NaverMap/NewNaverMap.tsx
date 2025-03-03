import {
  NaverMapView,
  Region,
  NaverMapMarkerOverlay,
  MapType,
  NaverMapViewRef,
  CameraChangeReason,
} from '@mj-studio/react-native-naver-map';
import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
} from 'react-native';
import {RESULTS} from 'react-native-permissions';
import {DeliveryMarkerIcon} from '../Icons';
import {ArticleType} from '../../types/get';
import {usePermission} from '../../contexts';

type NewNaverMapProps = {
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  getCurrentLocation: () => void;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  markers: {
    articleId: number;
    latitude: number;
    longitude: number;
    articleType: ArticleType;
  }[];
};

const NewNaverMap = ({
  openBottomSheet,
  closeBottomSheet,
  getCurrentLocation,
  currentLocation,
  isLoading,
  setIsLoading,
  markers,
}: NewNaverMapProps) => {
  const jongloRegion: Region = {
    latitude: 37.57156058453199,
    longitude: 126.99187240251595,
    latitudeDelta: 0.38,
    longitudeDelta: 0.8,
  };

  const ref = useRef<NaverMapViewRef>(null);
  const mapType: MapType = 'Basic';
  const indoor = false;
  const symbolScale = 1.1;
  const nightMode = true;
  const compass = false;
  const indoorLevelPicker = false;
  const scaleBar = false;
  const locationButton = false;
  const zoomControls = false;
  const extentBoundedInKorea = true;

  const onInitialized = () => {
    setIsLoading(false);
  };

  // 카메라 변경 이벤트 핸들러 (사용자 제스처 시 bottom sheet 닫음)
  const onCameraChanged = (args: any) => {
    const reason: CameraChangeReason = args.reason;
    if (reason === 'Gesture') {
      closeBottomSheet();
    }
  };

  const onTapAndFollow = (latitude: number, longitude: number) => {
    ref.current?.setLocationTrackingMode('Follow');
    ref.current?.animateCameraTo({
      latitude,
      longitude,
      zoom: 16.5,
    });
    openBottomSheet();
  };

  useEffect(() => {
    ref.current?.setLocationTrackingMode('Follow');
    if (currentLocation) {
      ref.current?.animateCameraTo({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        zoom: 16.5,
      });
    } else {
      ref.current?.animateCameraTo({
        latitude: jongloRegion.latitude,
        longitude: jongloRegion.longitude,
        zoom: 16.5,
      });
    }
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <View style={{flex: 1, position: 'relative'}}>
        <NaverMapView
          ref={ref}
          style={{flex: 1}}
          mapType={mapType}
          initialRegion={jongloRegion}
          symbolScale={symbolScale}
          locale={'ko'}
          isIndoorEnabled={indoor}
          isNightModeEnabled={nightMode}
          isShowCompass={compass}
          isShowIndoorLevelPicker={indoorLevelPicker}
          isExtentBoundedInKorea={extentBoundedInKorea}
          isShowScaleBar={scaleBar}
          isShowLocationButton={locationButton}
          isShowZoomControls={zoomControls}
          maxZoom={18}
          minZoom={5}
          onInitialized={onInitialized}
          onCameraChanged={onCameraChanged}>
          {markers.map((marker, index) => (
            <NaverMapMarkerOverlay
              key={index}
              latitude={marker.latitude}
              longitude={marker.longitude}
              anchor={{x: 0.5, y: 1}}
              width={35}
              height={35}
              onTap={() => onTapAndFollow(marker.latitude, marker.longitude)}>
              <Pressable style={styles.deliveryMarker}>
                <DeliveryMarkerIcon />
              </Pressable>
            </NaverMapMarkerOverlay>
          ))}
        </NaverMapView>
        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#A9A9A9" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryMarker: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1CD7AE',
    borderRadius: 20,
    overflow: 'hidden',
  },
  loading: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    position: 'absolute',
    zIndex: 10,
  },
});

export default NewNaverMap;
