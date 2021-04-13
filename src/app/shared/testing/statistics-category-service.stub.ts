import { of as observableOf } from 'rxjs';
import { StatisticsCategory } from '../../core/statistics/models/statistics-category.model';
import { STATISTICS_CATEGORY } from '../../core/statistics/models/statistics-category.resource-type';

export class StatisticsCategoriesServiceStub {

  searchStatistics(uri: string, page: number, size: number, categoryId?: string, startDate?: string, endDate?: string) {
    return observableOf([
        {
            id: 'mainReports',
            type: STATISTICS_CATEGORY,
            categoryType: 'mainReports',
            _links : {
              'self' : {
                'href' : 'https://{dspace.url}/server/api/statistics/categories/mainReports'
              }
            }
        } as StatisticsCategory
    ]);
  }

  getCategoriesStatistics() {
    return;
  }
}
