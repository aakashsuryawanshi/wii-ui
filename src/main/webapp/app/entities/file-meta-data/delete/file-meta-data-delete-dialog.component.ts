import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFileMetaData } from '../file-meta-data.model';
import { FileMetaDataService } from '../service/file-meta-data.service';

@Component({
  templateUrl: './file-meta-data-delete-dialog.component.html',
})
export class FileMetaDataDeleteDialogComponent {
  fileMetaData?: IFileMetaData;

  constructor(protected fileMetaDataService: FileMetaDataService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fileMetaDataService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
