import { CleanCategoryReportAction, SetCategoryReportAction } from './statistics.action';
import { StatisticsReducer, StatisticsState } from './statistics.reducer';

describe('statistic reducer', () => {
    let initialState: StatisticsState;
    it('should properly set a category id and report id into state', () => {
        initialState = {
           reportId: null,
           categoryId: null
       };
       const action = new SetCategoryReportAction( 'test2', 'test1');
       const newState = StatisticsReducer(initialState, action);
       expect(newState).toEqual({
        categoryId: 'test1',
        reportId: 'test2'
       });
    });

  it('should clean state properly', () => {
    initialState = {
      reportId: 'test3',
      categoryId: 'test1'
    };
    const action = new CleanCategoryReportAction();
    const newState = StatisticsReducer(initialState,action);
    expect(newState).toEqual({
      categoryId: null,
      reportId: null
    });
  });
});
