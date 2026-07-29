import { LabRequest } from "./types";
export const stages=["Submitted","Technical Review","Sample Received","Test Scheduled","Measurement in Progress","Data Analysis","Completed"] as const;
export function statusOf(r:LabRequest,now=Date.now()){if(r.forcedComplete)return {name:"Completed",index:6,progress:100,remaining:0};const seconds=Math.max(0,(now-r.submittedAt)/1000);const index=Math.min(6,Math.floor(seconds/10));return{name:stages[index],index,progress:Math.min(100,seconds/60*100),remaining:Math.max(0,Math.ceil((r.resultReadyAt-now)/1000))};}
