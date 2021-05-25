import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFileDetails, FileDetails } from '../file-details.model';
import { FileDetailsService } from '../service/file-details.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'jhi-file-details-update',
  templateUrl: './file-details-update.component.html',
})
export class FileDetailsUpdateComponent implements OnInit {
  isSaving = false;

  uploadFile: File | null = null;

  editForm = this.fb.group({
    id: [],
    sourceName: [],
    destinationName: [],
    destination: [],
    metaData: [],
  });

  constructor(protected fileDetailsService: FileDetailsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fileDetails }) => {
      this.updateForm(fileDetails);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fileDetails = this.createFromForm();
    if (fileDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.fileDetailsService.update(fileDetails));
    } else {
      this.subscribeToSaveResponse(this.fileDetailsService.create(fileDetails));
    }
  }

  handleFileInput(input: any): void {
    const fileList: FileList = input.target.files;
    this.uploadFile = fileList.item(0) ? fileList.item(0) : null;
  }

  handleUpload(): void {
    const formData = new FormData();
    formData.append('file', this.uploadFile!);
    this.fileDetailsService.upload(formData).subscribe(
      () => {
        this.uploadFile = null;
      },
      () => {
        //this.uploading = false;
        //this.msg.error('upload failed.');
      }
    );
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFileDetails>>): void {
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

  protected updateForm(fileDetails: IFileDetails): void {
    this.editForm.patchValue({
      id: fileDetails.id,
      sourceName: fileDetails.sourceName,
      destinationName: fileDetails.destinationName,
      destination: fileDetails.destination,
      metaData: fileDetails.metaData,
    });
  }

  protected createFromForm(): IFileDetails {
    return {
      ...new FileDetails(),
      id: this.editForm.get(['id'])!.value,
      sourceName: this.editForm.get(['sourceName'])!.value,
      destinationName: this.editForm.get(['destinationName'])!.value,
      destination: this.editForm.get(['destination'])!.value,
      metaData: this.editForm.get(['metaData'])!.value,
    };
  }
}
