'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import { useCoverImage } from "@/hooks/use-cover-image"

interface CoverProps {
    url?: string
    preview?: string
}

export const Cover = ({ url, preview }: CoverProps) => {
    const coverImage = useCoverImage()

    return (
        <div className={cn('relative w-full h-[35vh] group',
            !url && 'h-[12vh]',
            url && 'bg-muted'
        )}>
            {!!url && (
                <Image src={url} fill alt="Cover" className="object-cover" />
            )}
            {url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                    <Button
                        onClick={coverImage.onOpen}
                        className="text-muted-foreground text-xs"
                        variant='outline'
                        size='sm'
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Change cover
                    </Button>
                    <Button
                        onClick={() => { }}
                        className="text-muted-foreground text-xs"
                        variant='outline'
                        size='sm'
                    >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                    </Button>
                </div>
            )}
        </div>
    )
}