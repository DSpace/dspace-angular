import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdnServiceFormEditComponent } from './ldn-service-form-edit.component';

describe('LdnServiceFormEditComponent', () => {
    let component: LdnServiceFormEditComponent;
    let fixture: ComponentFixture<LdnServiceFormEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LdnServiceFormEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LdnServiceFormEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
