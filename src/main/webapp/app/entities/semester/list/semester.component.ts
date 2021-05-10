import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISemester } from '../semester.model';
import { SemesterService } from '../service/semester.service';
import { SemesterDeleteDialogComponent } from '../delete/semester-delete-dialog.component';

@Component({
  selector: 'jhi-semester',
  templateUrl: './semester.component.html',
})
export class SemesterComponent implements OnInit {
  semesters?: ISemester[];
  isLoading = false;

  constructor(protected semesterService: SemesterService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.semesterService.query().subscribe(
      (res: HttpResponse<ISemester[]>) => {
        this.isLoading = false;
        this.semesters = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISemester): number {
    return item.id!;
  }

  delete(semester: ISemester): void {
    const modalRef = this.modalService.open(SemesterDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.semester = semester;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
