"use client";

type TemplateOption = {
  id: string;
  name: string;
  category: string;
};

export function TemplatePicker({
  templates,
  value,
  onChange
}: {
  templates: TemplateOption[];
  value?: string;
  onChange: (templateId: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      Plantilla
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
      >
        <option value="">Selecciona una plantilla</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name} · {template.category}
          </option>
        ))}
      </select>
    </label>
  );
}
