import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Content, IContent } from 'app/entities/content/content.model';
import { IQuestion, Question } from 'app/entities/question/question.model';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';
import { SubjectService } from 'app/entities/subject/service/subject.service';
import { ISubject } from 'app/entities/subject/subject.model';
import { ITagMetaData, TagMetaData } from 'app/entities/tag-meta-data/tag-meta-data.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TextExtractionService } from '../service/text-extract.service';
import { AlertService } from 'app/core/util/alert.service';
import { ContentType } from 'app/entities/enumerations/content-type.model';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileDetailsService } from 'app/entities/file-details/service/file-details.service';
import { QuestionService } from 'app/entities/question/service/question.service';
import { ContentService } from 'app/entities/content/service/content.service';
import { TagMetaDataService } from 'app/entities/tag-meta-data/service/tag-meta-data.service';
import { IFileDetails } from 'app/entities/file-details/file-details.model';

class FileData {
  name: string;
  data: string | ArrayBuffer | null;
  actualFile: File;

  constructor(n: string, d: string | ArrayBuffer | null, a: File) {
    this.name = n;
    this.data = d;
    this.actualFile = a;
  }
  getName(): string {
    return this.name;
  }
  getData(): string | ArrayBuffer | null {
    return this.data;
  }

  getActualFile(): File {
    return this.actualFile;
  }
}

@Component({
  selector: 'jhi-question-entry',
  templateUrl: './question-entry.component.html',
  styleUrls: ['./question-entry.component.scss'],
})
export class QuestionEntryComponent implements OnInit {
  inputVisible = false;
  tagValue = '';
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  subjectId?: number;
  question?: IQuestion = new Question();
  tags?: ITagMetaData[] = [];
  contents?: IContent[] = [];
  subject?: ISubject;
  seqNum?: number;
  fileMap: Map<number, FileData> = new Map();

  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,
    private fileDetailService: FileDetailsService,
    private questionSerrice: QuestionService,
    private tagMetaDataService: TagMetaDataService,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.seqNum = 0;
    this.subjectId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.subjectService.find(this.subjectId).subscribe((resp: HttpResponse<ISubject>) => {
      this.subject = resp.body!;
    });
  }

  addPara(): void {
    const con: IContent = new Content();
    con.text = 'sample content';
    con.type = ContentType.PARA;
    con.seqNum = this.seqNum;
    this.contents?.push(con);
    this.seqNum!++;
  }

  addImg(event: HTMLInputElement): void {
    const file: File = event.files![0];
    const reader = new FileReader();
    reader.onload = e => {
      this.fileMap.set(this.seqNum!, new FileData(file.name, reader.result, file));
      const con: IContent = new Content();
      con.filePath = ''; // reader.result;
      con.type = ContentType.IMAGE;
      con.seqNum = this.seqNum;
      this.contents?.push(con);
      this.seqNum!++;
    };
    reader.readAsDataURL(file);
  }

  previewImg(sq: number | null | undefined): string | ArrayBuffer | null | undefined {
    return this.fileMap.get(sq!)?.getData();
  }

  handleClose(removedTag: ITagMetaData): void {
    this.tags = this.tags!.filter(tag => tag.key !== removedTag.key && tag.value !== removedTag.value);
  }

  sliceTagName(tag: ITagMetaData): string {
    // const isLongTag = tag.length > 20;
    // return isLongTag ? `${tag.slice(0, 20)}...` : tag;
    return String(tag.key) + ' : ' + String(tag.value);
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.tagValue.indexOf(':') === -1) {
      this.msg.error("Please add ':' in tag");
      return;
    }
    const val: ITagMetaData[] = this.tags!.filter(
      tag => tag.key === this.tagValue.split(':')[0] && tag.value === this.tagValue.split(':')[1]
    );
    if (val.length === 0) {
      const v2: ITagMetaData = new TagMetaData();
      v2.key = this.tagValue.split(':')[0];
      v2.value = this.tagValue.split(':')[1];
      this.tags?.push(v2);
    } else {
      this.msg.error('Duplicate value');
    }
    this.tagValue = '';
    this.inputVisible = false;
  }

  save(): void {
    console.warn(this.question);
    console.warn(this.contents);
    console.warn(this.tags);
    this.question!.subject = this.subject;
    this.questionSerrice.create(this.question!).subscribe((resp: HttpResponse<IQuestion>) => {
      for (let i = 0; i < this.tags!.length; i++) {
        const t: TagMetaData = this.tags![i];
        t.question = resp.body;
        this.tagMetaDataService.create(t).subscribe((tagResp: HttpResponse<ITagMetaData>) => {
          this.msg.success('Saved Successfully');
        });
      }
      for (let i = 0; i < this.contents!.length; i++) {
        const t: Content = this.contents![i];
        t.question = resp.body;
        if (t.type === ContentType.PARA) {
          this.contentService.create(t).subscribe((contentResp: HttpResponse<IContent>) => {
            this.msg.success('Saved Successfully');
          });
        } else if (t.type === ContentType.IMAGE) {
          const formData: FormData = new FormData();
          formData.append('file', this.fileMap.get(t.seqNum!)!.getActualFile(), this.fileMap.get(t.seqNum!)!.getName());
          this.fileDetailService.upload(formData).subscribe((fileUploadResp: HttpResponse<IFileDetails>) => {
            t.filePath = fileUploadResp.body!.id?.toString();
            this.contentService.create(t).subscribe((contentResp: HttpResponse<IContent>) => {
              this.msg.success('Saved Successfully');
            });
          });
        }
      }
    });
  }
}
