import { BlockType } from 'app/entities/enumerations/block-type.model';

import { IBlock, NewBlock } from './block.model';

export const sampleWithRequiredData: IBlock = {
  id: 80619,
};

export const sampleWithPartialData: IBlock = {
  id: 52006,
  type: BlockType['IMAGE'],
  order: 75501,
  payload: 'embrace Ethiopia Grocery',
};

export const sampleWithFullData: IBlock = {
  id: 47269,
  type: BlockType['TEXT'],
  order: 84140,
  payload: 'deposit bricks-and-clicks',
};

export const sampleWithNewData: NewBlock = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
