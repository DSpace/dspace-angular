import { PatchOperationService } from './patch-operation.service';
import { MetadataValue, MetadatumViewModel } from '../../../shared/metadata.models';
import { FieldUpdate } from '../object-updates.reducer';
import { Operation } from 'fast-json-patch';
import { FieldChangeType } from '../object-updates.actions';
import { InjectionToken } from '@angular/core';

export const METADATA_PATCH_OPERATION_SERVICE_TOKEN = new InjectionToken<MetadataPatchOperationService>('MetadataPatchOperationService', {
  providedIn: 'root',
  factory: () => new MetadataPatchOperationService(),
});

export class MetadataPatchOperationService implements PatchOperationService<MetadatumViewModel> {
  fieldUpdateToPatchOperation(fieldUpdate: FieldUpdate): Operation {
    const metadatum = fieldUpdate.field as MetadatumViewModel;
    const path = `/metadata/${metadatum.key}`;
    const val = {
      value: metadatum.value,
      language: metadatum.language
    }

    switch (fieldUpdate.changeType) {
      case FieldChangeType.ADD: return { op: 'add', path, value: [ val ] };
      case FieldChangeType.REMOVE: return { op: 'remove', path: `${path}/${metadatum.place}` };
      case FieldChangeType.UPDATE: return { op: 'replace', path: `${path}/${metadatum.place}`, value: val };
      default: return undefined;
    }
  }
}
