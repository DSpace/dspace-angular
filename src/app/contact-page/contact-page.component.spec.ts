import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPageComponent } from './contact-page.component';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('ContactPageComponent', () => {
  let component: ContactPageComponent;
  let fixture: ComponentFixture<ContactPageComponent>;
  let mockConfigService: any;

  beforeEach(async () => {
    mockConfigService = jasmine.createSpyObj(['findByPropertyName']);

    await TestBed.configureTestingModule({
      declarations: [ ContactPageComponent ],
      imports: [ TranslateModule.forRoot() ], // Add this line
      providers: [
        { provide: ConfigurationDataService, useValue: mockConfigService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPageComponent);
    component = fixture.componentInstance;
    mockConfigService.findByPropertyName.and.returnValue(of({
      payload: {
        values: ['test.email@example.com']
      }
    }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call findByPropertyName on init', () => {
    expect(mockConfigService.findByPropertyName).toHaveBeenCalledWith('lr.help.mail');
  });

  it('should set emailToContact from service on init', () => {
    expect(component.emailToContact).toBe('test.email@example.com');
  });
});
