import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../default-change-analyzer.service';
import { Script } from '../../../process-page/scripts/script.model';
import { ProcessParameter } from '../../../process-page/processes/process-parameter.model';
import { map, take } from 'rxjs/operators';
import { URLCombiner } from '../../url-combiner/url-combiner';
import { RemoteData } from '../remote-data';
import { MultipartPostRequest, RestRequest } from '../request.models';
import { RequestService } from '../request.service';
import { Observable } from 'rxjs';
import { dataService } from '../../cache/builders/build-decorators';
import { SCRIPT } from '../../../process-page/scripts/script.resource-type';
import { Process } from '../../../process-page/processes/process.model';

export const METADATA_IMPORT_SCRIPT_NAME = 'metadata-import';
export const METADATA_EXPORT_SCRIPT_NAME = 'metadata-export';

@Injectable()
@dataService(SCRIPT)
export class ScriptDataService extends DataService<Script> {
  protected linkPath = 'scripts';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Script>) {
    super();
  }

  public invoke(scriptName: string, parameters: ProcessParameter[], files: File[]): Observable<RemoteData<Process>> {
    const requestId = this.requestService.generateRequestId();
    this.getBrowseEndpoint().pipe(
      take(1),
      map((endpoint: string) => new URLCombiner(endpoint, scriptName, 'processes').toString()),
      map((endpoint: string) => {
        const body = this.getInvocationFormData(parameters, files);
        return new MultipartPostRequest(requestId, endpoint, body);
      })
    ).subscribe((request: RestRequest) => this.requestService.send(request));

    return this.rdbService.buildFromRequestUUID<Process>(requestId);
  }

  private getInvocationFormData(parameters: ProcessParameter[], files: File[]): FormData {
    const form: FormData = new FormData();
    form.set('properties', JSON.stringify(parameters));
    files.forEach((file: File) => {
      form.append('file', file);
    });
    return form;
  }
}
