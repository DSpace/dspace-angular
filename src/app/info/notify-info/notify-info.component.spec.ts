import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { NotifyInfoService } from '../../core/coar-notify/notify-info/notify-info.service';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { NotifyInfoComponent } from './notify-info.component';

describe('NotifyInfoComponent', () => {
  let component: NotifyInfoComponent;
  let fixture: ComponentFixture<NotifyInfoComponent>;
  let notifyInfoServiceSpy: any;

  beforeEach(async () => {
    notifyInfoServiceSpy = jasmine.createSpyObj('NotifyInfoService', {
      getCoarLdnLocalInboxUrls: of([]),
    });

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NotifyInfoComponent],
      providers: [
        { provide: NotifyInfoService, useValue: notifyInfoServiceSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyInfoComponent);
    component = fixture.componentInstance;
    component.coarRestApiUrls$ = of('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
