import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { REQUEST } from '../../../express.tokens';
import {
  CookieService,
  ICookieService,
} from './cookie.service';

describe(CookieService.name, () => {
  let service: ICookieService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        CookieService,
        { provide: REQUEST, useValue: {} },
      ],
    });
  }));

  beforeEach(() => {
    service = TestBed.inject(CookieService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should construct', waitForAsync(() => {
    expect(service).toBeDefined();
  }));
});
