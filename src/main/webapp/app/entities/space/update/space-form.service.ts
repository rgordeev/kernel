import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISpace, NewSpace } from '../space.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISpace for edit and NewSpaceFormGroupInput for create.
 */
type SpaceFormGroupInput = ISpace | PartialWithRequiredKeyOf<NewSpace>;

type SpaceFormDefaults = Pick<NewSpace, 'id'>;

type SpaceFormGroupContent = {
  id: FormControl<ISpace['id'] | NewSpace['id']>;
  title: FormControl<ISpace['title']>;
  projectCode: FormControl<ISpace['projectCode']>;
  icon: FormControl<ISpace['icon']>;
  organization: FormControl<ISpace['organization']>;
  owner: FormControl<ISpace['owner']>;
};

export type SpaceFormGroup = FormGroup<SpaceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SpaceFormService {
  createSpaceFormGroup(space: SpaceFormGroupInput = { id: null }): SpaceFormGroup {
    const spaceRawValue = {
      ...this.getFormDefaults(),
      ...space,
    };
    return new FormGroup<SpaceFormGroupContent>({
      id: new FormControl(
        { value: spaceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(spaceRawValue.title),
      projectCode: new FormControl(spaceRawValue.projectCode),
      icon: new FormControl(spaceRawValue.icon),
      organization: new FormControl(spaceRawValue.organization),
      owner: new FormControl(spaceRawValue.owner),
    });
  }

  getSpace(form: SpaceFormGroup): ISpace | NewSpace {
    return form.getRawValue() as ISpace | NewSpace;
  }

  resetForm(form: SpaceFormGroup, space: SpaceFormGroupInput): void {
    const spaceRawValue = { ...this.getFormDefaults(), ...space };
    form.reset(
      {
        ...spaceRawValue,
        id: { value: spaceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SpaceFormDefaults {
    return {
      id: null,
    };
  }
}
