import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Inject, Injectable, Optional } from '@angular/core';
import { Response } from 'express';

@Injectable()
export class ServerResponseService {
  private response: Response;

  constructor(@Optional() @Inject(RESPONSE) response: any) {
    this.response = response;
  }

  setStatus(code: number, message?: string): this {
    if (this.response) {
      this.response.statusCode = code;
      if (message) {
        this.response.statusMessage = message;
      }
    }
    return this;
  }

  setNotFound(message = 'Not found'): this {
    return this.setStatus(404, message)
  }
}
