import { ItemEditBitstreamBundleComponent } from './item-edit-bitstream-bundle.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { Bundle } from '../../../../core/shared/bundle.model';
import { ResponsiveTableSizes } from '../../../../shared/responsive-table-sizes/responsive-table-sizes';
import { ResponsiveColumnSizes } from '../../../../shared/responsive-table-sizes/responsive-column-sizes';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { FieldChangeType } from '../../../../core/data/object-updates/field-change-type.model';

describe('ItemEditBitstreamBundleComponent', () => {
  let comp: ItemEditBitstreamBundleComponent;
  let fixture: ComponentFixture<ItemEditBitstreamBundleComponent>;
  let viewContainerRef: ViewContainerRef;
  let objectUpdatesService: ObjectUpdatesService;

  const columnSizes = new ResponsiveTableSizes([
    new ResponsiveColumnSizes(2, 2, 3, 4, 4),
    new ResponsiveColumnSizes(2, 3, 3, 3, 3),
    new ResponsiveColumnSizes(2, 2, 2, 2, 2),
    new ResponsiveColumnSizes(6, 5, 4, 3, 3)
  ]);

  const item = Object.assign(new Item(), {
    id: 'item-1',
    uuid: 'item-1'
  });
  const bundle = Object.assign(new Bundle(), {
    id: 'bundle-1',
    uuid: 'bundle-1',
    _links: {
      self: { href: 'bundle-1-selflink' }
    }
  });

  beforeEach(waitForAsync(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService', {
      saveRemoveFieldUpdate: {},
      removeSingleFieldUpdate: {}
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ItemEditBitstreamBundleComponent],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: DSONameService, useValue: { getName: () => 'Test Bundle' } }
      ],
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
    comp.columnSizes = columnSizes;
    comp.bundleUpdatesUrl = 'item-1-selflink/bundles';
    viewContainerRef = (comp as any).viewContainerRef;
    spyOn(viewContainerRef, 'createEmbeddedView').and.callThrough();
    fixture.detectChanges();
  });

  it('should create an embedded view of the component', () => {
    expect(viewContainerRef.createEmbeddedView).toHaveBeenCalled();
  });

  it('should center the bundle action buttons', () => {
    const actionButtons = fixture.debugElement.query(By.css('.bundle-action-buttons'));

    expect(actionButtons.parent.classes['text-center']).toBeTrue();
  });

  it('should use the danger state when the bundle is marked for removal', () => {
    comp.bundleUpdate = {
      field: bundle,
      changeType: FieldChangeType.REMOVE
    };
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.bundle-row')).classes['table-danger']).toBeTrue();
  });

  it('should use non-submitting remove and undo buttons', () => {
    const removeButton = fixture.debugElement.query(By.css('button.btn-outline-danger'));
    const undoButton = fixture.debugElement.query(By.css('button.btn-outline-warning'));

    expect(removeButton.attributes.type).toBe('button');
    expect(undoButton.attributes.type).toBe('button');
  });

  describe('bundle removal', () => {
    it('should register removal with object updates', () => {
      comp.removeBundle();

      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(comp.bundleUpdatesUrl, bundle);
    });

    it('should undo removal with object updates', () => {
      comp.undoBundleRemove();

      expect(objectUpdatesService.removeSingleFieldUpdate).toHaveBeenCalledWith(comp.bundleUpdatesUrl, bundle.uuid);
    });
  });
});
