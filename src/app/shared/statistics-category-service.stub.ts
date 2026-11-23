import { StatisticsCategory } from '@dspace/core/statistics/models/statistics-category.model';
import { STATISTICS_CATEGORY } from '@dspace/core/statistics/models/statistics-category.resource-type';
import { of } from 'rxjs';


export class StatisticsCategoriesServiceStub {

  searchStatistics(uri: string, page: number, size: number, categoryId?: string, startDate?: string, endDate?: string) {
    return of([
        {
          id: 'mainReports',
          type: STATISTICS_CATEGORY,
          categoryType: 'mainReports',
          _links : {
            self : {
              href : 'https://{dspace.url}/server/api/statistics/categories/mainReports',
            },
          },
        } as StatisticsCategory,
        {
          id: 'testReports',
          type: STATISTICS_CATEGORY,
          categoryType: 'testReports',
          _links : {
            self : {
              href : 'https://{dspace.url}/server/api/statistics/categories/testReports',
            },
          },
        },
    ]);
  }

  getCategoriesStatistics() {
    return;
  }
}
