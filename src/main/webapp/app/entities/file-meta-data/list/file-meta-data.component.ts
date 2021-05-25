import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFileMetaData } from '../file-meta-data.model';
import { FileMetaDataService } from '../service/file-meta-data.service';
import { FileMetaDataDeleteDialogComponent } from '../delete/file-meta-data-delete-dialog.component';

@Component({
  selector: 'jhi-file-meta-data',
  templateUrl: './file-meta-data.component.html',
})
export class FileMetaDataComponent implements OnInit {
  fileMetaData?: IFileMetaData[];
  isLoading = false;

  constructor(protected fileMetaDataService: FileMetaDataService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fileMetaDataService.query().subscribe(
      (res: HttpResponse<IFileMetaData[]>) => {
        this.isLoading = false;
        this.fileMetaData = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFileMetaData): number {
    return item.id!;
  }

  delete(fileMetaData: IFileMetaData): void {
    const modalRef = this.modalService.open(FileMetaDataDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fileMetaData = fileMetaData;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
