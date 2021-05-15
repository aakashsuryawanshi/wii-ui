import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';
import { ISubject } from 'app/entities/subject/subject.model';

@Component({
  selector: 'jhi-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  branchId?: number;
  semesters?: ISemester[];
  constructor(private activatedRoute: ActivatedRoute, private semesterService: SemesterService) {}

  ngOnInit(): void {
    this.branchId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    console.warn('init branch');
    console.warn(this.branchId);
    this.semesterService.findByBranchId(this.branchId).subscribe((resp: HttpResponse<ISemester[]>) => {
      this.semesters = resp.body ?? [];
      console.warn(this.semesters);
    });
  }
}
