import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDomain } from '../domain.model';
import { DomainService } from '../service/domain.service';

@Component({
  templateUrl: './domain-delete-dialog.component.html',
})
export class DomainDeleteDialogComponent {
  domain?: IDomain;

  constructor(protected domainService: DomainService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.domainService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
