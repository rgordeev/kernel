import { ISpace, NewSpace } from './space.model';

export const sampleWithRequiredData: ISpace = {
  id: 92193,
};

export const sampleWithPartialData: ISpace = {
  id: 38275,
  icon: 'Finland monitor',
};

export const sampleWithFullData: ISpace = {
  id: 9819,
  title: 'synergistic Account',
  projectCode: 'Administrator',
  icon: 'full-range generating',
};

export const sampleWithNewData: NewSpace = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
