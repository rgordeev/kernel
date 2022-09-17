import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBlock, NewBlock } from '../block.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBlock for edit and NewBlockFormGroupInput for create.
 */
type BlockFormGroupInput = IBlock | PartialWithRequiredKeyOf<NewBlock>;

type BlockFormDefaults = Pick<NewBlock, 'id'>;

type BlockFormGroupContent = {
  id: FormControl<IBlock['id'] | NewBlock['id']>;
  type: FormControl<IBlock['type']>;
  order: FormControl<IBlock['order']>;
  payload: FormControl<IBlock['payload']>;
  organization: FormControl<IBlock['organization']>;
  space: FormControl<IBlock['space']>;
  article: FormControl<IBlock['article']>;
  author: FormControl<IBlock['author']>;
};

export type BlockFormGroup = FormGroup<BlockFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BlockFormService {
  createBlockFormGroup(block: BlockFormGroupInput = { id: null }): BlockFormGroup {
    const blockRawValue = {
      ...this.getFormDefaults(),
      ...block,
    };
    return new FormGroup<BlockFormGroupContent>({
      id: new FormControl(
        { value: blockRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(blockRawValue.type),
      order: new FormControl(blockRawValue.order),
      payload: new FormControl(blockRawValue.payload),
      organization: new FormControl(blockRawValue.organization),
      space: new FormControl(blockRawValue.space),
      article: new FormControl(blockRawValue.article),
      author: new FormControl(blockRawValue.author),
    });
  }

  getBlock(form: BlockFormGroup): IBlock | NewBlock {
    return form.getRawValue() as IBlock | NewBlock;
  }

  resetForm(form: BlockFormGroup, block: BlockFormGroupInput): void {
    const blockRawValue = { ...this.getFormDefaults(), ...block };
    form.reset(
      {
        ...blockRawValue,
        id: { value: blockRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BlockFormDefaults {
    return {
      id: null,
    };
  }
}
