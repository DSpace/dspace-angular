import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { ProcessParameter } from '../../../process-page/processes/process-parameter.model';
import { Observable } from 'rxjs';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Process } from '../../../process-page/processes/process.model';
import { MetadataSchema } from '../../../core/metadata/metadata-schema.model';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class MetadataSchemaExportService {

  private readonly SCRIPT_NAME = 'export-schema';

  constructor(
    protected readonly notificationsService: NotificationsService,
    protected readonly translate: TranslateService,
    protected readonly scriptDataService: ScriptDataService
  ) {
  }

  public exportSchema(schema: MetadataSchema): Observable<number> {
    const schemaExportParameters: ProcessParameter[] = [
      { name: '-i', value: schema.id }
    ];
    return this.scriptDataService.invoke(this.SCRIPT_NAME, schemaExportParameters, [])
      .pipe(
        getFirstCompletedRemoteData(),
        map((rd: RemoteData<Process>) => {
          if (rd.isSuccess) {
            const payload: any = rd.payload;
            return payload.processId;
          } else {
            const title = this.translate.get('process.new.notification.error.title');
            const content = this.translate.get('process.new.notification.error.content');
            this.notificationsService.error(title, content);
            return null;
          }
        }));
  }
}
