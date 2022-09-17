import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../space.test-samples';

import { SpaceFormService } from './space-form.service';

describe('Space Form Service', () => {
  let service: SpaceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceFormService);
  });

  describe('Service methods', () => {
    describe('createSpaceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSpaceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            projectCode: expect.any(Object),
            icon: expect.any(Object),
            organization: expect.any(Object),
            owner: expect.any(Object),
          })
        );
      });

      it('passing ISpace should create a new form with FormGroup', () => {
        const formGroup = service.createSpaceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            projectCode: expect.any(Object),
            icon: expect.any(Object),
            organization: expect.any(Object),
            owner: expect.any(Object),
          })
        );
      });
    });

    describe('getSpace', () => {
      it('should return NewSpace for default Space initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSpaceFormGroup(sampleWithNewData);

        const space = service.getSpace(formGroup) as any;

        expect(space).toMatchObject(sampleWithNewData);
      });

      it('should return NewSpace for empty Space initial value', () => {
        const formGroup = service.createSpaceFormGroup();

        const space = service.getSpace(formGroup) as any;

        expect(space).toMatchObject({});
      });

      it('should return ISpace', () => {
        const formGroup = service.createSpaceFormGroup(sampleWithRequiredData);

        const space = service.getSpace(formGroup) as any;

        expect(space).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISpace should not enable id FormControl', () => {
        const formGroup = service.createSpaceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSpace should disable id FormControl', () => {
        const formGroup = service.createSpaceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
