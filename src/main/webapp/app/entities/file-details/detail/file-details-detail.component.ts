import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFileDetails } from '../file-details.model';

@Component({
  selector: 'jhi-file-details-detail',
  templateUrl: './file-details-detail.component.html',
})
export class FileDetailsDetailComponent implements OnInit {
  fileDetails: IFileDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fileDetails }) => {
      this.fileDetails = fileDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
