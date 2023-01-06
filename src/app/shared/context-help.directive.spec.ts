// import { Component, DebugElement, Input } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { of as observableOf, Observable } from 'rxjs';
// import { ContextHelpDirective, ContextHelpDirectiveInput } from './context-help.directive';
// import { TranslateService } from '@ngx-translate/core';
// import { ContextHelpWrapperComponent } from './context-help-wrapper/context-help-wrapper.component';
// import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
//
// @Component({
//   template: `<div *dsContextHelp="contextHelpParams()">some text</div>`
// })
// class TestComponent {
//   @Input() content = '';
//   contextHelpParams(): ContextHelpDirectiveInput {
//     return {
//       content: this.content
//     };
//   }
// }
//
// // tslint:disable-next-line:max-classes-per-file
// class MockTranslateService {
//   messages: {[index: string]: string} = {
//     lorem: 'lorem ipsum dolor sit amet',
//     linkTest: 'This is text, [this](https://dspace.lyrasis.org) is a link, and [so is this](https://google.com)'
//   };
//
//   get(key: string): Observable<string> {
//     return observableOf(this.messages[key]);
//   }
// }
//
// describe('ContextHelpDirective', () => {
//   let component: TestComponent;
//   let fixture: ComponentFixture<TestComponent>;
//   // let el: DebugElement;
//   // let translateService: TranslateService;
//
//   beforeEach(() => {
//     console.log('Anyone hear that?');
//     fixture = TestBed.configureTestingModule({
//       imports: [NgbTooltipModule],
//       providers: [
//         { provide: TranslateService, useClass: MockTranslateService }
//       ],
//       declarations: [TestComponent, ContextHelpWrapperComponent, ContextHelpDirective]
//     }).createComponent(TestComponent);
//     component = fixture.componentInstance;
//   });
//
//   it('should add the tooltip icon', () => {
//     component.content = 'lorem';
//     fixture.detectChanges();
//
//     expect(component).toBeDefined();
//     const [wrapper] = fixture.nativeElement.children;
//     const [i, div] = wrapper.children;
//     expect(wrapper.tagName).toBe('DS-CONTEXT-HELP-WRAPPER');
//     expect(i.tagName).toBe('I');
//     expect(div.tagName).toBe('DIV');
//     expect(div.innerHTML).toBe('some text');
//     i.click(); // TODO: triggers a type error
//   });
// });
