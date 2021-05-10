jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BranchService } from '../service/branch.service';
import { IBranch, Branch } from '../branch.model';
import { IDomain } from 'app/entities/domain/domain.model';
import { DomainService } from 'app/entities/domain/service/domain.service';

import { BranchUpdateComponent } from './branch-update.component';

describe('Component Tests', () => {
  describe('Branch Management Update Component', () => {
    let comp: BranchUpdateComponent;
    let fixture: ComponentFixture<BranchUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let branchService: BranchService;
    let domainService: DomainService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BranchUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BranchUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BranchUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      branchService = TestBed.inject(BranchService);
      domainService = TestBed.inject(DomainService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Domain query and add missing value', () => {
        const branch: IBranch = { id: 456 };
        const domain: IDomain = { id: 51444 };
        branch.domain = domain;

        const domainCollection: IDomain[] = [{ id: 10017 }];
        spyOn(domainService, 'query').and.returnValue(of(new HttpResponse({ body: domainCollection })));
        const additionalDomains = [domain];
        const expectedCollection: IDomain[] = [...additionalDomains, ...domainCollection];
        spyOn(domainService, 'addDomainToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ branch });
        comp.ngOnInit();

        expect(domainService.query).toHaveBeenCalled();
        expect(domainService.addDomainToCollectionIfMissing).toHaveBeenCalledWith(domainCollection, ...additionalDomains);
        expect(comp.domainsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const branch: IBranch = { id: 456 };
        const domain: IDomain = { id: 81831 };
        branch.domain = domain;

        activatedRoute.data = of({ branch });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(branch));
        expect(comp.domainsSharedCollection).toContain(domain);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const branch = { id: 123 };
        spyOn(branchService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ branch });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: branch }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(branchService.update).toHaveBeenCalledWith(branch);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const branch = new Branch();
        spyOn(branchService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ branch });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: branch }));
        saveSubject.complete();

        // THEN
        expect(branchService.create).toHaveBeenCalledWith(branch);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const branch = { id: 123 };
        spyOn(branchService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ branch });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(branchService.update).toHaveBeenCalledWith(branch);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackDomainById', () => {
        it('Should return tracked Domain primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDomainById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
