
export function dateToGMTString(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}Z`
}
