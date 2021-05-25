import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFileDetails } from '../file-details.model';
import { FileDetailsService } from '../service/file-details.service';

@Component({
  templateUrl: './file-details-delete-dialog.component.html',
})
export class FileDetailsDeleteDialogComponent {
  fileDetails?: IFileDetails;

  constructor(protected fileDetailsService: FileDetailsService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fileDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
