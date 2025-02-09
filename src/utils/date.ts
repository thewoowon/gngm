export const getMarkedDates = (year: number, month: number) => {
  const markedDates: Record<string, any> = {};
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    // 한국 시간 기준 날짜 포맷 (YYYY-MM-DD)
    const dateString = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .format(d)
      .replace(/\. /g, '-')
      .replace(/\.$/, '');

    const dayOfWeek = d.getDay();
    // 한국 기준 주말 (토요일: 6, 일요일: 0)
    if (dayOfWeek === 0) {
      markedDates[dateString] = {
        customStyles: {
          text: {color: '#FF5151'},
        },
      };
    }
    if (dayOfWeek === 6) {
      markedDates[dateString] = {
        customStyles: {
          text: {color: '#4D4DFF'},
        },
      };
    }
  }
  return markedDates;
};

export const getDatesBetween = (start: string, end: string) => {
  let dates = [];
  let currentDate = new Date(start);
  let endDate = new Date(end);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
