import dayjs from 'dayjs'



export interface UseFormatDate {
  formatMonthToString: (date: string) => string
}


export function useFormatDate(): UseFormatDate {
  
  const formatMonthToString = (date: string) => {
    return dayjs(date).format('MMMM YYYY')
  }

  return {
    formatMonthToString
  }
}