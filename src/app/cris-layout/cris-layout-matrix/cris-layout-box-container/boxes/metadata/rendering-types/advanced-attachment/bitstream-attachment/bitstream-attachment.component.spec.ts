import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';

import { BitstreamDataService } from '../../../../../../../../core/data/bitstream-data.service';
import { TruncatableComponent } from '../../../../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { ThemedThumbnailComponent } from '../../../../../../../../thumbnail/themed-thumbnail.component';
import { AttachmentRenderComponent } from './attachment-render/attachment-render.component';
import { BitstreamAttachmentComponent } from './bitstream-attachment.component';

describe('BitstreamAttachmentComponent', () => {
  let component: BitstreamAttachmentComponent;
  let fixture: ComponentFixture<BitstreamAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), BitstreamAttachmentComponent],
      providers: [
        { provide: 'fieldProvider', useValue: {} },
        { provide: 'itemProvider', useValue: {} },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: BitstreamDataService, useValue: {} },
        { provide: TranslateService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BitstreamAttachmentComponent, { remove: { imports: [ThemedThumbnailComponent, AttachmentRenderComponent, TruncatableComponent, TruncatablePartComponent] } }).compileComponents();
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
