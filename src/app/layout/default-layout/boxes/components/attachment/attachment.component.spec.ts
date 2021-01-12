import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentComponent } from './attachment.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { Item } from '../../../../../core/shared/item.model';
import { of, Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { FindListOptions } from '../../../../../core/data/request.models';
import { FollowLinkConfig } from '../../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { createPaginatedList } from '../../../../../shared/testing/utils.test';

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
      return createSuccessfulRemoteDataObject$(createPaginatedList([]));
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
