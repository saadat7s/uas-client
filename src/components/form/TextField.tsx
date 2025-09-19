// components/form/TextField.tsx
import { TextField as T } from "./field-types";

export default function TextField({ name, label, required, value, placeholder }: T) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-800">
        {label}{required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={value ?? ""}
        placeholder={placeholder}
        required={!!required}
        className="mt-1 block w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}
