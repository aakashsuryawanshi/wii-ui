import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISubject, Subject } from '../subject.model';
import { SubjectService } from '../service/subject.service';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';

@Component({
  selector: 'jhi-subject-update',
  templateUrl: './subject-update.component.html',
})
export class SubjectUpdateComponent implements OnInit {
  isSaving = false;

  semestersSharedCollection: ISemester[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    semester: [],
  });

  constructor(
    protected subjectService: SubjectService,
    protected semesterService: SemesterService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subject }) => {
      this.updateForm(subject);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subject = this.createFromForm();
    if (subject.id !== undefined) {
      this.subscribeToSaveResponse(this.subjectService.update(subject));
    } else {
      this.subscribeToSaveResponse(this.subjectService.create(subject));
    }
  }

  trackSemesterById(index: number, item: ISemester): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubject>>): void {
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

  protected updateForm(subject: ISubject): void {
    this.editForm.patchValue({
      id: subject.id,
      name: subject.name,
      description: subject.description,
      semester: subject.semester,
    });

    this.semestersSharedCollection = this.semesterService.addSemesterToCollectionIfMissing(
      this.semestersSharedCollection,
      subject.semester
    );
  }

  protected loadRelationshipsOptions(): void {
    this.semesterService
      .query()
      .pipe(map((res: HttpResponse<ISemester[]>) => res.body ?? []))
      .pipe(
        map((semesters: ISemester[]) =>
          this.semesterService.addSemesterToCollectionIfMissing(semesters, this.editForm.get('semester')!.value)
        )
      )
      .subscribe((semesters: ISemester[]) => (this.semestersSharedCollection = semesters));
  }

  protected createFromForm(): ISubject {
    return {
      ...new Subject(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      semester: this.editForm.get(['semester'])!.value,
    };
  }
}
