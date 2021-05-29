import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Content } from 'app/entities/content/content.model';
import { Question } from 'app/entities/question/question.model';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';
import { SubjectService } from 'app/entities/subject/service/subject.service';
import { ISubject } from 'app/entities/subject/subject.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TextExtractionService } from '../service/text-extract.service';

@Component({
  selector: 'jhi-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss'],
})
export class AnnotationComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  currSubject?: ISubject;
  imgs: any = [];
  previewEnabled?: boolean;
  constructor(private activatedRoute: ActivatedRoute, private subjectService: SubjectService, private textService: TextExtractionService) {}

  ngOnInit(): void {
    console.warn('working');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: HTMLImageElement): void {
    // show cropper
  }

  cropperReady(): void {
    // cropper ready
  }

  loadImageFailed(): void {
    // show message
  }

  enablePreview(): void {
    this.previewEnabled = !this.previewEnabled;
  }
  markAs(input: string): void {
    this.imgs.push({ type: input, value: this.croppedImage });
    this.croppedImage = null;
  }

  sendForExtraction(): void {
    console.warn(this.imgs);
    const formData = new FormData();
    formData.append('file', new Blob(this.croppedImage));
    this.textService.extract(formData).subscribe((res: HttpResponse<string>) => {
      console.warn('printing extraction');
      console.warn(res.body);
    });
  }
}
