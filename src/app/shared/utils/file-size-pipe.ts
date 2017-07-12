import { Pipe, PipeTransform } from '@angular/core';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
 */

@Pipe({ name: 'dsFileSize' })
export class FileSizePipe implements PipeTransform {

  private units: string[] = [
    'bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB'
  ];

  transform(bytes: number = 0, precision: number = 2): string {
    let result: string;
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      result = '?';
    } else {
      let unit = 0;

      while (bytes >= 1024) {
        bytes /= 1024;
        unit++;
      }

      result = bytes.toFixed(+ precision) + ' ' + this.units[unit];
    }
    return result;
  }
}
