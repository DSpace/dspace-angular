import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemStatisticsPageComponent } from './item-statistics-page.component';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsageReportDataService } from '../../core/statistics/usage-report-data.service';
import { of as observableOf } from 'rxjs';
import { Item } from '../../core/shared/item.model';
import { DebugElement } from '@angular/core';
import { UsageReport } from '../../core/statistics/models/usage-report.model';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';

describe('ItemStatisticsPageComponent', () => {

  let component: ItemStatisticsPageComponent;
  let de: DebugElement;
  let fixture: ComponentFixture<ItemStatisticsPageComponent>;

  beforeEach(waitForAsync(() => {

    const activatedRoute = {
      data: observableOf({
        scope: createSuccessfulRemoteDataObject(
          Object.assign(new Item(), {
            id: 'item_id',
          })
        )
      })
    };

    const router = {
    };

    const usageReportService = {
      getStatistic: (scope, type) => undefined,
    };

    spyOn(usageReportService, 'getStatistic').and.callFake(
      (scope, type) => observableOf(
        Object.assign(
          new UsageReport(), {
            id: `${scope}-${type}-report`,
            points: [],
          }
        )
      )
    );

    const nameService = {
      getName: () => observableOf('test dso name'),
    };

    const authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {}
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CommonModule,
        SharedModule,
      ],
      declarations: [
        ItemStatisticsPageComponent,
        StatisticsTableComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: UsageReportDataService, useValue: usageReportService },
        { provide: DSpaceObjectDataService, useValue: {} },
        { provide: DSONameService, useValue: nameService },
        { provide: AuthService, useValue: authService },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatisticsPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
