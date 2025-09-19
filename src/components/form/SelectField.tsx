// components/form/SelectField.tsx
import { SelectField as T } from "./field-types";

export default function SelectField({ name, label, required, value, options }: T) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-800">
        {label}{required ? " *" : ""}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={value ?? ""}
        required={!!required}
        className="mt-1 block w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
