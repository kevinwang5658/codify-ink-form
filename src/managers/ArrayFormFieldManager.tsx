import {
  FormFieldArray,
  FormFieldManager,
  FormFieldValueRendererProps,
  SpecificFormFieldRendererProps,
  TypeOfField,
} from '../types.js';
import React from 'react';
import { ArrayFieldRenderer } from '../ArrayFieldRenderer.js';

export class ArrayFormFieldManager implements FormFieldManager<FormFieldArray> {
  public type: TypeOfField<FormFieldArray> = 'array';

  public renderField: React.FC<SpecificFormFieldRendererProps<FormFieldArray>> = props => (
    <ArrayFieldRenderer {...props} />
  );

  public renderValue: React.FC<FormFieldValueRendererProps<FormFieldArray>> = props => <>{`[${props.value}]`}</>;
}
