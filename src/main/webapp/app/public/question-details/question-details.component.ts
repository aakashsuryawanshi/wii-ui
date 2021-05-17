import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IContent } from 'app/entities/content/content.model';
import { ContentService } from 'app/entities/content/service/content.service';
import { Question } from 'app/entities/question/question.model';

@Component({
  selector: 'jhi-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss'],
})
export class QuestionDetailsComponent implements OnInit {
  @Input()
  questionId?: number;

  public contents?: IContent[];
  private question?: Question;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.findByQuestion(this.questionId!).subscribe((resp: HttpResponse<IContent[]>) => {
      this.contents = resp.body ?? [];
      this.contents.sort((a, b) => (a.seqNum! > b.seqNum! ? 1 : -1));
    });
    console.warn('working');
  }
}
