export function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date)
  }

  const dayIndex = date.getDay()
  const day = days[dayIndex]

  const hours = date.getHours()
  const formattedHours = hours < 10 ? `0${hours.toString()}` : hours.toString()

  const minutes = date.getMinutes()
  const formattedMinutes = minutes < 10 ? `0${minutes.toString()}` : minutes.toString()

  return `${day} ${formattedHours}:${formattedMinutes}`
}

const days = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]