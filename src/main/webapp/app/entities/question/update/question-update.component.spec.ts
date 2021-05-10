jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QuestionService } from '../service/question.service';
import { IQuestion, Question } from '../question.model';
import { ISubject } from 'app/entities/subject/subject.model';
import { SubjectService } from 'app/entities/subject/service/subject.service';

import { QuestionUpdateComponent } from './question-update.component';

describe('Component Tests', () => {
  describe('Question Management Update Component', () => {
    let comp: QuestionUpdateComponent;
    let fixture: ComponentFixture<QuestionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let questionService: QuestionService;
    let subjectService: SubjectService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QuestionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QuestionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      questionService = TestBed.inject(QuestionService);
      subjectService = TestBed.inject(SubjectService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Subject query and add missing value', () => {
        const question: IQuestion = { id: 456 };
        const subject: ISubject = { id: 69645 };
        question.subject = subject;

        const subjectCollection: ISubject[] = [{ id: 8621 }];
        spyOn(subjectService, 'query').and.returnValue(of(new HttpResponse({ body: subjectCollection })));
        const additionalSubjects = [subject];
        const expectedCollection: ISubject[] = [...additionalSubjects, ...subjectCollection];
        spyOn(subjectService, 'addSubjectToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ question });
        comp.ngOnInit();

        expect(subjectService.query).toHaveBeenCalled();
        expect(subjectService.addSubjectToCollectionIfMissing).toHaveBeenCalledWith(subjectCollection, ...additionalSubjects);
        expect(comp.subjectsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const question: IQuestion = { id: 456 };
        const subject: ISubject = { id: 48755 };
        question.subject = subject;

        activatedRoute.data = of({ question });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(question));
        expect(comp.subjectsSharedCollection).toContain(subject);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const question = { id: 123 };
        spyOn(questionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: question }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(questionService.update).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const question = new Question();
        spyOn(questionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: question }));
        saveSubject.complete();

        // THEN
        expect(questionService.create).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const question = { id: 123 };
        spyOn(questionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(questionService.update).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSubjectById', () => {
        it('Should return tracked Subject primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSubjectById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
