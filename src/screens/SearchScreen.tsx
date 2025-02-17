import React, {JSX, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import {
  EngravingIcon,
  AcrylIcon,
  HammerIcon,
  OthersIcon,
  PaintIcon,
  PlasticIcon,
  PrintIcon,
  PrintingIcon,
  TreeIcon,
} from '../components/Icons/material';
import {useDebounce} from '../hooks';
import {SEARCH_DATA} from '../data';
import {DownChevronIcon, LeftArrowIcon, RingIcon} from '../components/Icons';
import useStore from '../hooks/useStore';
import {Store} from '../types/get';

export const imageMap: {
  [key: string]: any;
} = {
  'laser_1.png': require('../assets/images/laser_1.png'),
  'laser_2.png': require('../assets/images/laser_2.png'),
  'laser_3.png': require('../assets/images/laser_3.png'),
  'laser_4.png': require('../assets/images/laser_4.png'),
  'laser_5.png': require('../assets/images/laser_5.png'),
  'laser_6.png': require('../assets/images/laser_6.png'),
  'laser_7.png': require('../assets/images/laser_7.png'),
};

const materialIcons: {
  [key: string]: {
    icon: (attr: {
      width?: number;
      height?: number;
      color?: string;
    }) => JSX.Element;
    code: string;
  };
} = {
  금속가공: {icon: HammerIcon, code: 'METAL'},
  목재가공: {icon: TreeIcon, code: 'WOOD'},
  '3D프린팅': {icon: PrintingIcon, code: '3DPRINT'},
  아크릴가공: {icon: AcrylIcon, code: 'ACRYLIC'},
  인쇄: {icon: PrintIcon, code: 'PRINT'},
  각인: {icon: EngravingIcon, code: 'ENGRAVE'},
  도색: {icon: PaintIcon, code: 'PAINT'},
  플라스틱가공: {icon: PlasticIcon, code: 'PLASTIC'},
  '그 외': {icon: OthersIcon, code: 'ETC'},
};

const filterList: ('지역' | '소재' | '거리순' | '가격순')[] = [
  '지역',
  '소재',
  '거리순',
  '가격순',
];

const SearchScreen = ({navigation, route}: any) => {
  const [searchString, setSearchString] = useState('');
  const [searchResult, setSearchResult] = useState<Store[]>([]);

  const {findBySearchQueryStore, findByCategoryStore} = useStore();

  const debouncedSearchString = useDebounce(searchString, 500);

  const handleFilter =
    (filter: '지역' | '소재' | '거리순' | '가격순') => () => {
      switch (filter) {
        case '지역':
          setSearchResult(searchResult.sort(() => Math.random() - 0.5));
          break;
        case '소재':
          setSearchResult(searchResult.sort(() => Math.random() - 0.5));
          break;
        case '거리순':
          setSearchResult(searchResult.sort(() => Math.random() - 0.5));
          break;
        case '가격순':
          setSearchResult(searchResult.sort(() => Math.random() - 0.5));
          break;
        default:
          break;
      }
    };

  const fetchBySearchQueryStore = async () => {
    const result = await findBySearchQueryStore(searchString);

    if (!result) {
      setSearchResult([]);
    } else {
      setSearchResult(result);
    }
  };

  const fetchByCategoryStore = async (category: string) => {
    const result = await findByCategoryStore(category);

    if (!result) {
      setSearchResult([]);
    } else {
      setSearchResult(result);
    }
  };

  useEffect(() => {
    if (debouncedSearchString.length > 0) {
      fetchBySearchQueryStore();
    } else {
      setSearchResult([]);
    }
  }, [debouncedSearchString]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View
          style={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            paddingLeft: 20,
            paddingRight: 20,
          }}>
          <View style={styles.inputBox}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <LeftArrowIcon />
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="업체 찾기"
              placeholderTextColor={'#8E979E'}
              value={searchString}
              onChangeText={setSearchString}
            />
          </View>
          <Pressable
            style={styles.ring}
            onPress={() => {
              navigation.navigate('Notification');
            }}>
            <RingIcon />
          </Pressable>
        </View>
        {searchString.length > 0 && searchResult.length > 0 && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              borderBottomColor: '#F2F4F6',
              borderBottomWidth: 1,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 14,
              paddingBottom: 14,
            }}>
            {filterList.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  style={({pressed}) => [
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 21,
                      borderColor: '#E6EAED',
                      borderWidth: 1,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                    },
                    {backgroundColor: '#F9FAFB'},
                  ]}
                  onPress={handleFilter(item)}>
                  <Text>{item}</Text>
                  <DownChevronIcon />
                </Pressable>
              );
            })}
          </View>
        )}
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 20,
            gap: 34,
          }}>
          {searchResult.length > 0 && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 34,
              }}>
              {searchResult.map((store, index) => {
                return (
                  <Pressable
                    key={`store.${index}-${store.name}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 14,
                    }}
                    onPress={() => {
                      navigation.navigate('StoreInfo', {store});
                    }}>
                    <Image
                      source={{uri: store.representative_image || ''}}
                      style={{width: 64, height: 64, borderRadius: 6}}
                      alt={store.name}
                    />
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      }}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 5,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Pretendard-SemiBold',
                            fontSize: 16,
                            color: '#1F1F1F',
                            lineHeight: 16,
                          }}>
                          {store.name}
                        </Text>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 5,
                            paddingTop: 5,
                          }}>
                          {store.services.map((service, index) => {
                            return (
                              <View
                                key={`service.${index}-${service.name}`}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: 5,
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Pretendard-SemiBold',
                                    fontSize: 14,
                                    color: '#1CD7AE',
                                    lineHeight: 14,
                                  }}
                                  key={index}>{`${service.name} `}</Text>
                                <Text
                                  style={{
                                    fontFamily: 'Pretendard-Regular',
                                    fontSize: 14,
                                    color: '#192628',
                                    lineHeight: 14,
                                  }}>{`1${
                                  service.unit
                                } 당 ${service.price.toLocaleString(
                                  'ko-KR',
                                )}원`}</Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Pretendard-Regular',
                          fontSize: 12,
                          color: '#B1BAC0',
                        }}>{`현재 위치로부터 2.2km`}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
          {searchResult.length > 0 && searchResult.length === 0 && (
            <View
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>검색 결과가 없습니다.</Text>
            </View>
          )}
          {searchString.length === 0 && searchResult.length === 0 && (
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                padding: 11,
              }}>
              <Text
                style={{
                  fontFamily: 'Pretendard-Bold',
                  fontSize: 17,
                  color: '#394245',
                }}>
                소재
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  columnGap: 29,
                  rowGap: 22,
                }}>
                {Object.keys(materialIcons).map((key, index) => {
                  const Icon = materialIcons[key].icon;
                  const code = materialIcons[key].code;
                  return (
                    <Pressable
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                      }}
                      onPress={() => {
                        fetchByCategoryStore(code);
                      }}>
                      <Icon />
                      <Text
                        style={{
                          fontFamily: 'Pretendard-Medium',
                          fontSize: 12,
                        }}>
                        {key}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundStyle: {
    flex: 1,
  },
  inputBox: {
    flex: 1,
    height: 44,
    padding: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 100,
    backgroundColor: '#F2F4F6',
  },
  input: {
    fontSize: 16,
  },
  ring: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;
