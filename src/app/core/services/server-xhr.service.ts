import { XhrFactory } from '@angular/common';
import { Injectable } from '@angular/core';
import { prototype, XMLHttpRequest } from 'xhr2';

/**
 * Overrides the default XhrFactory server side, to allow us to set cookies in requests to the
 * backend. This was added to be able to perform a working XSRF request from the node server, as it
 * needs to set a cookie for the XSRF token
 */
@Injectable()
export class ServerXhrService implements XhrFactory {
  build(): XMLHttpRequest {
    prototype._restrictedHeaders.cookie = false;
    return new XMLHttpRequest();
  }
}
