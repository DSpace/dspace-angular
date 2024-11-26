import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { BitstreamDataService } from '../../../../../../../../core/data/bitstream-data.service';
import { MockBitstream1 } from '../../../../../../../../shared/mocks/item.mock';
import { TranslateLoaderMock } from '../../../../../../../../shared/mocks/translate-loader.mock';
import { TruncatableComponent } from '../../../../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { ThemedThumbnailComponent } from '../../../../../../../../thumbnail/themed-thumbnail.component';
import { BitstreamRenderingModelComponent } from '../../bitstream-rendering-model';
import { AttachmentRenderComponent } from './attachment-render/attachment-render.component';
import { BitstreamAttachmentComponent } from './bitstream-attachment.component';

describe('BitstreamAttachmentComponent', () => {
  let component: BitstreamAttachmentComponent;
  let fixture: ComponentFixture<BitstreamAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BitstreamAttachmentComponent,
        BitstreamRenderingModelComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: 'fieldProvider', useValue: {} },
        { provide: 'itemProvider', useValue: {} },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: BitstreamDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BitstreamAttachmentComponent, { remove: { imports: [ThemedThumbnailComponent, AttachmentRenderComponent, TruncatableComponent, TruncatablePartComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitstreamAttachmentComponent);
    component = fixture.componentInstance;
    component.attachment = MockBitstream1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
