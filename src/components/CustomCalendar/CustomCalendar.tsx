import {StyleSheet, Text, View} from 'react-native';
import {Calendar, CalendarProps, LocaleConfig} from 'react-native-calendars';
import {MiniLeftChevronIcon, MiniRightChevronIcon} from '../Icons';
import {memo, useEffect, useState} from 'react';
import {getMarkedDates} from '../../utils/date';

// 한글 설정
LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

const CustomCalendar = ({
  startDate,
  setStartDate,
}: {
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [memoMarkedDates, setMemoMarkedDates] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const calendarTheme: CalendarProps = {
    // 커스터마이징 스타일 적용
    style: styles.calendar,
    theme: {
      backgroundColor: 'black',
      calendarBackground: '#ffffff',

      textSectionTitleColor: '#8E979E', // 요일 색상 설정 (월, 화, 수, ...)
      textDayHeaderFontWeight: 'medium', // 요일 폰트 굵기 설정
      textSectionTitleDisabledColor: '#d9e1e8', // 비활성화된 요일 색상 설정
      textDayHeaderFontSize: 12, // 요일 폰트 크기 설정

      selectedDayBackgroundColor: '#002920',
      selectedDayTextColor: 'white',

      todayTextColor: '#1B1B1B',
      todayBackgroundColor: '#F2F4F6',

      dayTextColor: '#2d4150',
      textDisabledColor: '#d9e1e8',

      dotColor: '#002920',
      selectedDotColor: '#002920',

      arrowColor: '#1CD7AE',
      disabledArrowColor: '#d9e1e8',
      monthTextColor: '#1B1B1B',
      indicatorColor: 'orange',

      textDayStyle: {
        color: '#1B1B1B',
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Pretendard-Regular',
      },

      textMonthFontWeight: 'semibold',
      textMonthFontFamily: 'Pretendard-SemiBold',
      textMonthFontSize: 16,
    },
    // 선택된 날짜 표시 및 마커 스타일링
    markingType: 'custom',
    markedDates: markedDates,
    onDayPress: (day: any) => {
      setStartDate(day.dateString);
      setMarkedDates({
        ...memoMarkedDates,
        [day.dateString]: {
          customStyles: {
            text: {color: 'white'},
            container: {
              backgroundColor: '#1B1B1B',
              borderRadius: 50,
            },
          },
        },
      });
    },
    onMonthChange: (date: any) => {
      const markedDates = getMarkedDates(date.year, date.month);
      setStartDate(date.dateString);
      setMemoMarkedDates(markedDates);
      setMarkedDates({
        ...markedDates,
        [date.dateString]: {
          customStyles: {
            text: {color: 'white'},
            container: {
              backgroundColor: '#1B1B1B',
              borderRadius: 50,
            },
          },
        },
      });
    },
    // 첫 요일 설정 (월요일 시작)
    firstDay: 0,
    renderArrow: direction => {
      return (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#E8FBF7',
            borderRadius: 8,
            width: 36,
            height: 36,
          }}>
          {direction === 'left' ? (
            <MiniLeftChevronIcon width={24} height={24} color="#1CD7AE" />
          ) : (
            <MiniRightChevronIcon width={24} height={24} color="#1CD7AE" />
          )}
        </View>
      );
    },
    renderHeader: date => {
      return (
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Pretendard-SemiBold',
            color: '#1B1B1B',
            lineHeight: 24,
          }}>
          {date.getMonth() + 1}월
        </Text>
      );
    },
  };

  useEffect(() => {
    if (!startDate) {
      const today = new Date();
      setMemoMarkedDates(
        getMarkedDates(today.getFullYear(), today.getMonth() + 1),
      );
      setMarkedDates({
        ...getMarkedDates(today.getFullYear(), today.getMonth() + 1),
      });
    } else {
      setMarkedDates({
        ...getMarkedDates(
          Number(startDate.split('-')[0]),
          Number(startDate.split('-')[1]),
        ),
        [startDate]: {
          customStyles: {
            text: {color: 'white'},
            container: {
              backgroundColor: '#1B1B1B',
              borderRadius: 50,
            },
          },
        },
      });
    }
  }, []);

  return <Calendar {...calendarTheme} />;
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
    elevation: 4,
    paddingLeft: 0,
    paddingRight: 0,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default memo(CustomCalendar);
