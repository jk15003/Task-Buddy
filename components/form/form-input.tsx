"use client"

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-error";

interface FormInputProps{
    id:string,
    label?:string;
    type?:string;
    placeHolder?:string;
    required?:boolean;
    disabeled?:boolean;
    errors?:Record<string,string[]|undefined>;
    className?:string;
    defaultValue?:string;
    onBlur?:()=>void;
}

export const FormInput=forwardRef<HTMLInputElement,FormInputProps>(({
    id,
    label,
    type,
    placeHolder,
    required,
    disabeled,
    errors,
    className,
    defaultValue,
    onBlur,
},ref)=>{
    const{pending}=useFormStatus();

    return(
        <div className="space-y-2">
            <div className="space-y-1">
                {label?(
                    <div>
                        <Label 
                        htmlFor={id}
                        className="text-xs font-semibold text-neutral-700">
                            {label}
                        </Label>
                    </div>
                ):null}
                <Input
                onBlur={onBlur}
                defaultValue={defaultValue}
                ref={ref}
                required={required}
                name={id}
                id={id}
                placeholder={placeHolder}
                type={type}
                disabled={pending||disabeled}
                className={cn(
                    "text-sm px-2 py-1 h-7",
                    className,
                )}
                aria-describedby={`${id}-error`}/>
            </div>
            <FormErrors
            id={id}
            errors={errors}/>
        </div>
    );
})

FormInput.displayName="FormInput";