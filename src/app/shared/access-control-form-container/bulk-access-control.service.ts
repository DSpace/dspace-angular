import { Injectable } from '@angular/core';

import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';

@Injectable({ providedIn: 'root' })
export class BulkAccessControlService {
  constructor(private scriptService: ScriptDataService) {}

  createPayloadFile(payload: any) {
    console.log('execute', payload);

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
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
