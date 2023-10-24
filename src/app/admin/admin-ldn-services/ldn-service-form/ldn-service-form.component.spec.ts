import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdnServiceFormComponent } from './ldn-service-form.component';

describe('LdnServiceFormComponent', () => {
    let component: LdnServiceFormComponent;
    let fixture: ComponentFixture<LdnServiceFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LdnServiceFormComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LdnServiceFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
