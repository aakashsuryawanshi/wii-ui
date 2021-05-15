import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDomain, Domain } from '../domain.model';
import { DomainService } from '../service/domain.service';

@Component({
  selector: 'jhi-domain-update',
  templateUrl: './domain-update.component.html',
})
export class DomainUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
  });

  constructor(protected domainService: DomainService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ domain }) => {
      this.updateForm(domain);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const domain = this.createFromForm();
    if (domain.id !== undefined) {
      this.subscribeToSaveResponse(this.domainService.update(domain));
    } else {
      this.subscribeToSaveResponse(this.domainService.create(domain));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDomain>>): void {
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

  protected updateForm(domain: IDomain): void {
    this.editForm.patchValue({
      id: domain.id,
      name: domain.name,
      description: domain.description,
    });
  }

  protected createFromForm(): IDomain {
    return {
      ...new Domain(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
