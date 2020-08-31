import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisrefComponent } from './crisref.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { of } from 'rxjs';
import { Item } from 'src/app/core/shared/item.model';
import { Field } from 'src/app/core/layout/models/metadata-component.model';
import { createMockRDObs } from 'src/app/+item-page/edit-item-page/item-bitstreams/item-bitstreams.component.spec';
import { By } from '@angular/platform-browser';

describe('CrisrefComponent', () => {
  let component: CrisrefComponent;
  let fixture: ComponentFixture<CrisrefComponent>;
  let itemService: ItemDataService;

  const testPerson = Object.assign(new Item(), {
    id: '1',
    bundles: of({}),
    metadata: {
      'relationship.type': [
        {
          value: 'Person'
        }
      ],
      'person.orgunit.id': [
        {
          value: 'OrgUnit',
          authority: '2'
        }
      ]
    }
  });

  const testOrgunit = Object.assign(new Item(), {
    id: '2',
    bundles: of({}),
    metadata: {
      'relationship.type': [
        {
          value: 'OrgUnit'
        }
      ]
    }
  });

  const testField = Object.assign({
    id: 1,
    label: 'Field Label',
    style: 'col-md-6',
    metadata: 'person.orgunit.id'
  }) as Field;

  itemService = Object.assign( {
    findById: (id: string) => {
      if (id === '1') {
        return createMockRDObs(testPerson);
      } else {
        return createMockRDObs(testOrgunit)
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ CrisrefComponent ],
      providers: [
        { provide: ItemDataService, useValue: itemService },
      ]
    })
    .compileComponents();
  }));

  describe('Check Orgunit icon', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CrisrefComponent);
      component = fixture.componentInstance;
      component.item = testPerson;
      component.field = testField;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should has orgunit icon', () => {
      const icon = fixture.debugElement.query(By.css('.fa-university'));

      expect(icon).toBeTruthy();
    });
  });

});
