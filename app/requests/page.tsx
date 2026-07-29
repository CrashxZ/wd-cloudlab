"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Check, Clock3, Download, FileText, FlaskConical, Printer } from "lucide-react";
import { ScienceChart } from "@/components/charts";
import { useCloudLab } from "@/components/provider";
import { stages, statusOf } from "@/lib/status";

function RequestDetail() {
  const { store, user, update } = useCloudLab();
  const id = useSearchParams().get("id");
  const request = store.requests.find(item => item.id === id);
  const [now, setNow] = useState(Date.now());
  const [note, setNote] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setNote(request?.note ?? "");
  }, [request?.id, request?.note]);

  if (!request) {
    return (
      <main className="page">
        <div className="container card p-14 text-center">
          <FlaskConical className="mx-auto text-neutral-300" size={40}/>
          <h1 className="mt-4 text-2xl font-bold">Request not found</h1>
          <p className="muted mt-2">This request may have been reset from local prototype storage.</p>
          <Link className="btn mt-5" href="/dashboard">Back to dashboard</Link>
        </div>
      </main>
    );
  }

  const status = statusOf(request, now);
  const service = store.services.find(item => item.id === request.serviceId);
  const result = store.results.find(item => item.requestId === request.id);
  const canOperate = user?.role === "employee" || user?.role === "administrator";

  const completeImmediately = () => {
    update(current => ({
      ...current,
      requests: current.requests.map(item => item.id === request.id
        ? { ...item, forcedComplete: true, resultReadyAt: Date.now() }
        : item)
    }));
  };

  const saveNote = () => {
    update(current => ({
      ...current,
      requests: current.requests.map(item => item.id === request.id ? { ...item, note } : item)
    }));
  };

  const download = (kind: "csv" | "json") => {
    if (!result) return;
    const content = kind === "json"
      ? JSON.stringify(result, null, 2)
      : `x,y,y2\n${result.points.map(point => `${point.x},${point.y},${point.y2 ?? ""}`).join("\n")}`;
    const blob = new Blob([content], { type: kind === "json" ? "application/json" : "text/csv" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${request.number}-result.${kind}`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  return (
    <main className="page">
      <div className="container">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <span className="eyebrow">{request.number}</span>
            <h1 className="mt-3 text-3xl font-black tracking-tight">{service?.title}</h1>
            <p className="muted mt-2">
              Submitted {new Date(request.submittedAt).toLocaleString()} · {request.sampleCount} sample{request.sampleCount > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="badge !px-4 !py-3">
              <i className={`status-dot ${status.name !== "Completed" ? "pulse" : ""}`}/>{status.name}
            </span>
            {canOperate && status.name !== "Completed" && (
              <button className="btn btn-primary" onClick={completeImmediately}>
                <Check size={16}/>Complete immediately
              </button>
            )}
          </div>
        </div>

        <section className="card mt-7 overflow-hidden">
          <div className="bg-neutral-950 p-7 text-white">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <small className="text-neutral-400">Estimated completion</small>
                <div className="mt-1 text-2xl font-black">
                  {status.remaining
                    ? `${String(Math.floor(status.remaining / 60)).padStart(2, "0")}:${String(status.remaining % 60).padStart(2, "0")} remaining`
                    : "Result ready"}
                </div>
              </div>
              <div className="w-full md:max-w-md">
                <div className="mb-2 flex justify-between text-xs text-neutral-400">
                  <span>Submitted</span><span>{Math.round(status.progress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full bg-signal transition-all duration-500" style={{ width: `${status.progress}%` }}/>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-5 md:grid-cols-7">
            {stages.map((name, index) => (
              <div key={name} className={`rounded-xl p-3 text-center ${index <= status.index ? "bg-red-50 text-red-800" : "bg-neutral-50 text-neutral-400"}`}>
                <div className={`mx-auto mb-2 grid h-7 w-7 place-items-center rounded-full ${index < status.index ? "bg-signal text-white" : index === status.index ? "border-2 border-signal bg-white" : "bg-neutral-200"}`}>
                  {index < status.index ? <Check size={13}/> : index + 1}
                </div>
                <span className="text-[11px] font-bold leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="chart-grid mt-6">
          <section className="card p-6">
            <h2 className="text-xl font-extrabold">Request specification</h2>
            <dl className="mt-5 space-y-4 text-sm">
              {[
                ["Engineering goal", request.goal],
                ["Sample", request.sample],
                ["Parameters", request.parameters],
                ["Deliverable", request.deliverable],
                ["Scheduling", request.schedule],
                ["Supporting file", request.file?.name ?? "None"]
              ].map(([label, value]) => (
                <div key={label} className="border-b pb-3">
                  <dt className="muted text-xs">{label}</dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-extrabold">Laboratory notes</h2>
            <p className="muted mt-1 text-sm">Customer-visible updates from the lab team.</p>
            {canOperate ? (
              <>
                <textarea className="input mt-5 min-h-28" value={note} onChange={event => setNote(event.target.value)} placeholder="Add a note…"/>
                <button onClick={saveNote} className="btn mt-3">Save note</button>
              </>
            ) : (
              <div className="mt-5 rounded-xl bg-neutral-50 p-4 text-sm">{request.note || "No laboratory notes yet."}</div>
            )}
          </section>
        </div>

        {status.name === "Completed" && result ? (
          <section className="card mt-6 overflow-hidden">
            <div className="flex flex-col justify-between gap-4 border-b p-6 md:flex-row md:items-center">
              <div><span className="eyebrow">Scientific output</span><h2 className="mt-2 text-2xl font-black">Simulated measurement result</h2></div>
              <div className="flex flex-wrap gap-2">
                <button className="btn" onClick={() => download("csv")}><Download size={15}/>CSV</button>
                <button className="btn" onClick={() => download("json")}><FileText size={15}/>JSON</button>
                <button className="btn" onClick={() => window.print()}><Printer size={15}/>Print report</button>
              </div>
            </div>
            <div className="bg-amber-50 p-3 text-center text-xs font-extrabold uppercase tracking-wider text-amber-900">
              Simulated Hackathon Result — Not an Actual Laboratory Measurement
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-4">
                {Object.entries(result.metrics).map(([label, value]) => (
                  <div className="rounded-2xl bg-neutral-50 p-4" key={label}>
                    <small className="muted">{label}</small><div className="mt-2 text-xl font-black">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-7"><ScienceChart points={result.points}/></div>
              <div className="mt-6 rounded-2xl border-l-4 border-signal bg-neutral-50 p-5">
                <b>Expert interpretation</b><p className="muted mt-2 leading-relaxed">{result.interpretation}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="card mt-6 p-10 text-center">
            <Clock3 className="mx-auto text-signal pulse" size={36}/>
            <h2 className="mt-4 text-xl font-extrabold">Your result is being generated</h2>
            <p className="muted mt-2">Technique-specific scientific data is already stored safely in this browser and will unlock at completion.</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="page container">Loading request…</div>}><RequestDetail/></Suspense>;
}
