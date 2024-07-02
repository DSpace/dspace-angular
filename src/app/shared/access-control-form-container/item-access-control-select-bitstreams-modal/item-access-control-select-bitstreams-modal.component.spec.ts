import {
  EventEmitter,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { Item } from '../../../core/shared/item.model';
import { ObjectCollectionComponent } from '../../object-collection/object-collection.component';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';
import { FollowLinkConfig } from '../../utils/follow-link-config.model';
import { ItemAccessControlSelectBitstreamsModalComponent } from './item-access-control-select-bitstreams-modal.component';

describe('ItemAccessControlSelectBitstreamsModalComponent', () => {
  let component: ItemAccessControlSelectBitstreamsModalComponent;
  let fixture: ComponentFixture<ItemAccessControlSelectBitstreamsModalComponent>;

  const mockBitstreamDataService = {
    findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
      return createSuccessfulRemoteDataObject$(createPaginatedList([]));
    },
  };

  const translateServiceStub = {
    get: () => observableOf('test-message'),
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
        { provide: PaginationService, useValue: {} },
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
