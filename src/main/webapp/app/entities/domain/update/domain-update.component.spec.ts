jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DomainService } from '../service/domain.service';
import { IDomain, Domain } from '../domain.model';

import { DomainUpdateComponent } from './domain-update.component';

describe('Component Tests', () => {
  describe('Domain Management Update Component', () => {
    let comp: DomainUpdateComponent;
    let fixture: ComponentFixture<DomainUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let domainService: DomainService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DomainUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DomainUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DomainUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      domainService = TestBed.inject(DomainService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const domain: IDomain = { id: 456 };

        activatedRoute.data = of({ domain });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(domain));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const domain = { id: 123 };
        spyOn(domainService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ domain });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: domain }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(domainService.update).toHaveBeenCalledWith(domain);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const domain = new Domain();
        spyOn(domainService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ domain });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: domain }));
        saveSubject.complete();

        // THEN
        expect(domainService.create).toHaveBeenCalledWith(domain);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const domain = { id: 123 };
        spyOn(domainService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ domain });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(domainService.update).toHaveBeenCalledWith(domain);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
