import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BranchService } from '../service/branch.service';

import { BranchComponent } from './branch.component';

describe('Component Tests', () => {
  describe('Branch Management Component', () => {
    let comp: BranchComponent;
    let fixture: ComponentFixture<BranchComponent>;
    let service: BranchService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BranchComponent],
      })
        .overrideTemplate(BranchComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BranchComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BranchService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.branches?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
