import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyInfoComponent } from './notify-info.component';
import { NotifyInfoService } from './notify-info.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('NotifyInfoComponent', () => {
  let component: NotifyInfoComponent;
  let fixture: ComponentFixture<NotifyInfoComponent>;
  let notifyInfoServiceSpy: any;

  beforeEach(async () => {
    notifyInfoServiceSpy = jasmine.createSpyObj('NotifyInfoService', ['getCoarLdnLocalInboxUrls']);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ NotifyInfoComponent ],
      providers: [
        { provide: NotifyInfoService, useValue: notifyInfoServiceSpy }
      ]
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
