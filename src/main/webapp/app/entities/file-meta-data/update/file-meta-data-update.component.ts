import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFileMetaData, FileMetaData } from '../file-meta-data.model';
import { FileMetaDataService } from '../service/file-meta-data.service';
import { IFileDetails } from 'app/entities/file-details/file-details.model';
import { FileDetailsService } from 'app/entities/file-details/service/file-details.service';

@Component({
  selector: 'jhi-file-meta-data-update',
  templateUrl: './file-meta-data-update.component.html',
})
export class FileMetaDataUpdateComponent implements OnInit {
  isSaving = false;

  fileDetailsSharedCollection: IFileDetails[] = [];

  editForm = this.fb.group({
    id: [],
    key: [],
    value: [],
    fileDetails: [],
  });

  constructor(
    protected fileMetaDataService: FileMetaDataService,
    protected fileDetailsService: FileDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fileMetaData }) => {
      this.updateForm(fileMetaData);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fileMetaData = this.createFromForm();
    if (fileMetaData.id !== undefined) {
      this.subscribeToSaveResponse(this.fileMetaDataService.update(fileMetaData));
    } else {
      this.subscribeToSaveResponse(this.fileMetaDataService.create(fileMetaData));
    }
  }

  trackFileDetailsById(index: number, item: IFileDetails): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFileMetaData>>): void {
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

  protected updateForm(fileMetaData: IFileMetaData): void {
    this.editForm.patchValue({
      id: fileMetaData.id,
      key: fileMetaData.key,
      value: fileMetaData.value,
      fileDetails: fileMetaData.fileDetails,
    });

    this.fileDetailsSharedCollection = this.fileDetailsService.addFileDetailsToCollectionIfMissing(
      this.fileDetailsSharedCollection,
      fileMetaData.fileDetails
    );
  }

  protected loadRelationshipsOptions(): void {
    this.fileDetailsService
      .query()
      .pipe(map((res: HttpResponse<IFileDetails[]>) => res.body ?? []))
      .pipe(
        map((fileDetails: IFileDetails[]) =>
          this.fileDetailsService.addFileDetailsToCollectionIfMissing(fileDetails, this.editForm.get('fileDetails')!.value)
        )
      )
      .subscribe((fileDetails: IFileDetails[]) => (this.fileDetailsSharedCollection = fileDetails));
  }

  protected createFromForm(): IFileMetaData {
    return {
      ...new FileMetaData(),
      id: this.editForm.get(['id'])!.value,
      key: this.editForm.get(['key'])!.value,
      value: this.editForm.get(['value'])!.value,
      fileDetails: this.editForm.get(['fileDetails'])!.value,
    };
  }
}
