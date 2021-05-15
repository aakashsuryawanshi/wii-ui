import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SemesterService } from 'app/entities/semester/service/semester.service';

@Component({
  selector: 'jhi-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  branchId?: number;

  constructor(private activatedRoute: ActivatedRoute, private semesterService: SemesterService) {}

  ngOnInit(): void {
    this.branchId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    console.warn('init branch');
    console.warn(this.branchId);
  }
}
