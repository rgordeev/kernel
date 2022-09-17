import { IOrganization, NewOrganization } from './organization.model';

export const sampleWithRequiredData: IOrganization = {
  id: 12784,
};

export const sampleWithPartialData: IOrganization = {
  id: 24389,
  title: 'synthesize',
};

export const sampleWithFullData: IOrganization = {
  id: 88472,
  title: 'Hawaii TCP',
};

export const sampleWithNewData: NewOrganization = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
