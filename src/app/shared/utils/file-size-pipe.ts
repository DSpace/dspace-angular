import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { filesize } from 'filesize';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
 */

@Pipe({
  name: 'dsFileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number = 0, precision: number = 2): string {
    return filesize(bytes, { standard: 'jedec', round: precision });
  }
}
