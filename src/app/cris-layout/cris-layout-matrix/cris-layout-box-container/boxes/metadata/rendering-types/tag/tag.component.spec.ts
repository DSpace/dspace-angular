/*import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TagComponent } from './tag.component';
import { Item } from '../../../../../../../core/shared/item.model';
import { tagMedataComponent } from '../../../../../../../shared/testing/tag-metadata-components.mock';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { DsDatePipe } from '../../../../../../pipes/ds-date.pipe';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { UploaderService } from '../../../../../../../shared/uploader/uploader.service';

class TestItem {
  allMetadataValues(key: string): string[] {
    return ['HKU', 'ASDF'];
  }
}

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule, SharedModule],
      declarations: [ TagComponent, DsDatePipe ],
      providers : [
       { provide: UploaderService, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    component.field = tagMedataComponent.rows[0].fields[0];
    fixture.detectChanges();
  });


  it('should have the right label', (done) => {
    const spanLabelFound = fixture.debugElement.query(By.css('div.' + tagMedataComponent.rows[0].fields[0].style + ' > span'));
    expect(spanLabelFound.nativeElement.textContent.trim()).toBe(tagMedataComponent.rows[0].fields[0].label);
    done();
  });

  it('should have chips', () => {
    const chips = fixture.debugElement.query(By.css('ds-chips'));
    expect(chips).toBeTruthy();
  });


  it('should have the right chip values if it has no indexToBeRendered', (done) => {
    const chipLabelsFound = fixture.debugElement.queryAll(By.css('p.chip-label'));
    expect(chipLabelsFound[0].nativeElement.textContent).toContain((new TestItem()).allMetadataValues('')[0]);
    expect(chipLabelsFound[1].nativeElement.textContent).toContain((new TestItem()).allMetadataValues('')[1]);
    done();
  });


  it('should render single chip item if it has indexToBeRendered', (done) => {

    component.indexToBeRendered = 1;
    component.ngOnInit();
    fixture.detectChanges();

    const chipLabelsFound = fixture.debugElement.queryAll(By.css('p.chip-label'));
    expect(chipLabelsFound.length).toBe(1);
    expect(chipLabelsFound[0].nativeElement.textContent).toContain((new TestItem()).allMetadataValues('')[1]);
    done();
  });

});*/
