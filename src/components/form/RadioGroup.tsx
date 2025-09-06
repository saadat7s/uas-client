// components/form/RadioGroup.tsx
import { RadioField as T } from "./field-types";
// If you want to use your existing OptionRow, replace the <label> block below
// with <OptionRow ...>...children...</OptionRow> and map props accordingly.

export default function RadioGroup({ name, label, required, value, options }: T) {
  return (
    <fieldset className="mb-4">
      <legend className="block text-sm font-medium text-gray-800 mb-1">
        {label}{required ? " *" : ""}
      </legend>
      <div className="flex items-center gap-6">
        {options.map(o => (
          <label key={o.value} className="inline-flex items-center gap-2">
            <input
              type="radio"
              name={name}
              value={o.value}
              defaultChecked={value === o.value}
              className="accent-emerald-600"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
