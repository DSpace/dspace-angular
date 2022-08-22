import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplacedTombstoneComponent } from './replaced-tombstone.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  ConfigurationDataService  } from '../../../core/data/configuration-data.service';
import { of } from 'rxjs';

describe('ReplacedTombstoneComponent', () => {
  let component: ReplacedTombstoneComponent;
  let fixture: ComponentFixture<ReplacedTombstoneComponent>;

  const configurationServiceSpy = jasmine.createSpyObj('configurationService', {
    findByPropertyName: of(true),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
      declarations: [ReplacedTombstoneComponent],
      providers: [
        { provide: ConfigurationDataService, useValue: configurationServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacedTombstoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
