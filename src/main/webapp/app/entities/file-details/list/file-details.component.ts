import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFileDetails } from '../file-details.model';
import { FileDetailsService } from '../service/file-details.service';
import { FileDetailsDeleteDialogComponent } from '../delete/file-details-delete-dialog.component';

@Component({
  selector: 'jhi-file-details',
  templateUrl: './file-details.component.html',
})
export class FileDetailsComponent implements OnInit {
  fileDetails?: IFileDetails[];
  isLoading = false;

  constructor(protected fileDetailsService: FileDetailsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fileDetailsService.query().subscribe(
      (res: HttpResponse<IFileDetails[]>) => {
        this.isLoading = false;
        this.fileDetails = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFileDetails): number {
    return item.id!;
  }

  delete(fileDetails: IFileDetails): void {
    const modalRef = this.modalService.open(FileDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fileDetails = fileDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
