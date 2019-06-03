import { isObject } from 'lodash';
import * as moment from 'moment';
/**
 * Returns true if the passed value is a NgbDateStruct.
 *
 * @param value
 *    The object to check
 * @return boolean
 *    true if the passed value is a NgbDateStruct, false otherwise
 */
export function isNgbDateStruct(value) {
    return isObject(value) && value.hasOwnProperty('day')
        && value.hasOwnProperty('month') && value.hasOwnProperty('year');
}
/**
 * Returns a date in simplified extended ISO format (YYYY-MM-DDTHH:mm:ssZ).
 * The timezone is always zero UTC offset, as denoted by the suffix "Z"
 *
 * @param date
 *    The date to format
 * @return string
 *    the formatted date
 */
export function dateToISOFormat(date) {
    var dateObj = (date instanceof Date) ? date : ngbDateStructToDate(date);
    var year = dateObj.getFullYear().toString();
    var month = (dateObj.getMonth() + 1).toString();
    var day = dateObj.getDate().toString();
    var hour = dateObj.getHours().toString();
    var min = dateObj.getMinutes().toString();
    var sec = dateObj.getSeconds().toString();
    year = (year.length === 1) ? '0' + year : year;
    month = (month.length === 1) ? '0' + month : month;
    day = (day.length === 1) ? '0' + day : day;
    hour = (hour.length === 1) ? '0' + hour : hour;
    min = (min.length === 1) ? '0' + min : min;
    sec = (sec.length === 1) ? '0' + sec : sec;
    var dateStr = "" + year + month + day + hour + min + sec;
    return moment.utc(dateStr, 'YYYYMMDDhhmmss').format();
}
/**
 * Returns a Date object started from a NgbDateStruct object
 *
 * @param date
 *    The NgbDateStruct to convert
 * @return Date
 *    the Date object
 */
export function ngbDateStructToDate(date) {
    return new Date(date.year, (date.month - 1), date.day);
}
//# sourceMappingURL=date.util.js.map