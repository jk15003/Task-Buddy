"use client"

import { useFormStatus } from "react-dom"
import  {cn} from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FormSubmitProps{
    children:React.ReactNode;
    disabeled?:boolean;
    className?:string;
    variant?: "default"| "destructive" |"outline"| "secondary" | "ghost" |"link"|"primary";
};

export const FormSubmit =({
    children,
    disabeled,
    className,
    variant="primary",
}:FormSubmitProps)=>{
    const {pending}=useFormStatus();

    return(
        <Button
        disabled={pending||disabeled}
        type="submit"
        variant={variant}
        size="sm"
        className={cn(className)}
        >
            {children}
        </Button>
    );
};