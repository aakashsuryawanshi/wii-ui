import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FileDetailsService } from '../service/file-details.service';

import { FileDetailsComponent } from './file-details.component';

describe('Component Tests', () => {
  describe('FileDetails Management Component', () => {
    let comp: FileDetailsComponent;
    let fixture: ComponentFixture<FileDetailsComponent>;
    let service: FileDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FileDetailsComponent],
      })
        .overrideTemplate(FileDetailsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FileDetailsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FileDetailsService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.fileDetails?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
