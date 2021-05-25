import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFileMetaData } from '../file-meta-data.model';

@Component({
  selector: 'jhi-file-meta-data-detail',
  templateUrl: './file-meta-data-detail.component.html',
})
export class FileMetaDataDetailComponent implements OnInit {
  fileMetaData: IFileMetaData | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fileMetaData }) => {
      this.fileMetaData = fileMetaData;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
