import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../block.test-samples';

import { BlockFormService } from './block-form.service';

describe('Block Form Service', () => {
  let service: BlockFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockFormService);
  });

  describe('Service methods', () => {
    describe('createBlockFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBlockFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            order: expect.any(Object),
            payload: expect.any(Object),
            organization: expect.any(Object),
            space: expect.any(Object),
            article: expect.any(Object),
            author: expect.any(Object),
          })
        );
      });

      it('passing IBlock should create a new form with FormGroup', () => {
        const formGroup = service.createBlockFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            order: expect.any(Object),
            payload: expect.any(Object),
            organization: expect.any(Object),
            space: expect.any(Object),
            article: expect.any(Object),
            author: expect.any(Object),
          })
        );
      });
    });

    describe('getBlock', () => {
      it('should return NewBlock for default Block initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBlockFormGroup(sampleWithNewData);

        const block = service.getBlock(formGroup) as any;

        expect(block).toMatchObject(sampleWithNewData);
      });

      it('should return NewBlock for empty Block initial value', () => {
        const formGroup = service.createBlockFormGroup();

        const block = service.getBlock(formGroup) as any;

        expect(block).toMatchObject({});
      });

      it('should return IBlock', () => {
        const formGroup = service.createBlockFormGroup(sampleWithRequiredData);

        const block = service.getBlock(formGroup) as any;

        expect(block).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBlock should not enable id FormControl', () => {
        const formGroup = service.createBlockFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBlock should disable id FormControl', () => {
        const formGroup = service.createBlockFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
