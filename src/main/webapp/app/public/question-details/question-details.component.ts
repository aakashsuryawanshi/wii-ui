import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IContent } from 'app/entities/content/content.model';
import { ContentService } from 'app/entities/content/service/content.service';
import { ContentType } from 'app/entities/enumerations/content-type.model';
import { FileDetailsService } from 'app/entities/file-details/service/file-details.service';
import { Question } from 'app/entities/question/question.model';
import { Observable } from 'rxjs';

class FileData {
  name: string;
  data: string | ArrayBuffer | null;

  constructor(n: string, d: string | ArrayBuffer | null) {
    this.name = n;
    this.data = d;
  }
  getName(): string {
    return this.name;
  }
  getData(): string | ArrayBuffer | null {
    return this.data;
  }
}

@Component({
  selector: 'jhi-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss'],
})
export class QuestionDetailsComponent implements OnInit {
  @Input()
  questionId?: number;
  fileMap: Map<number, ArrayBuffer> = new Map();
  public contents?: IContent[];

  constructor(private sanitizer: DomSanitizer, private contentService: ContentService, private fileService: FileDetailsService) {}

  ngOnInit(): void {
    this.contentService.findByQuestion(this.questionId!).subscribe((resp: HttpResponse<IContent[]>) => {
      this.contents = resp.body ?? [];
      this.contents.sort((a, b) => (a.seqNum! > b.seqNum! ? 1 : -1));
    });
  }

  getImageUrl(fileId: string): string {
    return this.fileService.getdownloadBaseUrl() + fileId;
  }
}
