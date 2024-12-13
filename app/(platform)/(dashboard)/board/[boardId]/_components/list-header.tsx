"use client";

import { List } from "@prisma/client";
import { FormInput } from "@/components/form/form-input";
import { ElementRef, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/update-list";
import { toast } from "sonner";
import { ListOptions } from "./list-options";

interface ListHeaderprops{
    data:List;
    onAddCart: ()=>void;
}

export const ListHeader=({
    data,
    onAddCart,
}:ListHeaderprops)=>{
    const [title,setTitle]=useState(data.title);
    const [isEditing,setIsEditing]=useState(false);

    const formRef=useRef<ElementRef<"form">>(null);
    const inputRef=useRef<ElementRef<"input">>(null);

    const enableEditing=()=>{
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };

    const disableEditing=()=>{
        setIsEditing(false);
    };

    const {execute}=useAction(updateList,{
        onSuccess:(data)=>{
            toast.success(`Renamed to "${data.title}"`)
            setTitle(data.title);
            disableEditing();
        },
        onError:(error)=>{
            toast.error(error);
        },
    });

    const handleSubmit=(formData:FormData)=>{
        const title=formData.get("title") as string;
        const id=formData.get("id") as string;
        const boardId=formData.get("boardId") as string;
    
        if(title===data.title){
            return disableEditing();
        }

        execute({
            title,
            id,
            boardId,
        });
    }

    const onBlur=()=>{
        formRef.current?.requestSubmit();
    }

    const onKeyDown=(e:KeyboardEvent)=>{
        if(e.key==="Escape"){
            formRef.current?.requestSubmit();
        }
    };

    useEventListener("keydown",onKeyDown);

    return(
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {isEditing?(
                <form 
                className="flex-1 px-[2px]"
                ref={formRef}
                action={handleSubmit}
                >
                    <input hidden id="id" name="id" defaultValue={data.id} />
                    <input hidden id="boardId" name="boardId" defaultValue={data.boardId} />
                    <FormInput
                    ref={inputRef} 
                    onBlur={onBlur}
                    id="title"
                    placeHolder="Enter list title..."
                    defaultValue={title}
                    className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                    />
                    <button type="submit" hidden/>
                </form>  
            ):(
                <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
                onClick={enableEditing}
                >
                    {title}
                </div>
            )}
            <ListOptions
            onAddCard={onAddCart}
            data={data}
            />
        </div>
    );
}