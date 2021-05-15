jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TagMetaDataService } from '../service/tag-meta-data.service';
import { ITagMetaData, TagMetaData } from '../tag-meta-data.model';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

import { TagMetaDataUpdateComponent } from './tag-meta-data-update.component';

describe('Component Tests', () => {
  describe('TagMetaData Management Update Component', () => {
    let comp: TagMetaDataUpdateComponent;
    let fixture: ComponentFixture<TagMetaDataUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tagMetaDataService: TagMetaDataService;
    let questionService: QuestionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TagMetaDataUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TagMetaDataUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TagMetaDataUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      tagMetaDataService = TestBed.inject(TagMetaDataService);
      questionService = TestBed.inject(QuestionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Question query and add missing value', () => {
        const tagMetaData: ITagMetaData = { id: 456 };
        const question: IQuestion = { id: 68907 };
        tagMetaData.question = question;

        const questionCollection: IQuestion[] = [{ id: 53635 }];
        spyOn(questionService, 'query').and.returnValue(of(new HttpResponse({ body: questionCollection })));
        const additionalQuestions = [question];
        const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
        spyOn(questionService, 'addQuestionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ tagMetaData });
        comp.ngOnInit();

        expect(questionService.query).toHaveBeenCalled();
        expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(questionCollection, ...additionalQuestions);
        expect(comp.questionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const tagMetaData: ITagMetaData = { id: 456 };
        const question: IQuestion = { id: 46038 };
        tagMetaData.question = question;

        activatedRoute.data = of({ tagMetaData });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tagMetaData));
        expect(comp.questionsSharedCollection).toContain(question);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tagMetaData = { id: 123 };
        spyOn(tagMetaDataService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tagMetaData });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tagMetaData }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(tagMetaDataService.update).toHaveBeenCalledWith(tagMetaData);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tagMetaData = new TagMetaData();
        spyOn(tagMetaDataService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tagMetaData });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tagMetaData }));
        saveSubject.complete();

        // THEN
        expect(tagMetaDataService.create).toHaveBeenCalledWith(tagMetaData);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tagMetaData = { id: 123 };
        spyOn(tagMetaDataService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tagMetaData });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(tagMetaDataService.update).toHaveBeenCalledWith(tagMetaData);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackQuestionById', () => {
        it('Should return tracked Question primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackQuestionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
