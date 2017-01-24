import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SpinnerWrapperComponent } from "../spinner-wrapper/spinner-wrapper.component";
import { SpinnerService } from "../spinner/spinner.service";
import { SpinnerState } from "../spinner/spinner.reducer";
import { Store, StoreModule } from "@ngrx/store";
import Spy = jasmine.Spy;
import { By } from '@angular/platform-browser';
import {
    CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { Observable } from "rxjs";

let comp:SpinnerWrapperComponent;
let fixture:ComponentFixture<SpinnerWrapperComponent>;
let store:Store<SpinnerState>;

describe('SpinnerWrapperComponent', () => {

    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.provideStore({})],
            declarations: [SpinnerWrapperComponent],
            providers: [
                SpinnerService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]

        })
            .compileComponents();  // compile template and css
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(SpinnerWrapperComponent);

        comp = fixture.componentInstance;


        store = fixture.debugElement.injector.get(Store);
        spyOn(store, 'dispatch');
    });


    describe("when active in the store is true", () => {
        let spinner:HTMLElement;
        let content:HTMLElement;

        beforeEach(() => {
            spinner = fixture.debugElement.query(By.css('ds-spinner')).nativeElement;
            content = fixture.debugElement.query(By.css('#ds-content')).nativeElement;
            spyOn(store, 'select').and.returnValue(Observable.of({ active: true }));
            fixture.detectChanges();
        });

        it("should hide the page contents", () => {
            expect(content.attributes.getNamedItem("hidden").value).toEqual("");
        });

        it("should show the spinner", () => {
            expect(spinner.attributes["hidden"]).toBeUndefined();
        });

    });

    describe("when active in the store is false", () => {
        let spinner:HTMLElement;
        let content:HTMLElement;

        beforeEach(() => {
            spinner = fixture.debugElement.query(By.css('ds-spinner')).nativeElement;
            content = fixture.debugElement.query(By.css('#ds-content')).nativeElement;
            spyOn(store, 'select').and.returnValue(Observable.of({ active: false }));
            fixture.detectChanges();
        });

        it("should show the page contents", () => {
            expect(content.attributes["hidden"]).toBeUndefined();
        });

        it("should hide the spinner", () => {
            expect(spinner.attributes.getNamedItem("hidden").value).toEqual("");
        });


    });

});