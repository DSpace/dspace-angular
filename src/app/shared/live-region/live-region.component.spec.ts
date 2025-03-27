import { LiveRegionComponent } from './live-region.component';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LiveRegionService } from './live-region.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('liveRegionComponent', () => {
  let fixture: ComponentFixture<LiveRegionComponent>;
  let liveRegionService: LiveRegionService;

  beforeEach(waitForAsync(() => {
    liveRegionService = jasmine.createSpyObj('liveRegionService', {
      getMessages$: of(['message1', 'message2']),
      getLiveRegionVisibility: false,
      setLiveRegionVisibility: undefined,
    });

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [LiveRegionComponent],
      providers: [
        { provide: LiveRegionService, useValue: liveRegionService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveRegionComponent);
    fixture.detectChanges();
  });

  it('should contain the current live region messages', () => {
    const messages = fixture.debugElement.queryAll(By.css('.live-region-message'));

    expect(messages.length).toEqual(2);
    expect(messages[0].nativeElement.textContent).toEqual('message1');
    expect(messages[1].nativeElement.textContent).toEqual('message2');
  });

  it('should respect the live region visibility', () => {
    const liveRegion = fixture.debugElement.query(By.css('.live-region'));
    expect(liveRegion).toBeDefined();

    const liveRegionHidden = fixture.debugElement.query(By.css('.visually-hidden'));
    expect(liveRegionHidden).toBeDefined();

    liveRegionService.getLiveRegionVisibility = jasmine.createSpy('getLiveRegionVisibility').and.returnValue(true);
    fixture = TestBed.createComponent(LiveRegionComponent);
    fixture.detectChanges();

    const liveRegionVisible  = fixture.debugElement.query(By.css('.visually-hidden'));
    expect(liveRegionVisible).toBeNull();
  });
});
