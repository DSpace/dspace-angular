import { first } from 'rxjs/operators';

import { createSuccessfulRemoteDataObject$ } from '../../../modules/shared/utils/src/lib/utils/remote-data.utils';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';
import { itemFromWorkflowResolver } from './item-from-workflow.resolver';

describe('itemFromWorkflowResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let wfiService: WorkflowItemDataService;
    const uuid = '1234-65487-12354-1235';
    const itemUuid = '8888-8888-8888-8888';
    const wfi = {
      id: uuid,
      item: createSuccessfulRemoteDataObject$({ id: itemUuid }),
    };


    beforeEach(() => {
      wfiService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$(wfi),
      } as any;
      resolver = itemFromWorkflowResolver;
    });

    it('should resolve a an item from from the workflow item with the correct id', (done) => {
      resolver({ params: { id: uuid } } as any, undefined, wfiService)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(itemUuid);
            done();
          },
        );
    });
  });
});
