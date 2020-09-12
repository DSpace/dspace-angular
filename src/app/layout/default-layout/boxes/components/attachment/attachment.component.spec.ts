import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentComponent } from './attachment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Item } from 'src/app/core/shared/item.model';
import { of, Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { FindListOptions } from 'src/app/core/data/request.models';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';

describe('AttachmentComponent', () => {
  let component: AttachmentComponent;
  let fixture: ComponentFixture<AttachmentComponent>;

  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.identifier.doi': [
        {
          value: 'doi:10.1392/dironix'
        }
      ]
    }
  });

  const testField = Object.assign({
    id: 1,
    label: 'Field Label',
    style: 'col-md-6',
    metadata: 'dc.identifier.doi',
    rendering: 'thumbnail',
    fieldType: 'BITSTREAM',
    bitstream: {
      bundle: 'ORIGINAL',
      metadataField: 'dc.type',
      metadataValue: 'attachment'
    }
  });

  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
    findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: Array<FollowLinkConfig<Bitstream>>): Observable<RemoteData<PaginatedList<Bitstream>>> {
      return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []));
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        SharedModule
      ],
      declarations: [ AttachmentComponent ],
      providers: [
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.field = testField;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
