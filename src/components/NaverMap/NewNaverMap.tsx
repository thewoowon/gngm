import {
  NaverMapView,
  Region,
  NaverMapMarkerOverlay,
  MapType,
  Camera,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
  Pressable,
  Linking,
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
import Geolocation from 'react-native-geolocation-service';
import {DeliveryMarkerIcon, HelloMarkerIcon} from '../Icons';
import PulseIcon from '../Icons/PulseIcon';
import {Bounce} from '../Bounce';
import {ArticleType} from '../../types/get';

type NewNaverMapProps = {
  openBottomSheet: () => void;
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
  const initialCamera: Camera = {
    latitude: jongloRegion.latitude,
    longitude: jongloRegion.longitude,
    zoom: 16.5,
    tilt: 0,
    bearing: 0,
  };
  const extentBoundedInKorea = true;

  const [permissionStatus, setPermissionStatus] = useState<
    'DENIED' | 'GRANTED' | 'BLOCKED' | 'UNAVAILABLE'
  >('GRANTED');

  const formatJson = (json: any) => JSON.stringify(json, null, 2);

  const onInitialized = () => {
    setIsLoading(false);
  };

  const onCameraChanged = (args: any) => {};

  /** 🔹 위치 권한 확인 및 요청 */
  const checkLocationPermission = async () => {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });

    if (!permission) return;

    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      await requestLocationAccuracy({purposeKey: 'common-purpose'});
      getCurrentLocation();
    } else {
      requestLocationPermission();
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (status === RESULTS.GRANTED) {
          await requestLocationAccuracy({purposeKey: 'common-purpose'});
          getCurrentLocation();
        } else {
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
          getCurrentLocation();
        } else {
          Alert.alert(
            '권한 필요',
            '위치 권한을 허용해야 지도를 사용할 수 있습니다.',
          );
          Linking.openURL('android.settings.LOCATION_SOURCE_SETTINGS');
        }
      }
    } catch (error) {
      console.error('권한 요청 오류:', error);
    }
  };

  // useEffect(() => {
  //   checkLocationPermission();
  // }, []);

  useEffect(() => {
    if (currentLocation) {
      // ref.current?.setLocationTrackingMode('Follow');
      ref.current?.animateCameraTo({
        latitude: jongloRegion.latitude,
        longitude: jongloRegion.longitude,
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
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>위치 권한이 필요합니다.</Text>
        </View>
      </View>
    );
  }

  if (permissionStatus === 'BLOCKED') {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>위치 권한이 차단되었습니다.</Text>
        </View>
      </View>
    );
  }

  if (permissionStatus === 'DENIED') {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>위치 권한이 거부되었습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}>
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
          {markers.map((address, index) => (
            <NaverMapMarkerOverlay
              key={index}
              latitude={address.latitude}
              longitude={address.longitude}
              anchor={{x: 0.5, y: 1}}
              width={35}
              height={35}
              onTap={() => openBottomSheet()}
              children={
                <Pressable style={styles.deliveryMarker}>
                  <DeliveryMarkerIcon />
                </Pressable>
              }
            />
          ))}
          {jongloRegion && (
            <NaverMapMarkerOverlay
              latitude={jongloRegion.latitude}
              longitude={jongloRegion.longitude}
              anchor={{x: 0.5, y: 1}}
              width={35}
              height={35}
              image={require('../../assets/images/current_marker.png')}
              caption={{
                text: '현재 위치',
                textSize: 16,
                color: 'black',
                haloColor: 'white',
              }}
            />
          )}
          {/* <NaverMapMarkerOverlay
            latitude={37.5711516142842}
            longitude={126.991749628086}
            onTap={() => console.log(1)}
            anchor={{x: 0.5, y: 1}}
            width={35}
            height={38}
            children={
              <Pressable style={styles.helloMarker}>
                <HelloMarkerIcon />
              </Pressable>
            }
          /> */}

          {/* 현재 위치 마커 */}
          {currentLocation && (
            <NaverMapMarkerOverlay
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              anchor={{x: 0.5, y: 1}}
              width={35}
              height={35}
              children={
                <View>
                  <View>
                    <View></View>
                  </View>
                </View>
              }
            />
          )}
        </NaverMapView>
        {isLoading && (
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
              position: 'absolute',
              zIndex: 10,
            }}>
            <ActivityIndicator size="small" color="#A9A9A9" />
          </View>
        )}
        {/* {
          // 현재 위치 텍스트
          currentLocation && (
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                zIndex: 10,
              }}>
              <Text>{`현재 위치: ${currentLocation.latitude}, ${currentLocation.longitude}`}</Text>
            </View>
          )
        } */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  deliveryMarker: {
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1CD7AE',
    borderRadius: 20,
    overflow: 'hidden',
  },
  helloMarker: {
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  outside: {
    backgroundColor: 'rgba(67, 133, 245, 0.2)',
    width: 24,
    height: 24,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  midside: {
    backgroundColor: '#FFFFFF',
    width: 13,
    height: 13,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inside: {
    backgroundColor: '#4385F5',
    width: 10,
    height: 10,
    borderRadius: 50,
  },
});

export default NewNaverMap;
