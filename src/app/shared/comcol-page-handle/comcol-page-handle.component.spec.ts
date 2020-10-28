import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { UIURLCombiner } from 'src/app/core/url-combiner/ui-url-combiner';
import { ComcolPageHandleComponent } from './comcol-page-handle.component';

const handleWithProtocol = 'http://localhost:4000/handle/123456789/2';

const handleWithoutProtocol = '123456789/2';
const handleWithoutProtocolUIURLCombined = new UIURLCombiner('/handle/', '123456789/2').toString();

describe('ComcolPageHandleComponent', () => {
  let component: ComcolPageHandleComponent;
  let fixture: ComponentFixture<ComcolPageHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ ComcolPageHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComcolPageHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty if no content is passed', () => {
    component.content = undefined;
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    expect(div).toBeNull();
  });

  describe('should create a link pointing the handle', () => {
  
    it('should use the content if it includes the http protocol', () => {
      component.content = handleWithProtocol;
      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css('a'));
      expect(link.nativeElement.getAttribute('href')).toBe(handleWithProtocol);
      expect(link.nativeElement.innerHTML).toBe(handleWithProtocol);
    });

    it('should combine the base uri to the content if it doesnt include the http protocol', () => {
      component.content = handleWithoutProtocol;
      fixture.detectChanges();
      const link = fixture.debugElement.query(By.css('a'));
      expect(link.nativeElement.getAttribute('href')).toBe(handleWithoutProtocolUIURLCombined);
      expect(link.nativeElement.innerHTML).toBe(handleWithoutProtocolUIURLCombined);
    });
    
  });
 
});