import { TestBed } from '@angular/core/testing';

import { dsoContextBreadcrumbResolver } from './dso-context-breadcrumb.resolver';
import { DsoContextBreadcrumbService } from './dso-context-breadcrumb.service';

describe('dsoContextBreadcrumbResolver', () => {
  let breadcrumbService: jasmine.SpyObj<DsoContextBreadcrumbService>;
  let uuid: string;
  let breadcrumbUrl: string;
  let currentUrl: string;
  let breadcrumbKey: string;

  beforeEach(() => {
    uuid = '1234-65487-12354-1235';
    breadcrumbUrl = '/collections/' + uuid;
    currentUrl = breadcrumbUrl + '/edit';
    breadcrumbKey = 'statistics';

    breadcrumbService = jasmine.createSpyObj('DsoContextBreadcrumbService', ['someMethod']);

    TestBed.configureTestingModule({
      providers: [
        { provide: DsoContextBreadcrumbService, useValue: breadcrumbService },
      ],
    });
  });

  it('should resolve a breadcrumb config for the correct DSO', () => {
    const resolvedConfig = TestBed.runInInjectionContext(() => {
      return dsoContextBreadcrumbResolver(
        { params: { id: uuid }, data: { breadcrumbKey: breadcrumbKey } } as any,
        { url: currentUrl } as any,
      );
    });

    const expectedConfig = { provider: breadcrumbService, key: uuid + '::' + breadcrumbKey, url: breadcrumbUrl };
    expect(resolvedConfig).toEqual(expectedConfig);
  });
});
