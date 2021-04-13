import {of as observableOf } from 'rxjs';

export class StatisticsCategoriesServiceStub {

  searchStatistics(uri: string, page: number, size: number, categoryId?: string, startDate?: string, endDate?: string) {
    return observableOf([
        {
            'id': 'mainReports',
            'type': 'category',
            'category-type': 'mainReports',
            '_links' : {
              'self' : {
                'href' : 'https://{dspace.url}/server/api/statistics/categories/mainReports'
              }
            }
        }
    ]);
  }
}
