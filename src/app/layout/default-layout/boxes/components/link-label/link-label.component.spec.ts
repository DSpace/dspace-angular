import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLabelComponent } from './link-label.component';
import { Item } from 'src/app/core/shared/item.model';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

fdescribe('LinkLabelComponent', () => {
  let component: LinkLabelComponent;
  let fixture: ComponentFixture<LinkLabelComponent>;

  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.link': [
        {
          value: 'http://rest.api/item/link/id'
        }
      ]
    }
  });

  const testField = Object.assign({}, {
    id: 1,
    label: 'Field Label',
    style: 'col-md-6',
    metadata: 'dc.link'
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkLabelComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkLabelComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.field = testField;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be added href and text to the anchor', () => {
    const valueContainer = fixture.debugElement.query(By.css('a'));
    const metadataValue = testItem.firstMetadataValue( testField.metadata );
    expect(valueContainer.nativeElement.textContent.trim()).toContain(
      testField.label
    );
    expect(valueContainer.nativeElement.href).toContain(
      metadataValue
    );
  });
});
