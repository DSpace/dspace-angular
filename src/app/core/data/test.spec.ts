import { select } from '@ngrx/store';
import * as ngrx from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { count, take } from 'rxjs/operators';

class TestClass {
  selectSomething(input$: Observable<any>) {
    return input$.pipe(
      select('something'),
      take(1)
    )
  }
}
describe('mockSelect', () => {
  let testClass;
  beforeEach(() => {
    spyOnProperty(ngrx, 'select').and.callFake(() => {
      return () => {
        return () => cold('a', { a: 'bingo!' });
      };
    });

    testClass = new TestClass();
  });

  it('should mock select', () => {
    const input$ = hot('a', { a: '' });
    const expected$ = hot('(b|)', { b: 'bingo!' });
    const result$ = testClass.selectSomething(input$);
    result$.pipe(count()).subscribe((t) => console.log('resykts', t));
    expected$.pipe(count()).subscribe((t) => console.log('expected', t));
    result$.subscribe((v) => console.log('result$', v));
    expected$.subscribe((v) => console.log('expected$', v));
    expect(result$).toBeObservable(expected$)
  });
})