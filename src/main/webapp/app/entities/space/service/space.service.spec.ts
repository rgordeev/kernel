import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISpace } from '../space.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../space.test-samples';

import { SpaceService } from './space.service';

const requireRestSample: ISpace = {
  ...sampleWithRequiredData,
};

describe('Space Service', () => {
  let service: SpaceService;
  let httpMock: HttpTestingController;
  let expectedResult: ISpace | ISpace[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SpaceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Space', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const space = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(space).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Space', () => {
      const space = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(space).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Space', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Space', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Space', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSpaceToCollectionIfMissing', () => {
      it('should add a Space to an empty array', () => {
        const space: ISpace = sampleWithRequiredData;
        expectedResult = service.addSpaceToCollectionIfMissing([], space);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(space);
      });

      it('should not add a Space to an array that contains it', () => {
        const space: ISpace = sampleWithRequiredData;
        const spaceCollection: ISpace[] = [
          {
            ...space,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSpaceToCollectionIfMissing(spaceCollection, space);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Space to an array that doesn't contain it", () => {
        const space: ISpace = sampleWithRequiredData;
        const spaceCollection: ISpace[] = [sampleWithPartialData];
        expectedResult = service.addSpaceToCollectionIfMissing(spaceCollection, space);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(space);
      });

      it('should add only unique Space to an array', () => {
        const spaceArray: ISpace[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const spaceCollection: ISpace[] = [sampleWithRequiredData];
        expectedResult = service.addSpaceToCollectionIfMissing(spaceCollection, ...spaceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const space: ISpace = sampleWithRequiredData;
        const space2: ISpace = sampleWithPartialData;
        expectedResult = service.addSpaceToCollectionIfMissing([], space, space2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(space);
        expect(expectedResult).toContain(space2);
      });

      it('should accept null and undefined values', () => {
        const space: ISpace = sampleWithRequiredData;
        expectedResult = service.addSpaceToCollectionIfMissing([], null, space, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(space);
      });

      it('should return initial array if no Space is added', () => {
        const spaceCollection: ISpace[] = [sampleWithRequiredData];
        expectedResult = service.addSpaceToCollectionIfMissing(spaceCollection, undefined, null);
        expect(expectedResult).toEqual(spaceCollection);
      });
    });

    describe('compareSpace', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSpace(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSpace(entity1, entity2);
        const compareResult2 = service.compareSpace(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSpace(entity1, entity2);
        const compareResult2 = service.compareSpace(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSpace(entity1, entity2);
        const compareResult2 = service.compareSpace(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
