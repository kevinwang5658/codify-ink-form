import { FormField, FormStructure } from './types.js';

export const canSubmit = (form: FormStructure, values: Array<Record<string, unknown>>) => {
  for (const [idx, value] of Object.entries(values)) {
    const fields = form.sections[idx].fields as FormField[];

    for (const field of fields) {
      if (field.required && (value[field.name] === undefined || value[field.name] === '')) {
        return false;
      }
    }
  }

  return true;
};
