import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBranch } from '../branch.model';
import { BranchService } from '../service/branch.service';
import { BranchDeleteDialogComponent } from '../delete/branch-delete-dialog.component';

@Component({
  selector: 'jhi-branch',
  templateUrl: './branch.component.html',
})
export class BranchComponent implements OnInit {
  branches?: IBranch[];
  isLoading = false;

  constructor(protected branchService: BranchService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.branchService.query().subscribe(
      (res: HttpResponse<IBranch[]>) => {
        this.isLoading = false;
        this.branches = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBranch): number {
    return item.id!;
  }

  delete(branch: IBranch): void {
    const modalRef = this.modalService.open(BranchDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.branch = branch;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
