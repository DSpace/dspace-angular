import { ItemEditBitstreamBundleComponent } from './item-edit-bitstream-bundle.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { Bundle } from '../../../../core/shared/bundle.model';

describe('ItemEditBitstreamBundleComponent', () => {
  let comp: ItemEditBitstreamBundleComponent;
  let fixture: ComponentFixture<ItemEditBitstreamBundleComponent>;
  let viewContainerRef: ViewContainerRef;

  const item = Object.assign(new Item(), {
    id: 'item-1',
    uuid: 'item-1'
  });
  const bundle = Object.assign(new Bundle(), {
    id: 'bundle-1',
    uuid: 'bundle-1',
    self: 'bundle-1-selflink'
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ItemEditBitstreamBundleComponent],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditBitstreamBundleComponent);
    comp = fixture.componentInstance;
    comp.item = item;
    comp.bundle = bundle;
    viewContainerRef = (comp as any).viewContainerRef;
    spyOn(viewContainerRef, 'createEmbeddedView');
    fixture.detectChanges();
  });

  it('should create an embedded view of the component', () => {
    expect(viewContainerRef.createEmbeddedView).toHaveBeenCalled();
  });
});
