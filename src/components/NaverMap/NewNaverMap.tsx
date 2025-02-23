import {
  NaverMapView,
  Region,
  NaverMapMarkerOverlay,
  MapType,
  NaverMapViewRef,
  CameraChangeReason,
} from '@mj-studio/react-native-naver-map';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
  Pressable,
} from 'react-native';
import {
  RESULTS,
  PERMISSIONS,
  request,
  check,
  requestLocationAccuracy,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';
import {DeliveryMarkerIcon} from '../Icons';
import {ArticleType} from '../../types/get';
import {useFocusEffect} from '@react-navigation/native';

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

  const [permissionStatus, setPermissionStatus] = useState<
    'DENIED' | 'GRANTED' | 'BLOCKED' | 'UNAVAILABLE'
  >('GRANTED');

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

  /** 🔹 위치 권한 확인 및 요청 */
  const checkLocationPermission = useCallback(async () => {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });
    if (!permission) return;

    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      setPermissionStatus('GRANTED');
      await requestLocationAccuracy({purposeKey: 'commonPurpose'});
      getCurrentLocation();
    } else if (result === RESULTS.DENIED) {
      setPermissionStatus('DENIED');
      requestLocationPermission();
    } else if (result === RESULTS.BLOCKED) {
      setPermissionStatus('BLOCKED');
    } else if (result === RESULTS.UNAVAILABLE) {
      setPermissionStatus('UNAVAILABLE');
    } else {
      setPermissionStatus('DENIED');
    }
  }, [getCurrentLocation]);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (status === RESULTS.GRANTED) {
          setPermissionStatus('GRANTED');
          await requestLocationAccuracy({purposeKey: 'commonPurpose'});
          getCurrentLocation();
        } else {
          setPermissionStatus(status as 'DENIED' | 'BLOCKED' | 'UNAVAILABLE');
          Alert.alert(
            '권한 필요',
            '위치 권한을 허용해야 지도를 사용할 수 있습니다.',
          );
          openSettings();
        }
      } else if (Platform.OS === 'android') {
        const statuses = await requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]);
        if (
          statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
            RESULTS.GRANTED ||
          statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] ===
            RESULTS.GRANTED
        ) {
          setPermissionStatus('GRANTED');
          getCurrentLocation();
        } else {
          if (
            statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
              RESULTS.BLOCKED ||
            statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] ===
              RESULTS.BLOCKED
          ) {
            setPermissionStatus('BLOCKED');
          } else {
            setPermissionStatus('DENIED');
          }
          Alert.alert(
            '권한 필요',
            '위치 권한을 허용해야 지도를 사용할 수 있습니다.',
          );
          openSettings();
        }
      }
    } catch (error) {
      console.error('권한 요청 오류:', error);
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

  // 최초 마운트 시 권한 확인
  useEffect(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  // 화면 포커스 시 권한 재확인
  useFocusEffect(
    useCallback(() => {
      checkLocationPermission();
    }, [checkLocationPermission]),
  );

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

  if (permissionStatus === 'UNAVAILABLE') {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text>이 기능은 사용할 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  if (permissionStatus === 'BLOCKED') {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text>위치 권한이 차단되었습니다.</Text>
        </View>
      </View>
    );
  }

  if (permissionStatus === 'DENIED') {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text>위치 권한이 거부되었습니다.</Text>
        </View>
      </View>
    );
  }

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
