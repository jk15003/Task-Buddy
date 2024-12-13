"use client";

import { Plus, X } from "lucide-react";
import { ListWrapper } from "./list-wrapper";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createList } from "@/actions/create-list";


export const ListForm = () => {
  const router=useRouter();
  const params=useParams();

  const [isEditing,setIsEditing]=useState(false);

  const formRef =useRef<ElementRef<"form">>(null);
  const inputRef =useRef<ElementRef<"input">>(null);

  const enableEditing=()=>{
    setIsEditing(true);
    setTimeout(()=>{
      inputRef.current?.focus();
    });
  };

  const disableEditing=()=>{
    setIsEditing(false);
  };

  const { execute, fieldErrors}=useAction(createList,{
    onSuccess:(data)=>{
      toast.success(`List "${data.title}" created!`);
      disableEditing();
      router.refresh();
    },
    onError:(error)=>{
      toast.error(error);
    },
  });

  const onKeyDown=(e:KeyboardEvent)=>{
    if (e.key === "Escape") {
      disableEditing();
  };
};

useEventListener("keydown",onKeyDown);
useOnClickOutside(formRef,disableEditing);

const onSubmit=(formData:FormData)=>{
  const title =formData.get("title") as string;
  const boardId =formData.get("boardId") as string;

  execute({
    title,
    boardId
  });
}

if(isEditing){
  return(
    <ListWrapper>
      <form 
      action={onSubmit}
      ref={formRef}
      className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
      >
        <FormInput
        ref={inputRef}
        errors={fieldErrors}
        id="title"
        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
        placeHolder="Enter list title..."
        />
        <input 
        hidden
        value={params.boardId}
        name="boardId"
        readOnly
        />
        <div className="flex items-center gap-x-1">
          <FormSubmit>
            Add list
          </FormSubmit>
          <Button
          onClick={disableEditing}
          variant="ghost"
          size="sm"
          >
            <X className="h-5 w-5"/>
          </Button>
        </div>
      </form>
    </ListWrapper>
  );
}

  return (
    <ListWrapper>
      <button
        className="w-full rounded-md bg-white/50 hover:bg-white/80 transition p-3 flex items-center font-medium text-sm"
        onClick={enableEditing}
        >
        <Plus className="mr-2 h-4 w-4" />
        Add a list
      </button>
    </ListWrapper>
  );
};