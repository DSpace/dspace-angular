import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailComponent } from './thumbnail.component';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { of, Observable } from 'rxjs';
import { SharedModule } from '../../../../../shared/shared.module';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { FindListOptions } from '../../../../../core/data/request.models';
import { FollowLinkConfig } from '../../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { createPaginatedList } from '../../../../../shared/testing/utils.test';

describe('ThumbnailComponent', () => {
  let component: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;

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
      metadataValue: 'thumbnail'
    }
  });

  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
    findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
      return createSuccessfulRemoteDataObject$(createPaginatedList([]));
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [ ThumbnailComponent ],
      providers: [
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.field = testField;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
