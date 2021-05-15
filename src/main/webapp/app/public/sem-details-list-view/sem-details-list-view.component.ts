import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBranch } from 'app/entities/branch/branch.model';
import { BranchService } from 'app/entities/branch/service/branch.service';
import { IDomain } from 'app/entities/domain/domain.model';
import { DomainService } from 'app/entities/domain/service/domain.service';
import { ISemester } from 'app/entities/semester/semester.model';
import { ISubject } from 'app/entities/subject/subject.model';

@Component({
  selector: 'jhi-sem-details-list-view',
  templateUrl: './sem-details-list-view.component.html',
  styleUrls: ['./sem-details-list-view.component.scss'],
})
export class SemDetailsListViewComponent implements OnInit {
  @Input()
  branchId?: number;

  @Input()
  semesters?: ISemester[];

  @Input()
  subjects?: ISubject[];

  branch?: IBranch;
  domain?: IDomain;

  constructor(private activatedRoute: ActivatedRoute, private branchService: BranchService, private domainService: DomainService) {}

  ngOnInit(): void {
    console.warn('working fine');
    this.branchService.find(this.branchId!).subscribe((resp: HttpResponse<IBranch>) => {
      this.branch = resp.body!;
      this.domainService.find(this.branch.domain!.id!).subscribe((res: HttpResponse<IBranch>) => {
        this.domain = res.body!;
      });
    });
    /*
    this.semesterService.findByBranchId(this.branchId!).subscribe((resp: HttpResponse<ISemester[]>) => {
      this.semesters = resp.body ?? [];
      for(let i=0; i<this.semesters.length; i++){
        this.subjectService.findBySemester(this.semesters[i].id!).subscribe((res: HttpResponse<ISubject[]>) =>{
          this.subjects = this.subjects?.concat(res.body ?? []);
          console.warn(this.subjects);
        });
      }      
    });
    */
  }
}
