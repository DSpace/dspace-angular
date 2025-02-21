import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ConfigurationDataService } from '../../../../modules/core/src/lib/core/data/configuration-data.service';
import { NativeWindowMockFactory } from '../../../../modules/core/src/lib/core/mocks/mock-native-window-ref';
import { NativeWindowService } from '../../../../modules/core/src/lib/core/services/window.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { GoogleRecaptchaComponent } from './google-recaptcha.component';

describe('GoogleRecaptchaComponent', () => {

  let component: GoogleRecaptchaComponent;

  let fixture: ComponentFixture<GoogleRecaptchaComponent>;


  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: jasmine.createSpy('findByPropertyName'),
  });

  const confResponse$ = createSuccessfulRemoteDataObject$({ values: ['valid-google-recaptcha-key'] });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleRecaptchaComponent],
      providers: [
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
      ],
    })
      .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleRecaptchaComponent);
    component = fixture.componentInstance;
    configurationDataService.findByPropertyName.and.returnValues(confResponse$);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should rendered google recaptcha.',() => {
    const container = fixture.debugElement.query(By.css('.g-recaptcha'));
    expect(container).toBeTruthy();
  });
});
