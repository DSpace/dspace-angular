import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataLinkViewComponent } from './metadata-link-view.component';
import { ItemDataService } from '../../core/data/item-data.service';
import { of } from 'rxjs';
import { Item } from '../../core/shared/item.model';
import { LayoutField } from '../../core/layout/models/metadata-component.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('MetadataLinkViewComponent', () => {
  let component: MetadataLinkViewComponent;
  let fixture: ComponentFixture<MetadataLinkViewComponent>;
  let itemService: ItemDataService;

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
        {
          value: 'Person'
        }
      ],
      'person.orgunit.id': [
        {
          value: 'OrgUnit',
          authority: '2'
        }
      ],
      'person.identifier.orcid': [
        {
          language: 'en_US',
          value: '0000-0001-8918-3592'
        }
      ],
      'cris.orcid.authenticated': [
        {
          language: null,
          value: 'authenticated'
        }
      ]
    }
  });

  const testOrgunit = Object.assign(new Item(), {
    id: '2',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [
        {
          value: 'OrgUnit'
        }
      ],
      'orgunit.person.id': [
        {
          value: 'Person',
          authority: '1'
        }
      ],
    }
  });

  const testMetadataValueWithoutAuthority = Object.assign(new Item(), {
    authority:null,
    confidence:-1,
    language:null,
    place:0,
    uuid:'56e99d82-2cae-4cce-8d12-39899dea7c72',
    value:'Università degli Studi di Milano Bicocca',
  });

  const testMetadataValueWithAuthority = Object.assign(new Item(), {
    authority:'1',
    confidence:-1,
    language:null,
    place:0,
    uuid:'56e99d82-2cae-4cce-8d12-39899dea7c72',
    value:'Università degli Studi di Milano Bicocca',
  });

  itemService = Object.assign( {
    findById: (id: string) => {
      if (id === '1') {
        return createSuccessfulRemoteDataObject$(testPerson);
      } else {
        return createSuccessfulRemoteDataObject$(testOrgunit);
      }
    }
  });

  describe('Check metadata without authority', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MetadataLinkViewComponent);
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
      component = fixture.componentInstance;
      component.item = testPerson;
      component.metadata = testMetadataValueWithAuthority;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have link', () => {
      console.log(component);
      const link = fixture.debugElement.query(By.css('a'));

      expect(link).toBeTruthy();
    });

    it('should have icon', () => {
      const icon = fixture.debugElement.query(By.css('.orcid-icon'));

      expect(icon).toBeTruthy();
    });
  });



});
