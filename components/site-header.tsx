"use client";

import Link from "next/link";
import { FlaskConical, LogOut, Menu, UserRound } from "lucide-react";
import { useState } from "react";
import { useCloudLab } from "./provider";

export function SiteHeader() {
  const { user, logout } = useCloudLab();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="container flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-black tracking-[-.03em]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-signal text-white"><FlaskConical size={19}/></span>
          <span>WD CloudLab</span><span className="badge hide-mobile">Hackathon Prototype</span>
        </Link>
        <nav className={`${open ? "flex" : "hidden"} absolute left-0 top-[72px] w-full flex-col gap-4 border-b bg-white p-5 md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:p-0`}>
          <Link href="/catalog">Services</Link><Link href="/availability">Availability</Link>
          {user && <Link href="/dashboard">Dashboard</Link>}
          {(user?.role === "employee" || user?.role === "administrator") && <Link href="/manage">Manage</Link>}
          {user ? <><span className="badge"><UserRound size={13}/>{user.name} · {user.role}</span><button className="btn !p-2.5" onClick={logout} aria-label="Log out"><LogOut size={16}/></button></> : <><Link className="hide-mobile text-sm font-bold" href="/signup">Create account</Link><Link className="btn btn-dark" href="/login">Sign in</Link></>}
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Toggle navigation"><Menu/></button>
      </div>
    </header>
  );
}
