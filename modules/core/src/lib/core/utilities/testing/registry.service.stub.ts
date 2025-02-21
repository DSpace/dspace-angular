/* eslint-disable no-empty,@typescript-eslint/no-empty-function */
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { FindListOptions } from '../../data';
import { FollowLinkConfig } from '../../data';
import { PaginatedList } from '../../data';
import { RemoteData } from '../../data';
import { MetadataField } from '@dspace/core';
import { MetadataSchema } from '@dspace/core';
import { NoContent } from '../../shared';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { createPaginatedList } from './utils.test';

/**
 * Stub class of {@link RegistryService}
 */
export class RegistryServiceStub {

  getMetadataSchemas(_options: FindListOptions = {}, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<MetadataSchema>[]): Observable<RemoteData<PaginatedList<MetadataSchema>>> {
    return createSuccessfulRemoteDataObject$(createPaginatedList());
  }

  getMetadataSchemaByPrefix(_prefix: string, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<MetadataSchema>[]): Observable<RemoteData<MetadataSchema>> {
    return createSuccessfulRemoteDataObject$(undefined);
  }

  getMetadataFieldsBySchema(_schema: MetadataSchema, _options: FindListOptions = {}, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<MetadataField>[]): Observable<RemoteData<PaginatedList<MetadataField>>> {
    return createSuccessfulRemoteDataObject$(createPaginatedList());
  }

  editMetadataSchema(_schema: MetadataSchema): void {
  }

  cancelEditMetadataSchema(): void {
  }

  getActiveMetadataSchema(): Observable<MetadataSchema> {
    return observableOf(undefined);
  }

  selectMetadataSchema(_schema: MetadataSchema): void {
  }

  deselectMetadataSchema(_schema: MetadataSchema): void {
  }

  deselectAllMetadataSchema(): void {
  }

  getSelectedMetadataSchemas(): Observable<MetadataSchema[]> {
    return observableOf([]);
  }

  editMetadataField(_field: MetadataField): void {
  }

  cancelEditMetadataField(): void {
  }

  getActiveMetadataField(): Observable<MetadataField> {
    return observableOf(undefined);
  }

  selectMetadataField(_field: MetadataField): void {
  }

  deselectMetadataField(_field: MetadataField): void {
  }

  deselectAllMetadataField(): void {
  }

  getSelectedMetadataFields(): Observable<MetadataField[]> {
    return observableOf([]);
  }

  createOrUpdateMetadataSchema(schema: MetadataSchema): Observable<MetadataSchema> {
    return observableOf(schema);
  }

  deleteMetadataSchema(_id: number): Observable<RemoteData<NoContent>> {
    return createSuccessfulRemoteDataObject$(undefined);
  }

  clearMetadataSchemaRequests(): Observable<string> {
    return observableOf('');
  }

  createMetadataField(field: MetadataField, _schema: MetadataSchema): Observable<MetadataField> {
    return observableOf(field);
  }

  updateMetadataField(field: MetadataField): Observable<MetadataField> {
    return observableOf(field);
  }

  deleteMetadataField(_id: number): Observable<RemoteData<NoContent>> {
    return createSuccessfulRemoteDataObject$(undefined);
  }

  clearMetadataFieldRequests(): void {
  }

  queryMetadataFields(_query: string, _options: FindListOptions = {}, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<MetadataField>[]): Observable<RemoteData<PaginatedList<MetadataField>>> {
    return createSuccessfulRemoteDataObject$(createPaginatedList());
  }

}
