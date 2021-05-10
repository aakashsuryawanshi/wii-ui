import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBranch, Branch } from '../branch.model';
import { BranchService } from '../service/branch.service';
import { IDomain } from 'app/entities/domain/domain.model';
import { DomainService } from 'app/entities/domain/service/domain.service';

@Component({
  selector: 'jhi-branch-update',
  templateUrl: './branch-update.component.html',
})
export class BranchUpdateComponent implements OnInit {
  isSaving = false;

  domainsSharedCollection: IDomain[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    domain: [],
  });

  constructor(
    protected branchService: BranchService,
    protected domainService: DomainService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ branch }) => {
      this.updateForm(branch);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const branch = this.createFromForm();
    if (branch.id !== undefined) {
      this.subscribeToSaveResponse(this.branchService.update(branch));
    } else {
      this.subscribeToSaveResponse(this.branchService.create(branch));
    }
  }

  trackDomainById(index: number, item: IDomain): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBranch>>): void {
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

  protected updateForm(branch: IBranch): void {
    this.editForm.patchValue({
      id: branch.id,
      name: branch.name,
      description: branch.description,
      domain: branch.domain,
    });

    this.domainsSharedCollection = this.domainService.addDomainToCollectionIfMissing(this.domainsSharedCollection, branch.domain);
  }

  protected loadRelationshipsOptions(): void {
    this.domainService
      .query()
      .pipe(map((res: HttpResponse<IDomain[]>) => res.body ?? []))
      .pipe(map((domains: IDomain[]) => this.domainService.addDomainToCollectionIfMissing(domains, this.editForm.get('domain')!.value)))
      .subscribe((domains: IDomain[]) => (this.domainsSharedCollection = domains));
  }

  protected createFromForm(): IBranch {
    return {
      ...new Branch(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      domain: this.editForm.get(['domain'])!.value,
    };
  }
}
