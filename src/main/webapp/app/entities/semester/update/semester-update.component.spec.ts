jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SemesterService } from '../service/semester.service';
import { ISemester, Semester } from '../semester.model';
import { IBranch } from 'app/entities/branch/branch.model';
import { BranchService } from 'app/entities/branch/service/branch.service';

import { SemesterUpdateComponent } from './semester-update.component';

describe('Component Tests', () => {
  describe('Semester Management Update Component', () => {
    let comp: SemesterUpdateComponent;
    let fixture: ComponentFixture<SemesterUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let semesterService: SemesterService;
    let branchService: BranchService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SemesterUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SemesterUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SemesterUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      semesterService = TestBed.inject(SemesterService);
      branchService = TestBed.inject(BranchService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Branch query and add missing value', () => {
        const semester: ISemester = { id: 456 };
        const branch: IBranch = { id: 33166 };
        semester.branch = branch;

        const branchCollection: IBranch[] = [{ id: 68040 }];
        spyOn(branchService, 'query').and.returnValue(of(new HttpResponse({ body: branchCollection })));
        const additionalBranches = [branch];
        const expectedCollection: IBranch[] = [...additionalBranches, ...branchCollection];
        spyOn(branchService, 'addBranchToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ semester });
        comp.ngOnInit();

        expect(branchService.query).toHaveBeenCalled();
        expect(branchService.addBranchToCollectionIfMissing).toHaveBeenCalledWith(branchCollection, ...additionalBranches);
        expect(comp.branchesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const semester: ISemester = { id: 456 };
        const branch: IBranch = { id: 47023 };
        semester.branch = branch;

        activatedRoute.data = of({ semester });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(semester));
        expect(comp.branchesSharedCollection).toContain(branch);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const semester = { id: 123 };
        spyOn(semesterService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ semester });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: semester }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(semesterService.update).toHaveBeenCalledWith(semester);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const semester = new Semester();
        spyOn(semesterService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ semester });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: semester }));
        saveSubject.complete();

        // THEN
        expect(semesterService.create).toHaveBeenCalledWith(semester);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const semester = { id: 123 };
        spyOn(semesterService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ semester });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(semesterService.update).toHaveBeenCalledWith(semester);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBranchById', () => {
        it('Should return tracked Branch primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBranchById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
