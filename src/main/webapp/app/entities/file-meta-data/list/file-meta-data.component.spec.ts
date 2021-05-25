import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FileMetaDataService } from '../service/file-meta-data.service';

import { FileMetaDataComponent } from './file-meta-data.component';

describe('Component Tests', () => {
  describe('FileMetaData Management Component', () => {
    let comp: FileMetaDataComponent;
    let fixture: ComponentFixture<FileMetaDataComponent>;
    let service: FileMetaDataService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FileMetaDataComponent],
      })
        .overrideTemplate(FileMetaDataComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FileMetaDataComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FileMetaDataService);

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
      expect(comp.fileMetaData?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
