import { Injectable } from '@angular/core';

import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { AccessControlFormState } from './access-control-form-container.component';

@Injectable({ providedIn: 'root' })
export class BulkAccessControlService {
  constructor(private scriptService: ScriptDataService) {}

  createPayloadFile(payload: { state: AccessControlFormState, bitstreamAccess, itemAccess }) {
    const content = convertToBulkAccessControlFileModel(payload);

    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });

    const file = new File([blob], 'data.json', {
      type: 'application/json',
    });

    const url = URL.createObjectURL(file);
    window.open(url, '_blank'); // remove this later

    return { url, file };
  }

  executeScript(uuids: string[], file: File) {
    console.log('execute', { uuids, file });

    const params: ProcessParameter[] = [
      { name: 'uuid', value: uuids.join(',') },
    ];

    return this.scriptService.invoke('bulk-access-control', params, [file]);
  }
}

export const convertToBulkAccessControlFileModel = (payload: { state: AccessControlFormState, bitstreamAccess: AccessCondition[], itemAccess: AccessCondition[] }): BulkAccessControlFileModel => {
  const constraints = { uuid: [] };

  if (payload.state.bitstream.changesLimit === 'selected') {
    // @ts-ignore
    constraints.uuid = payload.state.bitstream.selectedBitstreams.map((x) => x.id);
  }

  return {
    item: {
      mode: payload.state.item.accessMode,
      accessConditions: payload.itemAccess
    },
    bitstream: {
      constraints,
      mode: payload.state.bitstream.accessMode,
      accessConditions: payload.bitstreamAccess
    }
  };
};


export interface BulkAccessControlFileModel {
  item: {
    mode: string;
    accessConditions: AccessCondition[];
  },
  bitstream: {
    constraints: { uuid: string[] };
    mode: string;
    accessConditions: AccessCondition[];
  }
}

interface AccessCondition {
  name: string;
  startDate?: string;
  endDate?: string;
}
