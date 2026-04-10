import { ProcessDataService } from '../core/data/processes/process-data.service';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { processBreadcrumbResolver } from './process-breadcrumb.resolver';
import { Process } from './processes/process.model';

describe('processBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let processDataService: ProcessDataService;
    let processBreadcrumbService: any;
    let process: Process;
    let id: string;
    let path: string;
    beforeEach(() => {
      id = '12345';
      process = Object.assign(new Process(), { id });
      path = 'rest.com/path/to/breadcrumb/12345';
      processBreadcrumbService = {};
      processDataService = {
        findById: () => createSuccessfulRemoteDataObject$(process),
      } as any;
      resolver = processBreadcrumbResolver;
    });

    it('should resolve the breadcrumb config', (done) => {
      const resolvedConfig = resolver(
        { data: { breadcrumbKey: process }, params: { id: id } } as any,
        { url: path } as any,
        processBreadcrumbService,
        processDataService,
      );
      const expectedConfig = { provider: processBreadcrumbService, key: process, url: path };
      resolvedConfig.subscribe((config) => {
        expect(config).toEqual(expectedConfig);
        done();
      });
    });

    it('should resolve throw an error when no breadcrumbKey is defined', () => {
      expect(() => {
        resolver({ data: {} } as any, undefined, processBreadcrumbService, processDataService);
      }).toThrow();
    });
  });
});
