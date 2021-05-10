import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DomainDetailComponent } from './domain-detail.component';

describe('Component Tests', () => {
  describe('Domain Management Detail Component', () => {
    let comp: DomainDetailComponent;
    let fixture: ComponentFixture<DomainDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DomainDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ domain: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DomainDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DomainDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load domain on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.domain).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
