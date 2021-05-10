import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISemester } from '../semester.model';
import { SemesterService } from '../service/semester.service';

@Component({
  templateUrl: './semester-delete-dialog.component.html',
})
export class SemesterDeleteDialogComponent {
  semester?: ISemester;

  constructor(protected semesterService: SemesterService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.semesterService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
