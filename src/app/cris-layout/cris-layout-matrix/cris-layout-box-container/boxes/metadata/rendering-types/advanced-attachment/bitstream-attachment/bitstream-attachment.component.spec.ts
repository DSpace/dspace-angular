import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';

import { BitstreamDataService } from '../../../../../../../../core/data/bitstream-data.service';
import { BitstreamAttachmentComponent } from './bitstream-attachment.component';

describe('BitstreamAttachmentComponent', () => {
  let component: BitstreamAttachmentComponent;
  let fixture: ComponentFixture<BitstreamAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitstreamAttachmentComponent ],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: 'fieldProvider', useValue: {} },
        { provide: 'itemProvider', useValue: {} },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: BitstreamDataService, useValue: {} },
        { provide: TranslateService, useValue: {} },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitstreamAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
