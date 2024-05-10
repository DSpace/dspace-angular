import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchConfigurationServiceStub } from '../../../../shared/testing/search-configuration-service.stub';
import { AdminNotifyLogsResultComponent } from '../admin-notify-logs-result/admin-notify-logs-result.component';
import { AdminNotifyIncomingComponent } from './admin-notify-incoming.component';

describe('AdminNotifyIncomingComponent', () => {
  let component: AdminNotifyIncomingComponent;
  let fixture: ComponentFixture<AdminNotifyIncomingComponent>;

  let searchConfigurationService: SearchConfigurationServiceStub;

  beforeEach(async () => {
    searchConfigurationService = new SearchConfigurationServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        AdminNotifyIncomingComponent,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
    }).overrideProvider(SEARCH_CONFIG_SERVICE, {
      useValue: searchConfigurationService,
    }).overrideComponent(AdminNotifyIncomingComponent, {
      remove: { imports: [AdminNotifyLogsResultComponent] },
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNotifyIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
