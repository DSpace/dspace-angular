import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '../../../core/shared/item.model';
import { ModifyItemOverviewComponent } from './modify-item-overview.component';

let comp: ModifyItemOverviewComponent;
let fixture: ComponentFixture<ModifyItemOverviewComponent>;

const mockItem = Object.assign(new Item(), {
  id: 'fake-id',
  handle: 'fake/handle',
  lastModified: '2018',
  metadata: {
    'dc.title': [
      { value: 'Mock item title', language: 'en' },
    ],
    'dc.contributor.author': [
      { value: 'Mayer, Ed', language: '' },
    ],
  },
});

describe('ModifyItemOverviewComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ModifyItemOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyItemOverviewComponent);
    comp = fixture.componentInstance;
    comp.item = mockItem;

    fixture.detectChanges();
  });
  it('should render a table of existing metadata fields in the item', () => {

    const metadataRows = fixture.debugElement.queryAll(By.css('tr.metadata-row'));
    expect(metadataRows.length).toEqual(2);

    const authorRow = metadataRows[0].queryAll(By.css('td'));
    expect(authorRow.length).toEqual(3);

    expect(authorRow[0].nativeElement.innerHTML).toContain('dc.contributor.author');
    expect(authorRow[1].nativeElement.innerHTML).toContain('Mayer, Ed');
    expect(authorRow[2].nativeElement.innerHTML).toEqual('');

    const titleRow = metadataRows[1].queryAll(By.css('td'));
    expect(titleRow.length).toEqual(3);

    expect(titleRow[0].nativeElement.innerHTML).toContain('dc.title');
    expect(titleRow[1].nativeElement.innerHTML).toContain('Mock item title');
    expect(titleRow[2].nativeElement.innerHTML).toContain('en');

  });
});
