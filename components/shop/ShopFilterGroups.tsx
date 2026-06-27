"use client";

type FilterGroupProps = {
  title: string;
  options: Array<{ slug: string; name: string }>;
  selected: string[];
  onToggle: (slug: string) => void;
};

export function FilterCheckboxGroup({
  title,
  options,
  selected,
  onToggle,
}: FilterGroupProps) {
  if (options.length === 0) return null;

  return (
    <div className="mb-10 space-y-4">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">{title}</h4>
      <div className="max-h-48 space-y-3 overflow-y-auto pr-2">
        {options.map((option) => (
          <label
            key={option.slug}
            className="group flex cursor-pointer items-center space-x-3 text-sm"
          >
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 rounded-sm border-gray-300 text-[#7a0c0c] focus:ring-[#7a0c0c]"
              checked={selected.includes(option.slug)}
              onChange={() => onToggle(option.slug)}
            />
            <span className="text-gray-600 transition-colors group-hover:text-black">
              {option.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterRadioGroup({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: Array<{ slug: string; name: string }>;
  selected: string;
  onSelect: (slug: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="mb-10 space-y-4">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">{title}</h4>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.slug}
            className="group flex cursor-pointer items-center space-x-3 text-sm"
          >
            <input
              type="radio"
              name={title}
              className="h-4 w-4 border-gray-300 text-[#7a0c0c] focus:ring-[#7a0c0c]"
              checked={selected === option.slug}
              onChange={() => onSelect(selected === option.slug ? "" : option.slug)}
            />
            <span className="text-gray-600 transition-colors group-hover:text-black">
              {option.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
