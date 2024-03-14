import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { NotifyInfoComponent } from './notify-info.component';
import { NotifyInfoService } from './notify-info.service';

describe('NotifyInfoComponent', () => {
  let component: NotifyInfoComponent;
  let fixture: ComponentFixture<NotifyInfoComponent>;
  let notifyInfoServiceSpy: any;

  beforeEach(async () => {
    notifyInfoServiceSpy = jasmine.createSpyObj('NotifyInfoService', ['getCoarLdnLocalInboxUrls']);

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
    component.coarRestApiUrl = of([]);
    spyOn(component, 'generateCoarRestApiLinksHTML').and.returnValue(of(''));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
