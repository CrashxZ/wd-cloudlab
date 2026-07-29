"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { generateResult } from "@/lib/seed";
import { getSession, loadStore, saveStore, seedAndSave, setSession, STORE_KEY } from "@/lib/storage";
import { LabRequest, Service, Store, User } from "@/lib/types";

type Context={store:Store;ready:boolean;user:User|null;login:(email:string,password?:string)=>boolean;logout:()=>void;submit:(r:Omit<LabRequest,"id"|"number"|"customerId"|"submittedAt"|"resultReadyAt">)=>LabRequest;update:(fn:(s:Store)=>Store)=>void;reset:()=>void};
const C=createContext<Context|null>(null);
export function CloudLabProvider({children}:{children:React.ReactNode}){
 const [store,setStoreState]=useState<Store>(()=>({schemaVersion:2,users:[],equipment:[],services:[],requests:[],results:[]}));const [sessionId,setSessionId]=useState<string|null>(null);const [ready,setReady]=useState(false);
 useEffect(()=>{setStoreState(loadStore());setSessionId(getSession());setReady(true);const sync=(e:StorageEvent)=>{if(e.key===STORE_KEY)setStoreState(loadStore());};window.addEventListener("storage",sync);return()=>window.removeEventListener("storage",sync);},[]);
 const update=useCallback((fn:(s:Store)=>Store)=>{setStoreState(prev=>{const next=fn(prev);saveStore(next);return next;});},[]);
 const user=store.users.find(u=>u.id===sessionId)||null;
 const login=(email:string,password="demo123")=>{const found=store.users.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password);if(!found)return false;setSession(found.id);setSessionId(found.id);return true;};
 const logout=()=>{setSession(null);setSessionId(null);};
 const submit=(input:Omit<LabRequest,"id"|"number"|"customerId"|"submittedAt"|"resultReadyAt">)=>{const submittedAt=Date.now();const id=`req-${submittedAt}`;const r:LabRequest={...input,id,number:`WDCL-${new Date().getFullYear()}-${String(store.requests.length+1).padStart(4,"0")}`,customerId:user?.id||"u-customer",submittedAt,resultReadyAt:submittedAt+60000};const service=store.services.find(s=>s.id===r.serviceId) as Service;update(s=>({...s,requests:[r,...s.requests],results:[generateResult(id,service?.technique||"Generic"),...s.results]}));return r;};
 const reset=()=>{const s=seedAndSave();setStoreState(s);};
 const value={store,ready,user,login,logout,submit,update,reset};
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useCloudLab(){const c=useContext(C);if(!c)throw new Error("CloudLab context missing");return c;}
