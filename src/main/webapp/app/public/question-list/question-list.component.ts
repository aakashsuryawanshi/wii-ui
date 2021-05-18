import { Component, OnInit, Input } from '@angular/core';

import { QuestionService } from 'app/entities/question/service/question.service';
import { TagMetaDataService } from 'app/entities/tag-meta-data/service/tag-meta-data.service';
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
  pageSize = 3;
  questionTags = [
    {
      key: 'year',
      value: '2020',
    },
    {
      key: 'year',
      value: '2021',
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private tagMetaDataService: TagMetaDataService
  ) {}

  ngOnInit(): void {
    this.subjectId = +this.activatedRoute.snapshot.queryParamMap.get('subject')!;
    this.getQuestionsBySubject();
  }

  getQuestionsBySubject(): void {
    this.questionService
      .findBySubject(this.subjectId!, this.currentPageIndex, this.pageSize)
      .subscribe((res: HttpResponse<IQuestion[]>) => {
        this.questions = res.body ?? [];
        this.questionCount = 10;
      });
  }

  changePageIndex(pageIndex: number): void {
    this.currentPageIndex = pageIndex;
    this.getQuestionsBySubject();
  }

  setCurrentQuestion(obj: IQuestion): void {
    this.currentQuestion = obj;
  }
}
