"use client";

import { useMemo } from "react";

type ClientOption = {
  id: string;
  name: string;
  email?: string | null;
};

export function ClientPicker({
  clients,
  value,
  onChange
}: {
  clients: ClientOption[];
  value?: string;
  onChange: (clientId: string) => void;
}) {
  const options = useMemo(() => clients ?? [], [clients]);

  return (
    <label className="block text-sm font-medium text-slate-700">
      Cliente
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
      >
        <option value="">Selecciona un cliente</option>
        {options.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} {client.email ? `(${client.email})` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
