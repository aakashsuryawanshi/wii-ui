import { Component, OnInit, Input } from '@angular/core';

import { QuestionService } from 'app/entities/question/service/question.service';
import { TagMetaDataService } from 'app/entities/tag-meta-data/service/tag-meta-data.service';
import { IQuestion } from 'app/entities/question/question.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css'],
})
export class QuestionListComponent implements OnInit {
  @Input()
  branchId?: number;
  questions?: IQuestion[];
  questionCount?: number;
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

  constructor(private questionService: QuestionService, private tagMetaDataService: TagMetaDataService) {}

  ngOnInit(): void {
    this.getQuestionsBySubject();
  }

  getQuestionsBySubject(): void {
    this.questionService.findBySubject(604, this.currentPageIndex, this.pageSize).subscribe((res: HttpResponse<IQuestion[]>) => {
      this.questions = res.body ?? [];
      this.questionCount = 10;
    });
  }

  changePageIndex(pageIndex: number): void {
    this.currentPageIndex = pageIndex;
    this.getQuestionsBySubject();
  }
}
