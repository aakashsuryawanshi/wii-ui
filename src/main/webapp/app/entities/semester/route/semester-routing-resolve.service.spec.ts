jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISemester, Semester } from '../semester.model';
import { SemesterService } from '../service/semester.service';

import { SemesterRoutingResolveService } from './semester-routing-resolve.service';

describe('Service Tests', () => {
  describe('Semester routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SemesterRoutingResolveService;
    let service: SemesterService;
    let resultSemester: ISemester | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SemesterRoutingResolveService);
      service = TestBed.inject(SemesterService);
      resultSemester = undefined;
    });

    describe('resolve', () => {
      it('should return ISemester returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSemester = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSemester).toEqual({ id: 123 });
      });

      it('should return new ISemester if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSemester = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSemester).toEqual(new Semester());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSemester = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSemester).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
