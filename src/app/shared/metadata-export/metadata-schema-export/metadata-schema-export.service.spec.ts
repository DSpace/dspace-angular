import { TestBed } from '@angular/core/testing';

import { MetadataSchemaExportService } from './metadata-schema-export.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';

describe('MetadataSchemaExportService', () => {
  let service: MetadataSchemaExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule],
      providers: [
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        {
          provide: ScriptDataService,
          useValue: jasmine.createSpyObj('scriptDataService', {
            invoke: createSuccessfulRemoteDataObject$({ processId: '45' }),
          })
        }
      ],
    });
    service = TestBed.inject(MetadataSchemaExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
})
;
