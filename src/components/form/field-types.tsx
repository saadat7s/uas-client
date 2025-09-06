// components/form/field-types.ts
export type TextField = {
  name: string;
  label: string;
  required?: boolean;
  value?: string | null;
  placeholder?: string;
};

export type SelectField = {
  name: string;
  label: string;
  required?: boolean;
  value?: string | null;
  options: { value: string; label: string }[];
};

export type RadioField = {
  name: string;
  label: string;
  required?: boolean;
  value?: string | null;
  options: { value: string; label: string }[];
};

export type AnyField = TextField | SelectField | RadioField;
