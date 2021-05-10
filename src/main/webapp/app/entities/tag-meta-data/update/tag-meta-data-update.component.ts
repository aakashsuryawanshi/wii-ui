import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITagMetaData, TagMetaData } from '../tag-meta-data.model';
import { TagMetaDataService } from '../service/tag-meta-data.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

@Component({
  selector: 'jhi-tag-meta-data-update',
  templateUrl: './tag-meta-data-update.component.html',
})
export class TagMetaDataUpdateComponent implements OnInit {
  isSaving = false;

  questionsSharedCollection: IQuestion[] = [];

  editForm = this.fb.group({
    id: [],
    key: [],
    value: [],
    question: [],
  });

  constructor(
    protected tagMetaDataService: TagMetaDataService,
    protected questionService: QuestionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tagMetaData }) => {
      this.updateForm(tagMetaData);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tagMetaData = this.createFromForm();
    if (tagMetaData.id !== undefined) {
      this.subscribeToSaveResponse(this.tagMetaDataService.update(tagMetaData));
    } else {
      this.subscribeToSaveResponse(this.tagMetaDataService.create(tagMetaData));
    }
  }

  trackQuestionById(index: number, item: IQuestion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITagMetaData>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(tagMetaData: ITagMetaData): void {
    this.editForm.patchValue({
      id: tagMetaData.id,
      key: tagMetaData.key,
      value: tagMetaData.value,
      question: tagMetaData.question,
    });

    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing(
      this.questionsSharedCollection,
      tagMetaData.question
    );
  }

  protected loadRelationshipsOptions(): void {
    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing(questions, this.editForm.get('question')!.value)
        )
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));
  }

  protected createFromForm(): ITagMetaData {
    return {
      ...new TagMetaData(),
      id: this.editForm.get(['id'])!.value,
      key: this.editForm.get(['key'])!.value,
      value: this.editForm.get(['value'])!.value,
      question: this.editForm.get(['question'])!.value,
    };
  }
}
