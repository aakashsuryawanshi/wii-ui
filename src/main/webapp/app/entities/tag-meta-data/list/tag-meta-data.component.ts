import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITagMetaData } from '../tag-meta-data.model';
import { TagMetaDataService } from '../service/tag-meta-data.service';
import { TagMetaDataDeleteDialogComponent } from '../delete/tag-meta-data-delete-dialog.component';

@Component({
  selector: 'jhi-tag-meta-data',
  templateUrl: './tag-meta-data.component.html',
})
export class TagMetaDataComponent implements OnInit {
  tagMetaData?: ITagMetaData[];
  isLoading = false;

  constructor(protected tagMetaDataService: TagMetaDataService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.tagMetaDataService.query().subscribe(
      (res: HttpResponse<ITagMetaData[]>) => {
        this.isLoading = false;
        this.tagMetaData = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITagMetaData): number {
    return item.id!;
  }

  delete(tagMetaData: ITagMetaData): void {
    const modalRef = this.modalService.open(TagMetaDataDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tagMetaData = tagMetaData;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
