import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitstreamAttachmentComponent } from './bitstream-attachment.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BitstreamDataService } from '../../../../../../../../core/data/bitstream-data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../../shared/remote-data.utils';
import { Bitstream } from '../../../../../../../../core/shared/bitstream.model';
import { TranslateLoaderMock } from '../../../../../../../../shared/mocks/translate-loader.mock';
import { FileSizePipe } from '../../../../../../../../shared/utils/file-size-pipe';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

describe('BitstreamAttachmentComponent', () => {
  let component: BitstreamAttachmentComponent;
  let fixture: ComponentFixture<BitstreamAttachmentComponent>;
  const attachmentMock: any = Object.assign(new Bitstream(),
    {
      checkSum: {
        checkSumAlgorithm: 'MD5',
        value: 'checksum',
      },
      thumbnail: createSuccessfulRemoteDataObject$(new Bitstream())
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitstreamAttachmentComponent, FileSizePipe ],
      imports: [
        NgbTooltipModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        {provide: 'fieldProvider', useValue: {}},
        {provide: 'itemProvider', useValue: {}},
        {provide: 'renderingSubTypeProvider', useValue: ''},
        {provide: 'tabNameProvider', useValue: '' },
        {provide: BitstreamDataService, useValue: {}},
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitstreamAttachmentComponent);
    component = fixture.componentInstance;
    component.attachment = attachmentMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
