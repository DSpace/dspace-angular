import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { of } from 'rxjs';

import { DsDatePipe } from './ds-date.pipe';

describe('DsDatePipe', () => {

  const cdrInstance = Object.assign({
    detectChanges: () => { /***/
    },
    markForCheck: () => { /***/
    },
  });

  const localeServiceInstance = Object.assign({
    getCurrentLanguageCode: () => of('en'),
  });

  const date = '2020-08-24';
  const parsedDate = 'August 24, 2020';

  let pipe: DsDatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    TestBed.runInInjectionContext(() => {
      pipe = new DsDatePipe(cdrInstance as any, localeServiceInstance as any);
    });
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should transform the given date and time', waitForAsync(() => {
    expect(pipe.transform(`${date}T11:22:33Z`)).toEqual(parsedDate);
  }));

  it('Should transform the given date (yyyy-MM-DD)', waitForAsync(() => {
    expect(pipe.transform(date)).toEqual(parsedDate);
  }));

  it('Should transform the given date (yyyy-MM)', waitForAsync(() => {
    expect(pipe.transform('2020-08')).toEqual('August 2020');
  }));

  it('Should transform the given date (YYYY)', waitForAsync(() => {
    expect(pipe.transform('2020')).toEqual('2020');
  }));

  it('Should not transform invalid dates', waitForAsync(() => {
    expect(pipe.transform('ABCDE')).toEqual('ABCDE');
  }));
});
