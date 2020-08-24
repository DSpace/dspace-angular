import { DsDatePipe } from './ds-date.pipe';
import { of } from 'rxjs';

describe('DsDatePipe', () => {
  const translateServiceInstace = Object.assign({
    get: (key: string) => {
      return of('LOCALIZED_MONTH');
    }
  });
  const cdrInstance = Object.assign({
    detectChanges: () => { /***/ }
  });

  let pipe: DsDatePipe;

  beforeEach(() => {
    pipe = new DsDatePipe(
      translateServiceInstace,
      cdrInstance
    );
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should be transform the given date', () => {
    const value = pipe.transform('2020-08-24');
    expect(value).toEqual('24 LOCALIZED_MONTH 2020');
  });
});
