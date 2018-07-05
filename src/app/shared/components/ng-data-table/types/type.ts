export type ColumnType =
  'text'
  | 'password'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'datetime-local'
  | 'select-popup';

export type AggregateType =
  'sum' |
  'average' |
  'max' |
  'min' |
  'count';

export type SelectionType = 'single' | 'multiple';

export type SelectionMode = 'checkbox' | 'radio';

export type ColumnResizeMode = 'simple' | 'aminated';

export type EditMode = 'editCellOnDblClick' | 'editProgrammatically';
