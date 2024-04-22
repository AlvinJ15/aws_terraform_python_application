const DateFormat = (date ='') => {
  if (!!!date) return ''
  return date.split(' ')[0]
}

export default DateFormat