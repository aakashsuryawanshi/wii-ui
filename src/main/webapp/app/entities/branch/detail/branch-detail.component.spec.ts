import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BranchDetailComponent } from './branch-detail.component';

describe('Component Tests', () => {
  describe('Branch Management Detail Component', () => {
    let comp: BranchDetailComponent;
    let fixture: ComponentFixture<BranchDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BranchDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ branch: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BranchDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BranchDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load branch on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.branch).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
