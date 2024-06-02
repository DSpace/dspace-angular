import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchConfigurationServiceStub } from '../../../../shared/testing/search-configuration-service.stub';
import { AdminNotifyLogsResultComponent } from '../admin-notify-logs-result/admin-notify-logs-result.component';
import { AdminNotifyOutgoingComponent } from './admin-notify-outgoing.component';

describe('AdminNotifyOutgoingComponent', () => {
  let component: AdminNotifyOutgoingComponent;
  let fixture: ComponentFixture<AdminNotifyOutgoingComponent>;

  let searchConfigurationService: SearchConfigurationServiceStub;

  beforeEach(async () => {
    searchConfigurationService = new SearchConfigurationServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        AdminNotifyOutgoingComponent,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
    }).overrideProvider(SEARCH_CONFIG_SERVICE, {
      useValue: searchConfigurationService,
    }).overrideComponent(AdminNotifyOutgoingComponent, {
      remove: { imports: [AdminNotifyLogsResultComponent] },
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNotifyOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
