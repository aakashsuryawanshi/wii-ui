import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBranch } from '../branch.model';

@Component({
  selector: 'jhi-branch-detail',
  templateUrl: './branch-detail.component.html',
})
export class BranchDetailComponent implements OnInit {
  branch: IBranch | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ branch }) => {
      this.branch = branch;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
