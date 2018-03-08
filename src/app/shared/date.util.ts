import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function dateToGMTString(date: Date | NgbDateStruct) {
  if (date instanceof Date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}Z`
  } else {
    return `${date.year}-${date.month}-${date.day}T-00:00:00Z`
  }

}
