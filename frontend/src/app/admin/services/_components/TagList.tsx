"use client";
import { Trash2, Plus } from "lucide-react";
import { SADDLE, TUSCAN } from "./constants";

interface Props {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}

export default function TagList({ label, items, onChange }: Props) {
  function update(i: number, val: string) {
    const next = [...items]; next[i] = val; onChange(next);
  }
  function add() { onChange([...items, ""]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div>
      <p className="font-cinzel text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: `${SADDLE}70` }}>
        {label}
      </p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`${label} item…`}
              className="flex-1 border rounded-lg px-3 py-2 font-dm text-sm outline-none"
              style={{ borderColor: `${TUSCAN}30`, color: SADDLE }}
            />
            <button
              onClick={() => remove(i)}
              disabled={items.length === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-30"
              style={{ background: "#FEE2E2" }}
            >
              <Trash2 size={12} style={{ color: "#DC2626" }} />
            </button>
          </div>
        ))}
        <button
          onClick={add}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-dm text-xs transition-colors"
          style={{ border: `1px dashed ${TUSCAN}40`, color: `${SADDLE}80` }}
        >
          <Plus size={12} /> Add
        </button>
      </div>
    </div>
  );
}
