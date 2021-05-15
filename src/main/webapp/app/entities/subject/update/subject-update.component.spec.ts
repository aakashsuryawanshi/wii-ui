jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SubjectService } from '../service/subject.service';
import { ISubject, Subject } from '../subject.model';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';

import { SubjectUpdateComponent } from './subject-update.component';

describe('Component Tests', () => {
  describe('Subject Management Update Component', () => {
    let comp: SubjectUpdateComponent;
    let fixture: ComponentFixture<SubjectUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let subjectService: SubjectService;
    let semesterService: SemesterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SubjectUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SubjectUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SubjectUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      subjectService = TestBed.inject(SubjectService);
      semesterService = TestBed.inject(SemesterService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Semester query and add missing value', () => {
        const subject: ISubject = { id: 456 };
        const semester: ISemester = { id: 3156 };
        subject.semester = semester;

        const semesterCollection: ISemester[] = [{ id: 31794 }];
        spyOn(semesterService, 'query').and.returnValue(of(new HttpResponse({ body: semesterCollection })));
        const additionalSemesters = [semester];
        const expectedCollection: ISemester[] = [...additionalSemesters, ...semesterCollection];
        spyOn(semesterService, 'addSemesterToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ subject });
        comp.ngOnInit();

        expect(semesterService.query).toHaveBeenCalled();
        expect(semesterService.addSemesterToCollectionIfMissing).toHaveBeenCalledWith(semesterCollection, ...additionalSemesters);
        expect(comp.semestersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const subject: ISubject = { id: 456 };
        const semester: ISemester = { id: 8887 };
        subject.semester = semester;

        activatedRoute.data = of({ subject });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(subject));
        expect(comp.semestersSharedCollection).toContain(semester);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const subject = { id: 123 };
        spyOn(subjectService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ subject });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: subject }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(subjectService.update).toHaveBeenCalledWith(subject);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const subject = new Subject();
        spyOn(subjectService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ subject });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: subject }));
        saveSubject.complete();

        // THEN
        expect(subjectService.create).toHaveBeenCalledWith(subject);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const subject = { id: 123 };
        spyOn(subjectService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ subject });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(subjectService.update).toHaveBeenCalledWith(subject);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSemesterById', () => {
        it('Should return tracked Semester primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSemesterById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
