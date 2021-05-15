import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISemester, Semester } from '../semester.model';
import { SemesterService } from '../service/semester.service';
import { IBranch } from 'app/entities/branch/branch.model';
import { BranchService } from 'app/entities/branch/service/branch.service';

@Component({
  selector: 'jhi-semester-update',
  templateUrl: './semester-update.component.html',
})
export class SemesterUpdateComponent implements OnInit {
  isSaving = false;

  branchesSharedCollection: IBranch[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    branch: [],
  });

  constructor(
    protected semesterService: SemesterService,
    protected branchService: BranchService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semester }) => {
      this.updateForm(semester);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const semester = this.createFromForm();
    if (semester.id !== undefined) {
      this.subscribeToSaveResponse(this.semesterService.update(semester));
    } else {
      this.subscribeToSaveResponse(this.semesterService.create(semester));
    }
  }

  trackBranchById(index: number, item: IBranch): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISemester>>): void {
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

  protected updateForm(semester: ISemester): void {
    this.editForm.patchValue({
      id: semester.id,
      name: semester.name,
      description: semester.description,
      branch: semester.branch,
    });

    this.branchesSharedCollection = this.branchService.addBranchToCollectionIfMissing(this.branchesSharedCollection, semester.branch);
  }

  protected loadRelationshipsOptions(): void {
    this.branchService
      .query()
      .pipe(map((res: HttpResponse<IBranch[]>) => res.body ?? []))
      .pipe(map((branches: IBranch[]) => this.branchService.addBranchToCollectionIfMissing(branches, this.editForm.get('branch')!.value)))
      .subscribe((branches: IBranch[]) => (this.branchesSharedCollection = branches));
  }

  protected createFromForm(): ISemester {
    return {
      ...new Semester(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      branch: this.editForm.get(['branch'])!.value,
    };
  }
}
