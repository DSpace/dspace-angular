import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ViewMode } from '../../../core/shared/view-mode.model';
import { RouterStub } from '../../../shared/testing/router.stub';
import { AdminNotifyMetricsComponent } from './admin-notify-metrics.component';

describe('AdminNotifyMetricsComponent', () => {
  let component: AdminNotifyMetricsComponent;
  let fixture: ComponentFixture<AdminNotifyMetricsComponent>;
  let router: RouterStub;

  beforeEach(async () => {
    router = Object.assign(new RouterStub(),
      { url : '/notify-dashboard' },
    );


    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AdminNotifyMetricsComponent],
      providers: [{ provide: Router, useValue: router }],
    })
      .compileComponents();



    fixture = TestBed.createComponent(AdminNotifyMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to correct url based on config', () => {
    const searchConfig = 'test.involvedItems';
    const incomingConfig = 'NOTIFY.incoming.test';
    const outgoingConfig = 'NOTIFY.outgoing.test';
    const adminPath =  '/admin/search';
    const routeExtras = {
      queryParams: {
        configuration: searchConfig,
        view: ViewMode.ListElement,
      },
    };

    const routeExtrasTable = {
      queryParams: {
        configuration: incomingConfig,
        view: ViewMode.Table,
      },
    };

    const routeExtrasTableOutgoing = {
      queryParams: {
        configuration: outgoingConfig,
        view: ViewMode.Table,
      },
    };
    component.navigateToSelectedSearchConfig(searchConfig);
    expect(router.navigate).toHaveBeenCalledWith([adminPath], routeExtras);

    component.navigateToSelectedSearchConfig(incomingConfig);
    expect(router.navigate).toHaveBeenCalledWith(['/notify-dashboard/inbound'], routeExtrasTable);

    component.navigateToSelectedSearchConfig(outgoingConfig);
    expect(router.navigate).toHaveBeenCalledWith(['/notify-dashboard/outbound'], routeExtrasTableOutgoing);
  });
});
