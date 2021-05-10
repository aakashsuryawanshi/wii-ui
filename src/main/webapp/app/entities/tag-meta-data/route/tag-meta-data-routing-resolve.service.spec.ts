jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITagMetaData, TagMetaData } from '../tag-meta-data.model';
import { TagMetaDataService } from '../service/tag-meta-data.service';

import { TagMetaDataRoutingResolveService } from './tag-meta-data-routing-resolve.service';

describe('Service Tests', () => {
  describe('TagMetaData routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TagMetaDataRoutingResolveService;
    let service: TagMetaDataService;
    let resultTagMetaData: ITagMetaData | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TagMetaDataRoutingResolveService);
      service = TestBed.inject(TagMetaDataService);
      resultTagMetaData = undefined;
    });

    describe('resolve', () => {
      it('should return ITagMetaData returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTagMetaData = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTagMetaData).toEqual({ id: 123 });
      });

      it('should return new ITagMetaData if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTagMetaData = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTagMetaData).toEqual(new TagMetaData());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTagMetaData = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTagMetaData).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
