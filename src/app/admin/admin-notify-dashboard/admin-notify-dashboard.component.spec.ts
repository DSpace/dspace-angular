import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../core/shared/search/search.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { AdminNotifySearchResult } from './models/admin-notify-message-search-result.model';
import { AdminNotifyMessage } from './models/admin-notify-message.model';

describe('AdminNotifyDashboardComponent', () => {
  let component: AdminNotifyDashboardComponent;
  let fixture: ComponentFixture<AdminNotifyDashboardComponent>;

  let item1;
  let item2;
  let item3;
  let searchResult1;
  let searchResult2;
  let searchResult3;
  let results;

  const mockBoxes = [
    { title: 'admin-notify-dashboard.received-ldn', boxes: [ undefined, undefined, undefined, undefined, undefined ] },
    { title: 'admin-notify-dashboard.generated-ldn', boxes: [ undefined, undefined, undefined, undefined, undefined ] }
  ];

  beforeEach(async () => {
    item1 = Object.assign(new AdminNotifyMessage(), { uuid: 'e1c51c69-896d-42dc-8221-1d5f2ad5516e' });
    item2 = Object.assign(new AdminNotifyMessage(), { uuid: 'c8279647-1acc-41ae-b036-951d5f65649b' });
    item3 = Object.assign(new AdminNotifyMessage(), { uuid: 'c3bcbff5-ec0c-4831-8e4c-94b9c933ccac' });
    searchResult1 = Object.assign(new AdminNotifySearchResult(), { indexableObject: item1 });
    searchResult2 = Object.assign(new AdminNotifySearchResult(), { indexableObject: item2 });
    searchResult3 = Object.assign(new AdminNotifySearchResult(), { indexableObject: item3 });
    results = buildPaginatedList(undefined, [searchResult1, searchResult2, searchResult3]);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgbNavModule],
      declarations: [ AdminNotifyDashboardComponent ],
      providers: [{ provide: SearchService, useValue: { search: () => createSuccessfulRemoteDataObject$(results)}}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (done) => {
    component.notifyMetricsRows$.subscribe(boxes => {
      expect(boxes).toEqual(mockBoxes);
      done();
    });
    expect(component).toBeTruthy();
  });
});
