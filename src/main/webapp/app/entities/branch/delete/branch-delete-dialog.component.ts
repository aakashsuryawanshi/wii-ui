import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBranch } from '../branch.model';
import { BranchService } from '../service/branch.service';

@Component({
  templateUrl: './branch-delete-dialog.component.html',
})
export class BranchDeleteDialogComponent {
  branch?: IBranch;

  constructor(protected branchService: BranchService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.branchService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
