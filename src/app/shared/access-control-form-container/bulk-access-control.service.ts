import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { getProcessDetailRoute } from '../../process-page/process-page-routing.paths';
import { Process } from '../../process-page/processes/process.model';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { isNotEmpty } from '../empty.util';
import { NotificationsService } from '../notifications/notifications.service';
import { AccessControlFormState } from './access-control-form-container-intial-state';

export interface BulkAccessPayload {
  state: AccessControlFormState;
  bitstreamAccess: any;
  itemAccess: any;
}

/**
 * This service is used to create a payload file and execute the bulk access control script
 */
@Injectable({ providedIn: 'root' })
export class BulkAccessControlService {
  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    private scriptService: ScriptDataService,
    private translationService: TranslateService,
  ) {}

  /**
   * Create a payload file from the given payload and return the file and the url to the file
   * The created file will be used as input for the bulk access control script
   * @param payload The payload to create the file from
   */
  createPayloadFile(payload: BulkAccessPayload) {
    const content = convertToBulkAccessControlFileModel(payload);

    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });

    const file = new File([blob], 'data.json', {
      type: 'application/json',
    });

    const url = URL.createObjectURL(file);

    return { url, file };
  }

  /**
   * Execute the bulk access control script with the given uuids and file
   * @param uuids
   * @param file
   */
  executeScript(uuids: string[], file: File): Observable<boolean> {
    console.log('execute', { uuids, file });

    const params: ProcessParameter[] = [
      { name: '-f', value: file.name },
    ];
    uuids.forEach((uuid) => {
      params.push({ name: '-u', value: uuid });
    });

    return this.scriptService.invoke('bulk-access-control', params, [file]).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<Process>) => {
        if (rd.hasSucceeded) {
          const title = this.translationService.get('process.new.notification.success.title');
          const content = this.translationService.get('process.new.notification.success.content');
          this.notificationsService.success(title, content);
          if (isNotEmpty(rd.payload)) {
            this.router.navigateByUrl(getProcessDetailRoute(rd.payload.processId));
          }
          return true;
        } else {
          const title = this.translationService.get('process.new.notification.error.title');
          const content = this.translationService.get('process.new.notification.error.content');
          this.notificationsService.error(title, content);
          return false;
        }
      }),
    );
  }
}

/**
 * Convert the given payload to a BulkAccessControlFileModel
 * @param payload
 */
export const convertToBulkAccessControlFileModel = (payload: { state: AccessControlFormState, bitstreamAccess: AccessCondition[], itemAccess: AccessCondition[] }): BulkAccessControlFileModel => {
  const finalPayload: BulkAccessControlFileModel = {};

  const itemEnabled = payload.state.item.toggleStatus;
  const bitstreamEnabled = payload.state.bitstream.toggleStatus;

  if (itemEnabled) {
    finalPayload.item = {
      mode: payload.state.item.accessMode,
      accessConditions: payload.itemAccess,
    };
  }

  if (bitstreamEnabled) {
    const constraints = { uuid: [] };

    if (bitstreamEnabled && payload.state.bitstream.changesLimit === 'selected') {
      // @ts-ignore
      constraints.uuid = payload.state.bitstream.selectedBitstreams.map((x) => x.id);
    }

    finalPayload.bitstream = {
      constraints,
      mode: payload.state.bitstream.accessMode,
      accessConditions: payload.bitstreamAccess,
    };
  }

  return finalPayload;
};


export interface BulkAccessControlFileModel {
  item?: {
    mode: string;
    accessConditions: AccessCondition[];
  },
  bitstream?: {
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
