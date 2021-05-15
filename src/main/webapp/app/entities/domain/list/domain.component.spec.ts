import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DomainService } from '../service/domain.service';

import { DomainComponent } from './domain.component';

describe('Component Tests', () => {
  describe('Domain Management Component', () => {
    let comp: DomainComponent;
    let fixture: ComponentFixture<DomainComponent>;
    let service: DomainService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DomainComponent],
      })
        .overrideTemplate(DomainComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DomainComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DomainService);

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
      expect(comp.domains?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
