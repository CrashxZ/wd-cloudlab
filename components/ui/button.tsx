import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants=cva("inline-flex items-center justify-center gap-2 rounded-full font-bold transition hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",{variants:{variant:{default:"bg-signal text-white shadow-lg shadow-red-200",outline:"border border-neutral-300 bg-white hover:border-neutral-500",dark:"bg-neutral-950 text-white"},size:{default:"h-11 px-5",sm:"h-9 px-4 text-sm",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof buttonVariants>{}
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,size,...props},ref)=><button ref={ref} className={cn(buttonVariants({variant,size,className}))} {...props}/>);
Button.displayName="Button";
export {buttonVariants};
