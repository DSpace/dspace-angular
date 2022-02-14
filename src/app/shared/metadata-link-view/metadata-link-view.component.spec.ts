import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { MetadataLinkViewComponent } from './metadata-link-view.component';
import { ItemDataService } from '../../core/data/item-data.service';
import { Item } from '../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { SharedModule } from '../shared.module';
import { MetadataValue } from '../../core/shared/metadata.models';
import SpyObj = jasmine.SpyObj;

describe('MetadataLinkViewComponent', () => {
  let component: MetadataLinkViewComponent;
  let fixture: ComponentFixture<MetadataLinkViewComponent>;
  let itemService: SpyObj<ItemDataService>;
  const validAuthority = uuidv4();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SharedModule, RouterTestingModule ],
      declarations: [ MetadataLinkViewComponent ],
      providers: [
        { provide: ItemDataService, useValue: itemService },
      ]
    })
    .compileComponents();
  });

  const testPerson = Object.assign(new Item(), {
    id: '1',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [
        Object.assign(new MetadataValue(), {
          value: 'Person'
        })
      ],
      'person.orgunit.id': [
        Object.assign(new MetadataValue(), {
          value: 'OrgUnit',
          authority: '2'
        })
      ],
      'person.identifier.orcid': [
        Object.assign(new MetadataValue(), {
          language: 'en_US',
          value: '0000-0001-8918-3592'
        })
      ],
      'cris.orcid.authenticated': [
        Object.assign(new MetadataValue(), {
          language: null,
          value: 'authenticated'
        })
      ]
    }
  });

  const testOrgunit = Object.assign(new Item(), {
    id: '2',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [
        Object.assign(new MetadataValue(), {
          value: 'OrgUnit'
        })
      ],
      'orgunit.person.id': [
        Object.assign(new MetadataValue(), {
          value: 'Person',
          authority: '1'
        })
      ],
    }
  });

  const testMetadataValueWithoutAuthority = Object.assign(new MetadataValue(), {
    authority:null,
    confidence:-1,
    language:null,
    place:0,
    uuid:'56e99d82-2cae-4cce-8d12-39899dea7c72',
    value:'Università degli Studi di Milano Bicocca',
  });

  const testMetadataValueWithAuthority = Object.assign(new MetadataValue(), {
    authority: validAuthority,
    confidence: 600,
    language:null,
    place:0,
    uuid:'56e99d82-2cae-4cce-8d12-39899dea7c72',
    value:'Università degli Studi di Milano Bicocca',
  });

  itemService = jasmine.createSpyObj('ItemDataService', {
    findById: jasmine.createSpy('findById')
  });

  describe('Check metadata without authority', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MetadataLinkViewComponent);
      itemService.findById.and.returnValue(createSuccessfulRemoteDataObject$(testOrgunit));
      component = fixture.componentInstance;
      component.item = testPerson;
      component.metadata = testMetadataValueWithoutAuthority;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not have link', () => {
      const link = fixture.debugElement.query(By.css('a'));

      expect(link).toBeNull();
    });

    it('should not have icon', () => {
      const icon = fixture.debugElement.query(By.css('.orcid-icon'));

      expect(icon).toBeNull();
    });

  });

  describe('Check metadata with authority', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MetadataLinkViewComponent);
      itemService.findById.and.returnValue(createSuccessfulRemoteDataObject$(testPerson));
      component = fixture.componentInstance;
      component.item = testPerson;
      component.metadata = testMetadataValueWithAuthority;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have link', () => {
      const link = fixture.debugElement.query(By.css('a'));

      expect(link).toBeTruthy();
    });

    it('should have icon', () => {
      const icon = fixture.debugElement.query(By.css('.orcid-icon'));

      expect(icon).toBeTruthy();
    });
  });



});
