import { Component, OnInit } from '@angular/core';

import { QuestionService } from 'app/entities/question/service/question.service';
import { IQuestion } from 'app/entities/question/question.model';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
})
export class QuestionListComponent implements OnInit {
  subjectId?: number;
  questions?: IQuestion[];
  questionCount?: number;
  currentQuestion?: IQuestion;
  searchValue = '';

  currentPageIndex = 1;
  pageSize = 5;
  yearCount = 0;
  filters = new Map();

  constructor(private activatedRoute: ActivatedRoute, private questionService: QuestionService) {}

  ngOnInit(): void {
    this.subjectId = +this.activatedRoute.snapshot.queryParamMap.get('subject')!;
    this.getQuestionsBySubject();
  }

  getQuestionsBySubject(): void {
    this.questionService
      .findBySubjectWithFilters(this.filters, this.searchValue, this.subjectId!, this.currentPageIndex - 1, this.pageSize)
      .subscribe((res: HttpResponse<IQuestion[]>) => {
        this.questions = res.body ?? [];
        this.questionCount = Number(res.headers.get('x-total-elements'));
        console.warn(this.questions);
      });
  }

  getQuestionsBySubjectWithFilters(subjectId: number, filters: Map<any, any>): void {
    this.filters = filters;
    console.warn(JSON.stringify(this.filters));
    this.subjectId = subjectId;
    this.getQuestionsBySubject();
  }

  changePageIndex(pageIndex: number): void {
    this.currentPageIndex = pageIndex;
    this.getQuestionsBySubject();
  }
  changePageSize(pagesize: number): void {
    this.pageSize = pagesize;
    this.getQuestionsBySubject();
  }

  setCurrentQuestion(obj: IQuestion): void {
    this.currentQuestion = obj;
  }

  incrementYearCount(): void {
    this.yearCount++;
  }

  resetYearCount(): void {
    this.yearCount = 0;
  }

  searchCriteria(): void {
    console.warn(this.searchValue);
    this.getQuestionsBySubject();
  }
}
