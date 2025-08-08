import {
  EventEmitter,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { FollowLinkConfig } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { ObjectCollectionComponent } from '../../object-collection/object-collection.component';
import { ItemAccessControlSelectBitstreamsModalComponent } from './item-access-control-select-bitstreams-modal.component';

describe('ItemAccessControlSelectBitstreamsModalComponent', () => {
  let component: ItemAccessControlSelectBitstreamsModalComponent;
  let fixture: ComponentFixture<ItemAccessControlSelectBitstreamsModalComponent>;

  const mockBitstreamDataService = {
    findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
      return createSuccessfulRemoteDataObject$(createPaginatedList([]));
    },
  };

  const mockPaginationService = new PaginationServiceStub();

  const translateServiceStub = {
    get: () => of('test-message'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAccessControlSelectBitstreamsModalComponent],
      providers: [
        NgbActiveModal,
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: PaginationService, useValue: mockPaginationService },
        { provide: TranslateService, useValue: translateServiceStub },
      ],
    })
      .overrideComponent(ItemAccessControlSelectBitstreamsModalComponent, {
        remove: {
          imports: [ObjectCollectionComponent],
        },
        add: {
          imports: [MockTranslatePipe],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAccessControlSelectBitstreamsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Pipe({
  // eslint-disable-next-line @angular-eslint/pipe-prefix
  name: 'translate',
  standalone: true,
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
