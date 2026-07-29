import { Equipment, Result, Service, Store, User } from "./types";

export const users: User[] = [
  {id:"u-customer",name:"Mainak Mondal",email:"customer@cloudlab.demo",password:"demo123",role:"customer",company:"CloudLab Customer"},
  {id:"u-employee",name:"Jacob Konnick",email:"employee@cloudlab.demo",password:"demo123",role:"employee"},
  {id:"u-admin",name:"Kelly Xiao",email:"admin@cloudlab.demo",password:"demo123",role:"administrator"}
];
export const equipment: Equipment[] = [
  ["afm","Dimension Icon AFM","AFM","Atomic Force Microscopy",68,32,"Online"], ["xrr","SmartLab XRR","XRR","X-Ray Reflectometry",75,25,"Online"],
  ["xrf","Axios FAST XRF","XRF","X-Ray Fluorescence",59,41,"Online"], ["xps","PHI VersaProbe III","ESCA/XPS","Photoelectron Spectroscopy",82,18,"Online"],
  ["elli","M-2000 Ellipsometer","ELL","Spectroscopic Ellipsometry",64,36,"Online"], ["scm","Dimension SCM","SCM","Scanning Capacitance",52,48,"Maintenance"],
  ["prof","DektakXT Profilometer","PRO","Surface Profilometry",71,29,"Online"], ["trib","MFT-5000 Tribometer","TRI","Tribology",46,54,"Online"]
].map(([id,name,short,technique,utilization,capacity,state])=>({id,name,short,technique,location:"San Jose Materials Lab",utilization,capacity,state} as Equipment));
const raw: Omit<Service,"id"|"published"|"parameters">[] = [
  {title:"AFM Surface Topography",technique:"AFM",equipmentId:"afm",description:"Nanometer-scale 3D surface morphology and roughness mapping.",price:850,turnaround:3,featured:true},
  {title:"AFM Phase Imaging",technique:"AFM",equipmentId:"afm",description:"High-resolution material phase contrast for heterogeneous surfaces.",price:1150,turnaround:4},
  {title:"Thin Film XRR Analysis",technique:"XRR",equipmentId:"xrr",description:"Film thickness, density and interface roughness by reflectometry.",price:1450,turnaround:4,featured:true},
  {title:"Multilayer XRR Modeling",technique:"XRR",equipmentId:"xrr",description:"Advanced fitting for complex stacks up to eight layers.",price:2850,turnaround:6},
  {title:"XRF Elemental Screening",technique:"XRF",equipmentId:"xrf",description:"Non-destructive elemental identification from sodium to uranium.",price:650,turnaround:2},
  {title:"Quantitative XRF Composition",technique:"XRF",equipmentId:"xrf",description:"Calibrated elemental composition with uncertainty analysis.",price:1650,turnaround:5},
  {title:"XPS Surface Survey",technique:"XPS",equipmentId:"xps",description:"Surface elemental survey and chemical-state identification.",price:1850,turnaround:5,featured:true},
  {title:"XPS Depth Profile",technique:"XPS",equipmentId:"xps",description:"Composition versus depth with controlled ion sputtering.",price:4500,turnaround:8},
  {title:"Optical Constants & Thickness",technique:"Ellipsometry",equipmentId:"elli",description:"Spectral n, k and film thickness across UV-visible wavelengths.",price:950,turnaround:3},
  {title:"SCM Carrier Profiling",technique:"SCM",equipmentId:"scm",description:"Two-dimensional carrier concentration and junction mapping.",price:3200,turnaround:7},
  {title:"Step Height Profilometry",technique:"Profilometry",equipmentId:"prof",description:"Precision step height and surface waviness measurement.",price:450,turnaround:2},
  {title:"Coefficient of Friction Test",technique:"Tribology",equipmentId:"trib",description:"Dynamic friction, wear depth and rate under controlled load.",price:2250,turnaround:6}
];
export const services:Service[]=raw.map((s,i)=>({...s,id:`svc-${i+1}`,published:true,parameters:["Measurement area","Scan resolution","Environmental condition"]}));
export const seedStore=():Store=>({schemaVersion:2,users,equipment,services,requests:[],results:[]});
export function generateResult(requestId:string, technique:string):Result {
  const points=Array.from({length:36},(_,i)=>({x:i,y:Number((45+Math.sin(i/3)*18+Math.random()*8).toFixed(2)),y2:Number((35+Math.cos(i/4)*12).toFixed(2))}));
  const t=technique.toLowerCase(); let metrics:Record<string,string|number>; let interpretation:string;
  if(t.includes("afm")){metrics={"Ra roughness":"1.84 nm","Rq roughness":"2.31 nm","Peak height":"8.7 nm","Valley depth":"−6.2 nm"};interpretation="The surface is uniform with low nanoscale roughness and no significant particulate defects."}
  else if(t.includes("xrr")){metrics={Thickness:"42.8 nm",Density:"2.31 g/cm³","Interface roughness":"0.76 nm","Fit quality":"0.992 R²"};interpretation="A dense, highly uniform thin film is indicated with a sharp substrate interface."}
  else if(t.includes("xrf")){metrics={Silicon:"68.4%",Oxygen:"28.1%",Aluminum:"2.2%","Trace metals":"1.3%"};interpretation="The spectrum is consistent with an oxidized silicon matrix and low metallic contamination."}
  else if(t.includes("xps")){metrics={Carbon:"18.2 at.%",Oxygen:"35.7 at.%",Silicon:"45.1 at.%","Other":"1.0 at.%"};interpretation="Surface chemistry indicates a primarily silicon-oxide surface with adventitious carbon."}
  else if(t.includes("ellip")){metrics={Thickness:"118.6 nm","Refractive index":"1.47 @ 633nm",Psi:"24.8°",Delta:"167.2°"};interpretation="The optical model converged on a uniform transparent film with low absorption."}
  else if(t.includes("trib")){metrics={"Mean friction":"0.182","Wear depth":"3.7 µm","Wear rate":"1.2×10⁻⁶ mm³/Nm","Test cycles":"10,000"};interpretation="Stable friction behavior and a low wear rate indicate a durable surface coating."}
  else {metrics={"Signal mean":"47.2 a.u.","Signal deviation":"2.8 a.u.","Confidence":"96.4%","Observations":"36"};interpretation="The simulated measurement is within the expected specification window."}
  return {requestId,technique,metrics,points,interpretation};
}
