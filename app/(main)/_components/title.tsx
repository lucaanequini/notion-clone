'use client'

import { Doc } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface TitleProps {
    initialData: Doc<'documents'>
}

export const Title = ({ initialData }: TitleProps) => {
    const update = useMutation(api.documents.update)

    const inputRef = useRef<HTMLInputElement>(null)
    const [title, setTitle] = useState(initialData.title || 'Untitled')

    const [isEditing, setIsEditing] = useState(false)

    const enableInput = () => {
        setTitle(initialData.title)
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0)
    }

    const disableInput = () => {
        setIsEditing(false)
    }

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(ev.target.value)
        update({
            id: initialData._id,
            title: ev.target.value || 'Untitled'
        })
    }

    const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            disableInput()
        }
    }

    return (
        <div className="flex items-center gap-x-1 mt-2">
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant='ghost'
                    size='sm'
                    className="font-normal h-auto p-1"
                >
                    <span className="truncate">
                        {initialData?.title}
                    </span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-6 w-20 rounded-md mt-2" />
    )
}