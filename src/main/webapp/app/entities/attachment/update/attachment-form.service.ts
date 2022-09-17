import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAttachment, NewAttachment } from '../attachment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAttachment for edit and NewAttachmentFormGroupInput for create.
 */
type AttachmentFormGroupInput = IAttachment | PartialWithRequiredKeyOf<NewAttachment>;

type AttachmentFormDefaults = Pick<NewAttachment, 'id'>;

type AttachmentFormGroupContent = {
  id: FormControl<IAttachment['id'] | NewAttachment['id']>;
  uuid: FormControl<IAttachment['uuid']>;
  uri: FormControl<IAttachment['uri']>;
  fileName: FormControl<IAttachment['fileName']>;
  mimeType: FormControl<IAttachment['mimeType']>;
  length: FormControl<IAttachment['length']>;
  organization: FormControl<IAttachment['organization']>;
  space: FormControl<IAttachment['space']>;
  article: FormControl<IAttachment['article']>;
  owner: FormControl<IAttachment['owner']>;
  comment: FormControl<IAttachment['comment']>;
};

export type AttachmentFormGroup = FormGroup<AttachmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AttachmentFormService {
  createAttachmentFormGroup(attachment: AttachmentFormGroupInput = { id: null }): AttachmentFormGroup {
    const attachmentRawValue = {
      ...this.getFormDefaults(),
      ...attachment,
    };
    return new FormGroup<AttachmentFormGroupContent>({
      id: new FormControl(
        { value: attachmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      uuid: new FormControl(attachmentRawValue.uuid),
      uri: new FormControl(attachmentRawValue.uri),
      fileName: new FormControl(attachmentRawValue.fileName),
      mimeType: new FormControl(attachmentRawValue.mimeType),
      length: new FormControl(attachmentRawValue.length),
      organization: new FormControl(attachmentRawValue.organization),
      space: new FormControl(attachmentRawValue.space),
      article: new FormControl(attachmentRawValue.article),
      owner: new FormControl(attachmentRawValue.owner),
      comment: new FormControl(attachmentRawValue.comment),
    });
  }

  getAttachment(form: AttachmentFormGroup): IAttachment | NewAttachment {
    return form.getRawValue() as IAttachment | NewAttachment;
  }

  resetForm(form: AttachmentFormGroup, attachment: AttachmentFormGroupInput): void {
    const attachmentRawValue = { ...this.getFormDefaults(), ...attachment };
    form.reset(
      {
        ...attachmentRawValue,
        id: { value: attachmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AttachmentFormDefaults {
    return {
      id: null,
    };
  }
}
