"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCloudLab } from "@/components/provider";

export default function Signup() {
  const { store, update } = useCloudLab();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", company: "", email: "", password: "" });
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 6) return setError("Enter your name, email, and a password of at least six characters.");
    if (store.users.some(u => u.email.toLowerCase() === form.email.toLowerCase())) return setError("An account with this email already exists.");
    update(s => ({ ...s, users: [...s.users, { id: `u-${Date.now()}`, ...form, role: "customer" }] }));
    router.push("/login");
  };
  return <main className="page"><div className="container max-w-2xl"><section className="card p-7 md:p-10"><span className="eyebrow">Customer access</span><h1 className="mt-3 text-3xl font-black">Create your CloudLab account.</h1><p className="muted mt-2">Your account stays in this browser as part of the prototype.</p><form className="mt-7 grid gap-4 md:grid-cols-2" onSubmit={submit}><label><span className="label">Full name</span><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label><span className="label">Company</span><input className="input" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></label><label className="md:col-span-2"><span className="label">Work email</span><input type="email" className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label className="md:col-span-2"><span className="label">Password</span><input type="password" className="input" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error&&<p className="md:col-span-2 text-sm text-red-600">{error}</p>}<button className="btn btn-primary md:col-span-2"><CheckCircle2 size={16}/>Create customer account</button></form><p className="muted mt-5 text-center text-sm">Already have an account? <Link className="font-bold text-signal" href="/login">Sign in</Link></p></section></div></main>;
}
