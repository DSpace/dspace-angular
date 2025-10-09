/* eslint-disable no-empty,@typescript-eslint/no-empty-function */
import {
  Observable,
  of,
} from 'rxjs';

import { FindListOptions } from '../../core/data/find-list-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { MetadataField } from '../../core/metadata/metadata-field.model';
import { MetadataSchema } from '../../core/metadata/metadata-schema.model';
import { NoContent } from '../../core/shared/NoContent.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { FollowLinkConfig } from '../utils/follow-link-config.model';
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
    return of(undefined);
  }

  selectMetadataSchema(_schema: MetadataSchema): void {
  }

  deselectMetadataSchema(_schema: MetadataSchema): void {
  }

  deselectAllMetadataSchema(): void {
  }

  getSelectedMetadataSchemas(): Observable<MetadataSchema[]> {
    return of([]);
  }

  editMetadataField(_field: MetadataField): void {
  }

  cancelEditMetadataField(): void {
  }

  getActiveMetadataField(): Observable<MetadataField> {
    return of(undefined);
  }

  selectMetadataField(_field: MetadataField): void {
  }

  deselectMetadataField(_field: MetadataField): void {
  }

  deselectAllMetadataField(): void {
  }

  getSelectedMetadataFields(): Observable<MetadataField[]> {
    return of([]);
  }

  createOrUpdateMetadataSchema(schema: MetadataSchema): Observable<MetadataSchema> {
    return of(schema);
  }

  deleteMetadataSchema(_id: number): Observable<RemoteData<NoContent>> {
    return createSuccessfulRemoteDataObject$(undefined);
  }

  clearMetadataSchemaRequests(): Observable<string> {
    return of('');
  }

  createMetadataField(field: MetadataField, _schema: MetadataSchema): Observable<MetadataField> {
    return of(field);
  }

  updateMetadataField(field: MetadataField): Observable<MetadataField> {
    return of(field);
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
