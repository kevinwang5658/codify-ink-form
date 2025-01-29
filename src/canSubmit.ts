import { FormStructure } from './types.js';

export const canSubmit = (form: FormStructure, values: Array<Record<string, unknown>>) => {
  return form.sections
    .map(section => section.fields)
    .reduce((fields1, fields2) => [...fields1, ...fields2], [])
    .map(field => !field.required || (values[field.name] !== undefined && values[field.name] !== ''))
    .reduce((field1, field2) => field1 && field2, true);

  return true;
};
