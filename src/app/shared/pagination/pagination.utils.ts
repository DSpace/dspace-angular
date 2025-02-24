import {
  FindListOptions,
  PaginationComponentOptions,
} from '@dspace/core';

/**
 * Transform a PaginationComponentOptions object into a FindListOptions object
 * @param pagination  The PaginationComponentOptions to transform
 * @param original    An original FindListOptions object to start from
 */
export function toFindListOptions(pagination: PaginationComponentOptions, original?: FindListOptions): FindListOptions {
  return Object.assign(new FindListOptions(), original, {
    currentPage: pagination.currentPage,
    elementsPerPage: pagination.pageSize,
  });
}
