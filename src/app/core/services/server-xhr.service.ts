import { XhrFactory } from '@angular/common';
import { Injectable } from '@angular/core';
import * as xhr2 from 'xhr2';

/**
 * Overrides the default XhrFactoru server side, to allow us to set cookies in requests to the
 * backend. This was added to be able to perform a working XSRF request from the node server, as it
 * needs to set a cookie for the XSRF token
 */
@Injectable()
export class ServerXhrService implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.prototype._restrictedHeaders.cookie = false;
    return new xhr2.XMLHttpRequest();
  }
}
