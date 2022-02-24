import { SetCategoryReportAction } from './statistics.action';
import { StatisticsReducer, StatisticsState } from './statistics.reducer';


describe('statistic reducer', () => {
    let initialState: StatisticsState;
    it('should properly set a category id and report id into state', () => {
        initialState = {
           reportId: null,
           categoryId: null
       };
       const action = new SetCategoryReportAction({
           categoryId: 'test1',
           reportId: 'test2'
       });
       const newState = StatisticsReducer(initialState,action);
       expect(newState).toEqual({
        categoryId: 'test1',
        reportId: 'test2'
       });
    });
});
