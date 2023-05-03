import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarinItemAuthorPreviewComponent } from './clarin-item-author-preview.component';
import {of} from 'rxjs';
import {ConfigurationDataService} from '../../core/data/configuration-data.service';

describe('ClarinItemAuthorPreviewComponent', () => {
  let component: ClarinItemAuthorPreviewComponent;
  let fixture: ComponentFixture<ClarinItemAuthorPreviewComponent>;

  const configurationServiceSpy = jasmine.createSpyObj('configurationService', {
    findByPropertyName: of(true),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClarinItemAuthorPreviewComponent ],
      providers: [
        { provide: ConfigurationDataService, useValue: configurationServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarinItemAuthorPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
