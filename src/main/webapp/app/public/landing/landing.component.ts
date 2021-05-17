import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';
import { SubjectService } from 'app/entities/subject/service/subject.service';
import { ISubject } from 'app/entities/subject/subject.model';

@Component({
  selector: 'jhi-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  branchId?: number;
  semesters?: ISemester[];
  subjects?: ISubject[] = [];
  currSubject?: ISubject;

  constructor(private activatedRoute: ActivatedRoute, private semesterService: SemesterService, private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.branchId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.semesterService.findByBranchId(this.branchId, 0, 50).subscribe((resp: HttpResponse<ISemester[]>) => {
      this.semesters = resp.body ?? [];
      for (let i = 0; i < this.semesters.length; i++) {
        this.subjectService.findBySemester(this.semesters[i].id!, 0, 50).subscribe((res: HttpResponse<ISubject[]>) => {
          this.subjects = this.subjects?.concat(res.body ?? []);
        });
      }
    });
  }

  public getTrimmedSemName(name?: string | null): string {
    let a: string = name!.replace('Semester', '');
    a = a.replace('semester', '');
    return a;
  }

  setCurrentSubject(obj: ISubject): void {
    this.currSubject = obj;
  }

  public something(asd: string): void {
    alert(asd);
  }
}
