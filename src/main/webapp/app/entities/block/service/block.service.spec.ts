import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlock } from '../block.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../block.test-samples';

import { BlockService } from './block.service';

const requireRestSample: IBlock = {
  ...sampleWithRequiredData,
};

describe('Block Service', () => {
  let service: BlockService;
  let httpMock: HttpTestingController;
  let expectedResult: IBlock | IBlock[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlockService);
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

    it('should create a Block', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const block = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(block).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Block', () => {
      const block = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(block).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Block', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Block', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Block', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBlockToCollectionIfMissing', () => {
      it('should add a Block to an empty array', () => {
        const block: IBlock = sampleWithRequiredData;
        expectedResult = service.addBlockToCollectionIfMissing([], block);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(block);
      });

      it('should not add a Block to an array that contains it', () => {
        const block: IBlock = sampleWithRequiredData;
        const blockCollection: IBlock[] = [
          {
            ...block,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBlockToCollectionIfMissing(blockCollection, block);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Block to an array that doesn't contain it", () => {
        const block: IBlock = sampleWithRequiredData;
        const blockCollection: IBlock[] = [sampleWithPartialData];
        expectedResult = service.addBlockToCollectionIfMissing(blockCollection, block);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(block);
      });

      it('should add only unique Block to an array', () => {
        const blockArray: IBlock[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const blockCollection: IBlock[] = [sampleWithRequiredData];
        expectedResult = service.addBlockToCollectionIfMissing(blockCollection, ...blockArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const block: IBlock = sampleWithRequiredData;
        const block2: IBlock = sampleWithPartialData;
        expectedResult = service.addBlockToCollectionIfMissing([], block, block2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(block);
        expect(expectedResult).toContain(block2);
      });

      it('should accept null and undefined values', () => {
        const block: IBlock = sampleWithRequiredData;
        expectedResult = service.addBlockToCollectionIfMissing([], null, block, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(block);
      });

      it('should return initial array if no Block is added', () => {
        const blockCollection: IBlock[] = [sampleWithRequiredData];
        expectedResult = service.addBlockToCollectionIfMissing(blockCollection, undefined, null);
        expect(expectedResult).toEqual(blockCollection);
      });
    });

    describe('compareBlock', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBlock(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBlock(entity1, entity2);
        const compareResult2 = service.compareBlock(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBlock(entity1, entity2);
        const compareResult2 = service.compareBlock(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBlock(entity1, entity2);
        const compareResult2 = service.compareBlock(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
