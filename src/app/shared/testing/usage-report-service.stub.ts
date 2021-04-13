import {of as observableOf } from 'rxjs';

export class UsageReportServiceStub {

    searchStatistics(uri: string, page: number, size: number, categoryId?: string, startDate?: string, endDate?: string) {
      return observableOf(
        [
            {
                'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
                'type': 'usagereport',
                'reportType': 'TotalVisits',
                'viewMode': 'chart.bar',
                'points': [
                    {
                        'label': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
                        'type': 'item',
                        'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
                        'values': {
                            'views': 3
                        }
                    }
                ],
                '_links' : {
                  'self' : {
                    'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
                  }
                }
            },
            {
                'id': '0aa1fe0c-e173-4a36-a526-5c157dedfc07_TotalVisitsPerMonth',
                'points': [
                  {
                    'id': 'September 2020',
                    'label': 'September 2020',
                    'values': {
                      'views': 0
                    },
                    'type': 'date'
                  },
                  {
                    'id': 'October 2020',
                    'label': 'October 2020',
                    'values': {
                      'views': 0
                    },
                    'type': 'date'
                  },
                  {
                    'id': 'November 2020',
                    'label': 'November 2020',
                    'values': {
                      'views': 0
                    },
                    'type': 'date'
                  },
                  {
                    'id': 'December 2020',
                    'label': 'December 2020',
                    'values': {
                      'views': 0
                    },
                    'type': 'date'
                  },
                  {
                    'id': 'January 2021',
                    'label': 'January 2021',
                    'values': {
                      'views': 0
                    },
                    'type': 'date'
                  },
                  {
                    'id': 'February 2021',
                    'label': 'February 2021',
                    'values': {
                      'views': 67
                    },
                    'type': 'date'
                  },
                  {
                    'id': 'March 2021',
                    'label': 'March 2021',
                    'values': {
                      'views': 234
                    },
                    'type': 'date'
                  }
                ],
                'type': 'usagereport',
                'reportType': 'TotalVisitsPerMonth',
                'viewMode': 'chart.line',
                '_links': {
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/statistics/usagereports/0aa1fe0c-e173-4a36-a526-5c157dedfc07_TotalVisitsPerMonth'
                  }
                }
            },
            {
                'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalDownloads',
                'type': 'usagereport',
                'reportType': 'TotalDownloads',
                'viewMode': 'chart.pie',
                'points': [
                    {
                        'label': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
                        'type': 'bitstream',
                        'id': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
                        'values': {
                            'downloads': 8
                        }
                    }
                ],
                '_links' : {
                  'self' : {
                    'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
                  }
                }
            },
            {
                'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TopCountries',
                'type': 'usagereport',
                'reportType': 'TopCountries',
                'viewMode': 'map',
                'points': [
                    {
                        'label': 'United States',
                        'type': 'country',
                        'id': 'US',
                        'values': {
                            'views': 2
                        }
                    },
                    {
                        'label': 'China',
                        'type': 'country',
                        'id': 'CN',
                        'values': {
                            'views': 1
                        }
                    }
                ],
                '_links' : {
                  'self' : {
                    'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
                  }
                }
            }
        ]
      );
    }
}
