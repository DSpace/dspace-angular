import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function dateToGMTString(date: Date | NgbDateStruct) {
  let year = ((date instanceof Date) ? date.getFullYear() : date.year).toString();
  let month = ((date instanceof Date) ? date.getMonth() + 1 : date.month).toString();
  let day = ((date instanceof Date) ? date.getDate() : date.day).toString();
  let hour = ((date instanceof Date) ? date.getHours() : 0).toString();
  let min = ((date instanceof Date) ? date.getMinutes() : 0).toString();
  let sec = ((date instanceof Date) ? date.getSeconds() : 0).toString();

  year = (year.length === 1) ? '0' + year : year;
  month = (month.length === 1) ? '0' + month : month;
  day = (day.length === 1) ? '0' + day : day;
  hour = (hour.length === 1) ? '0' + hour : hour;
  min = (min.length === 1) ? '0' + min : min;
  sec = (sec.length === 1) ? '0' + sec : sec;
  return `${year}-${month}-${day}T${hour}:${min}:${sec}Z`;

}
