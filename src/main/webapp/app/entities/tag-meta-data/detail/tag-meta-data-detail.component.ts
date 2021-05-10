import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITagMetaData } from '../tag-meta-data.model';

@Component({
  selector: 'jhi-tag-meta-data-detail',
  templateUrl: './tag-meta-data-detail.component.html',
})
export class TagMetaDataDetailComponent implements OnInit {
  tagMetaData: ITagMetaData | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tagMetaData }) => {
      this.tagMetaData = tagMetaData;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
