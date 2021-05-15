import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITagMetaData } from '../tag-meta-data.model';
import { TagMetaDataService } from '../service/tag-meta-data.service';

@Component({
  templateUrl: './tag-meta-data-delete-dialog.component.html',
})
export class TagMetaDataDeleteDialogComponent {
  tagMetaData?: ITagMetaData;

  constructor(protected tagMetaDataService: TagMetaDataService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tagMetaDataService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
