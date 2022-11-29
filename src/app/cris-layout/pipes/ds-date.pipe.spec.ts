import { DsDatePipe } from './ds-date.pipe';

describe('DsDatePipe', () => {

  const cdrInstance = Object.assign({
    detectChanges: () => { /***/ },
    markForCheck: () => { /***/ }
  });

  const localeServiceInstance = Object.assign({
    getCurrentLanguageCode: () => 'en',
  });

  const date = '2020-08-24';
  const parsedDate = 'August 24, 2020';

  let pipe: DsDatePipe;

  beforeEach(() => {
    pipe = new DsDatePipe(cdrInstance, localeServiceInstance);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should transform the given date and time', () => {
    const value = pipe.transform(`${date}T11:22:33Z`);
    expect(value).toEqual(parsedDate);
  });

  it('Should transform the given date (YYYY-MM-DD)', () => {
    const value = pipe.transform(date);
    expect(value).toEqual(parsedDate);
  });

  it('Should transform the given date (YYYY-MM)', () => {
    const value = pipe.transform('2020-08');
    expect(value).toEqual('August 2020');
  });

  it('Should transform the given date (YYYY)', () => {
    const value = pipe.transform('2020');
    expect(value).toEqual('2020');
  });

  it('Should not transform invalid dates', () => {
    const value = pipe.transform('ABCDE');
    expect(value).toEqual('ABCDE');
  });
});
