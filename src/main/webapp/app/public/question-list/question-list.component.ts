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
  //@Input()
  subjectId?: number;

  questions?: IQuestion[];
  questionCount?: number;
  currentQuestion?: IQuestion;

  currentPageIndex = 1;
  pageSize = 5;
  yearCount = 0;
  questionTags = [
    {
      key: 'year',
      value: '2020',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute, private questionService: QuestionService) {}

  ngOnInit(): void {
    this.subjectId = +this.activatedRoute.snapshot.queryParamMap.get('subject')!;
    this.getQuestionsBySubject();
  }

  getQuestionsBySubject(): void {
    this.questionService
      .findBySubject(this.subjectId!, this.currentPageIndex - 1, this.pageSize)
      .subscribe((res: HttpResponse<IQuestion[]>) => {
        this.questions = res.body ?? [];
        this.questionCount = Number(res.headers.get('x-total-elements'));
      });
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
}
