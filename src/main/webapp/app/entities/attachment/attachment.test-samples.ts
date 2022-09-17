import { IAttachment, NewAttachment } from './attachment.model';

export const sampleWithRequiredData: IAttachment = {
  id: 43624,
};

export const sampleWithPartialData: IAttachment = {
  id: 29502,
  uri: 'Montana Refined Proactive',
  fileName: 'circuit payment',
  mimeType: 'Central dedicated',
  length: 55782,
};

export const sampleWithFullData: IAttachment = {
  id: 4830,
  uuid: '4aef38ee-6808-4b8c-8ff4-5e93da0dcd4c',
  uri: 'executive',
  fileName: 'Burgs',
  mimeType: 'CSS',
  length: 59380,
};

export const sampleWithNewData: NewAttachment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
