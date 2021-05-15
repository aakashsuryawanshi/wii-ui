import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDomain } from '../domain.model';
import { DomainService } from '../service/domain.service';
import { DomainDeleteDialogComponent } from '../delete/domain-delete-dialog.component';

@Component({
  selector: 'jhi-domain',
  templateUrl: './domain.component.html',
})
export class DomainComponent implements OnInit {
  domains?: IDomain[];
  isLoading = false;

  constructor(protected domainService: DomainService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.domainService.query().subscribe(
      (res: HttpResponse<IDomain[]>) => {
        this.isLoading = false;
        this.domains = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDomain): number {
    return item.id!;
  }

  delete(domain: IDomain): void {
    const modalRef = this.modalService.open(DomainDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.domain = domain;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
