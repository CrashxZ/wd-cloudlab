"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { UtilizationChart } from "@/components/charts";
import { useCloudLab } from "@/components/provider";

const days = ["Mon 27", "Tue 28", "Wed 29", "Thu 30", "Fri 31"];
const blocks = ["WD usage", "CloudLab", "Available", "Maintenance"];
const legendColors = ["#252525", "#0067b1", "#d8eadf", "#f0b429"];

export default function Availability() {
  const { store } = useCloudLab();
  const [view, setView] = useState<"Week" | "Month">("Week");
  const columns = view === "Week" ? days : Array.from({ length: 12 }, (_, index) => `Day ${index + 1}`);

  return (
    <main className="page">
      <div className="container">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Live scheduling</span>
            <h1 className="section-title mt-3">Equipment availability.</h1>
            <p className="muted mt-3">Capacity shown is a prototype simulation and updates locally.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn !p-2.5" aria-label="Previous week"><ChevronLeft size={17}/></button>
            <button className="btn"><CalendarDays size={16}/> Jul 27 – 31, 2026</button>
            <button className="btn !p-2.5" aria-label="Next week"><ChevronRight size={17}/></button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(["Week", "Month"] as const).map(option => (
              <button key={option} onClick={() => setView(option)} className={`btn ${view === option ? "btn-dark" : ""}`}>{option}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            {blocks.map((block, index) => <span key={block} className="flex items-center gap-1"><Circle size={9} fill={legendColors[index]} stroke="none"/>{block}</span>)}
          </div>
        </div>

        <div className="card table-wrap mt-5 p-4">
          <table>
            <thead><tr><th>Equipment</th>{columns.map(day => <th key={day}>{day}</th>)}</tr></thead>
            <tbody>
              {store.equipment.map((equipment, row) => (
                <tr key={equipment.id}>
                  <td><b>{equipment.short}</b><small className="muted block">{equipment.name}</small></td>
                  {columns.map((day, index) => (
                    <td key={day}><div className={`h-9 min-w-20 rounded-lg ${equipment.state !== "Online" ? "bg-amber-300" : (index + row) % 4 === 0 ? "bg-neutral-800" : (index + row) % 3 === 0 ? "bg-red-500" : "bg-emerald-100"}`}/></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-grid mt-6">
          <section className="card p-6">
            <h2 className="text-lg font-extrabold">Capacity converted to opportunity</h2>
            <p className="muted mt-1 text-sm">Dark bars show existing WD utilization; blue is monetizable CloudLab capacity.</p>
            <div className="mt-4"><UtilizationChart data={store.equipment.map(item => ({ name:item.short, used:item.utilization, available:item.capacity }))}/></div>
          </section>
          <section className="card p-6">
            <span className="eyebrow">This month</span>
            <div className="mt-5 space-y-6">
              {[["Unused hours monetized", "312 hrs"], ["Incremental revenue", "$84.2k"], ["Capacity recovered", "29.4%"], ["Systems online", "7 of 8"]].map(([label, value]) => (
                <div key={label} className="border-b pb-4 last:border-0"><small className="muted">{label}</small><div className="metric mt-1">{value}</div></div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
