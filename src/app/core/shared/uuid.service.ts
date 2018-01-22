import { Injectable } from '@angular/core';
import * as uuidv4 from 'uuid/v4';

@Injectable()
export class UUIDService {
  generate(): string {
    return uuidv4();
  }
}
