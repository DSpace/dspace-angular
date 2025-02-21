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

import { BitstreamDataService } from '@dspace/core';
import { FindListOptions } from '@dspace/core';
import { FollowLinkConfig } from '@dspace/core';
import { PaginatedList } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { PaginationService } from '@dspace/core';
import { Bitstream } from '@dspace/core';
import { Item } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { createPaginatedList } from '@dspace/core';
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
