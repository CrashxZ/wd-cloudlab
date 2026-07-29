export type Role = "customer" | "employee" | "administrator";
export type User = { id:string; name:string; email:string; password:string; role:Role; company?:string };
export type Equipment = { id:string; name:string; short:string; technique:string; location:string; utilization:number; capacity:number; state:"Online"|"Maintenance"|"Offline" };
export type Service = { id:string; title:string; technique:string; equipmentId:string; description:string; price:number; turnaround:number; published:boolean; featured?:boolean; parameters:string[] };
export type Deliverable = "Raw data"|"Standard report"|"Expert interpretation";
export type LabRequest = { id:string; number:string; customerId:string; serviceId:string; goal:string; sample:string; sampleCount:number; parameters:string; deliverable:Deliverable; schedule:string; file?:{name:string;type:string;size:number;status:string}; submittedAt:number; resultReadyAt:number; claimedBy?:string; note?:string; forcedComplete?:boolean };
export type Result = { requestId:string; technique:string; metrics:Record<string,string|number>; points:{x:number;y:number;y2?:number}[]; interpretation:string };
export type Store = { schemaVersion:number; users:User[]; equipment:Equipment[]; services:Service[]; requests:LabRequest[]; results:Result[] };
