import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDomain } from '../domain.model';

@Component({
  selector: 'jhi-domain-detail',
  templateUrl: './domain-detail.component.html',
})
export class DomainDetailComponent implements OnInit {
  domain: IDomain | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ domain }) => {
      this.domain = domain;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
