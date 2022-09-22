import { Handle } from '../../core/handle/handle.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { PageInfo } from '../../core/shared/page-info.model';

/**
 * The Handle mock for testing.
 */

export const selectedHandleId = 1;

export const successfulResponse = {
  response: {
    statusCode: 200
  }};

export const mockHandle = Object.assign(new Handle(), {
  id: selectedHandleId,
  handle: '123456',
  resourceTypeID: 0,
  url: 'handle.url',
  _links: {
    self: {
      href: 'url.123456'
    }
  }
});

export const mockHandleRD$ = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [mockHandle]));
export const mockCreatedHandleRD$ = createSuccessfulRemoteDataObject$(mockHandle);
