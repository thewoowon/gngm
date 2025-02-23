import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {GMarkerIcon, MarkerIcon, XIcon} from '../components/Icons';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Geolocation from 'react-native-geolocation-service';
import {useDebounce} from '../hooks';
import customAxios from '../axios/customAxios';
import {Place} from '../types/get';
import {useSharedValue} from 'react-native-reanimated';
import {
  NaverMapView,
  Region,
  NaverMapMarkerOverlay,
  MapType,
  Camera,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import {
  RESULTS,
  PERMISSIONS,
  request,
  requestLocationAccuracy,
  requestMultiple,
} from 'react-native-permissions';

const jongloRegion: Region = {
  latitude: 37.57156058453199,
  longitude: 126.99187240251595,
  latitudeDelta: 0.38,
  longitudeDelta: 0.8,
};

const DeliveryLocationScreen = ({navigation, route}: any) => {
  const [input, setInput] = useState('');
  const debouncedString = useDebounce(input, 500);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [searchResult, setSearchResult] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // 바텀 시트의 snap 포인트 정의
  const snapPoints = useMemo(() => [154], []);

  // BottomSheet 애니메이션 값을 관리하는 shared value
  const bottomSheetTranslateY = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(-1);

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

  const formatJson = (json: any) => JSON.stringify(json, null, 2);

  const onInitialized = () => {
    setIsLoading(false);
  };

  const onCameraChanged = (args: any) => {};

  const openBottomSheet = () => bottomSheetRef.current?.snapToIndex(0);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        setIsLoading(false);
      },
      () => {
        // Alert.alert('위치 오류', '현재 위치를 가져올 수 없습니다.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const replaceHtmlWithText = (htmlString: string) => {
    return htmlString.split(/(<b>.*?<\/b>)/g).map((part, index) => {
      if (part.startsWith('<b>') && part.endsWith('</b>')) {
        // <b> 태그를 <Text style>로 변환
        return (
          <Text key={index} style={styles.boldText}>
            {part.replace(/<\/?b>/g, '')}
          </Text>
        );
      }
      return part;
    });
  };

  const fetchSearchPlaces = async () => {
    try {
      const response = await customAxios.get(`/map/places/${debouncedString}`);
      if (response.status !== 200) {
        throw new Error('장소 목록 조회 실패');
      }
      setSearchResult(response.data);
    } catch (error: any) {
      return [];
    }
  };

  const placeHandler = (place: Place) => {
    setSelectedPlace(place);
    setSearchResult([]);
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (status === RESULTS.GRANTED) {
          await requestLocationAccuracy({purposeKey: 'commonPurpose'});
          getCurrentLocation();
        } else {
          Alert.alert(
            '권한 필요',
            '위치 권한을 허용해야 지도를 사용할 수 있습니다.',
          );
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
        }
      }
    } catch (error) {
      console.error('권한 요청 오류:', error);
    }
  };

  const confirmHandler = () => {
    bottomSheetRef.current?.close();
    navigation.popTo('DeliveryCreate', {...route.params, place: selectedPlace});
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      // ref.current?.setLocationTrackingMode('Follow');
      ref.current?.animateCameraTo({
        latitude: jongloRegion.latitude,
        longitude: jongloRegion.longitude,
        zoom: 16.5,
      });
    }
  }, [currentLocation]);

  useEffect(() => {
    if (debouncedString.length >= 2) fetchSearchPlaces();
  }, [debouncedString]);

  useEffect(() => {
    if (selectedPlace) {
      // mapx -> 1270475020(경도, longitude) mapy -> 375173050(위도, latitude)
      const {mapx, mapy} = selectedPlace;
      const latitude = parseFloat(mapy.slice(0, 2) + '.' + mapy.slice(2));
      const longitude = parseFloat(mapx.slice(0, 3) + '.' + mapx.slice(3));
      ref.current?.animateCameraTo({
        latitude,
        longitude,
        zoom: 16.5,
      });
      openBottomSheet();
    }
  }, [selectedPlace]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.header}>
          {/* 상단 헤더 */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'absolute',
              left: 16,
            }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <XIcon />
            </Pressable>
          </View>
          <Text style={styles.headerText}>{'위치 선택'}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 6,
            paddingBottom: 12,
            gap: 12,
          }}>
          <TextInput
            style={styles.titleInput}
            placeholder="장소명으로 검색"
            value={input}
            onChangeText={setInput}
          />
          {input.length > 0 && (
            <Pressable
              onPress={() => {
                setInput('');
                setSearchResult([]);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  fontFamily: 'Pretendard-Medium',
                  color: '#1B1B1B',
                }}>
                취소
              </Text>
            </Pressable>
          )}
        </View>
        <View style={styles.container}>
          <View style={styles.mapContainer}>
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
                {selectedPlace && (
                  <NaverMapMarkerOverlay
                    latitude={parseFloat(
                      selectedPlace.mapy.slice(0, 2) +
                        '.' +
                        selectedPlace.mapy.slice(2),
                    )}
                    longitude={parseFloat(
                      selectedPlace.mapx.slice(0, 3) +
                        '.' +
                        selectedPlace.mapx.slice(3),
                    )}
                    anchor={{x: 0.5, y: 1}}
                    width={35}
                    height={38}
                    // caption={{
                    //   text: selectedPlace.title,
                    //   textSize: 10,
                    //   color: 'black',
                    //   haloColor: 'white',
                    // }}
                    onTap={() => openBottomSheet()}
                    children={
                      <Pressable style={styles.gMarker}>
                        <GMarkerIcon />
                      </Pressable>
                    }
                  />
                )}

                {/* 현재 위치 마커 */}
                {currentLocation && (
                  <NaverMapMarkerOverlay
                    latitude={currentLocation.latitude}
                    longitude={currentLocation.longitude}
                    anchor={{x: 0.5, y: 1}}
                    width={35}
                    height={38}
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
            </View>
          </View>
          {searchResult.length > 0 && (
            <ScrollView style={styles.searchBox}>
              {searchResult.map((place, index) => {
                return (
                  <Pressable
                    key={`${place.title}-${index}`}
                    style={({pressed}) => [
                      styles.searchItem,
                      {backgroundColor: pressed ? '#F4F5F5' : 'white'},
                    ]}
                    onPress={() => {
                      placeHandler(place);
                    }}>
                    <Text style={styles.searchItemText}>
                      {replaceHtmlWithText(place.title)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          // BottomSheet는 처음에 펼쳐진 상태로 시작
          index={-1}
          // 일단 스냅 포인트는 300, 550으로 설정
          handleIndicatorStyle={{
            display: 'none',
          }}
          containerStyle={{
            zIndex: 3,
          }}
          // dim 처리
          snapPoints={snapPoints}
          enablePanDownToClose
          enableDynamicSizing={false}
          onAnimate={(fromIndex, toIndex) => {
            if (toIndex === 0) {
              setCurrentIndex(0);
              bottomSheetTranslateY.value = 0;
            } else {
              setCurrentIndex(-1);
              bottomSheetTranslateY.value = 0;
            }
            ``;
          }}>
          <BottomSheetView
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 20,
              paddingTop: 6,
            }}>
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 4,
              }}>
              <MarkerIcon color={'#1B1B1B'} />
              <Text style={styles.addressText}>{selectedPlace?.address}</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Pressable
                onPress={confirmHandler}
                style={({pressed}) => [
                  styles.baseButton,
                  {backgroundColor: pressed ? '#0BBDA1' : '#1CD7AE'},
                ]}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontFamily: 'Pretendard-SemiBold',
                  }}>
                  확인
                </Text>
              </Pressable>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundStyle: {
    flex: 1,
    width: '100%',
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: 20,
  },
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 11,
    maxHeight: 50,
  },
  headerText: {
    color: '#181818',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#1B1B1B',
    lineHeight: 22,
  },
  titleInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E6EAED',
    borderRadius: 8,
    padding: 12,
  },
  searchBox: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  searchItem: {
    paddingTop: 13,
    paddingBottom: 13,
    borderBottomColor: '#F2F4F6',
    borderBottomWidth: 0.5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  searchItemText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 22,
    color: '#1B1B1B',
  },
  boldText: {
    fontFamily: 'Pretendard-Bold',
    color: '#1CD7AE',
  },
  gMarker: {
    width: 36,
    height: 37,
  },
  baseButton: {
    flex: 1,
    padding: 16,
    borderRadius: 6,
    backgroundColor: '#1CD7AE',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  addressText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    color: '#1B1B1B',
  },
});

export default DeliveryLocationScreen;
