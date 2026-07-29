"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCloudLab } from "@/components/provider";

export default function Signup() {
  const { login, update } = useCloudLab();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", company: "" });
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) return setError("Enter your full name to continue.");

    update(store => ({
      ...store,
      users: store.users.map(user => user.id === "u-customer"
        ? { ...user, name, company: form.company.trim() || user.company }
        : user)
    }));
    login("customer@cloudlab.demo", "demo123");
    router.push("/dashboard");
  };

  return (
    <main className="page">
      <div className="container max-w-2xl">
        <section className="card p-7 md:p-10">
          <span className="eyebrow">Customer access</span>
          <h1 className="mt-3 text-3xl font-black">Create your CloudLab account.</h1>
          <p className="muted mt-2">Personalize the customer demo identity and enter the workspace immediately.</p>
          <form className="mt-7 grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <label><span className="label">Full name</span><input autoFocus className="input" value={form.name} onChange={event => setForm({ ...form, name:event.target.value })}/></label>
            <label><span className="label">Company</span><input className="input" value={form.company} onChange={event => setForm({ ...form, company:event.target.value })}/></label>
            {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
            <button className="btn btn-primary md:col-span-2"><CheckCircle2 size={16}/>Create account and sign in</button>
          </form>
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">
            For this prototype, signup updates the customer demo name while retaining <b>customer@cloudlab.demo</b> and <b>demo123</b> for future sign-ins.
          </div>
          <p className="muted mt-5 text-center text-sm">Already have an account? <Link className="font-bold text-signal" href="/login">Sign in</Link></p>
        </section>
      </div>
    </main>
  );
}
