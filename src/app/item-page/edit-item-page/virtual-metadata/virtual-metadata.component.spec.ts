import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { ObjectUpdatesService } from '@dspace/core/data/object-updates/object-updates.service';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ListableObjectComponentLoaderComponent } from '../../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { getMockThemeService } from '../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../shared/theme-support/theme.service';
import { VarDirective } from '../../../shared/utils/var.directive';
import { VirtualMetadataComponent } from './virtual-metadata.component';

describe('VirtualMetadataComponent', () => {

  let comp: VirtualMetadataComponent;
  let fixture: ComponentFixture<VirtualMetadataComponent>;
  let de: DebugElement;

  let objectUpdatesService;

  const url = 'http://test-url.com/test-url';

  let item;
  let relatedItem;
  let relationshipId;

  beforeEach(() => {

    relationshipId = 'relationship id';

    item = Object.assign(new Item(), {
      uuid: 'publication',
      metadata: [],
    });

    relatedItem = Object.assign(new Item(), {
      uuid: 'relatedItem',
      metadata: [],
    });

    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService', {
      isSelectedVirtualMetadata: of(false),
      setSelectedVirtualMetadata: null,
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), VirtualMetadataComponent, VarDirective],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ThemeService, useValue: getMockThemeService() },
      ], schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .overrideComponent(VirtualMetadataComponent, {
        remove: {
          imports: [ListableObjectComponentLoaderComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(VirtualMetadataComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    comp.url = url;
    comp.leftItem = item;
    comp.rightItem = relatedItem;
    comp.ngOnChanges();
    comp.relationshipId = relationshipId;

    fixture.detectChanges();
  });

  describe('when clicking the save button', () => {
    it('should emit a save event', () => {

      spyOn(comp.save, 'emit');
      fixture.debugElement
        .query(By.css('button.save'))
        .triggerEventHandler('click', null);
      expect(comp.save.emit).toHaveBeenCalled();
    });
  });

  describe('when clicking the close button', () => {
    it('should emit a close event', () => {

      spyOn(comp.close, 'emit');
      fixture.debugElement
        .query(By.css('button.btn-close'))
        .triggerEventHandler('click', null);
      expect(comp.close.emit).toHaveBeenCalled();
    });
  });

  describe('when selecting an item', () => {
    it('should call the updates service setSelectedVirtualMetadata method', () => {

      fixture.debugElement
        .query(By.css('div.item'))
        .triggerEventHandler('click', null);
      expect(objectUpdatesService.setSelectedVirtualMetadata).toHaveBeenCalledWith(
        url,
        relationshipId,
        item.uuid,
        true,
      );
    });
  });
});
