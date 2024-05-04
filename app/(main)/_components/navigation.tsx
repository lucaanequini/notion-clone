import { ChevronsLeft, MenuIcon, PlusCircle, Search, Settings, Plus, Trash } from "lucide-react"
import { usePathname } from "next/navigation"
import { ElementRef, useRef, useState, useEffect } from "react"
import { useMediaQuery } from "usehooks-ts"
import { UserItem } from "./user-item"
import { Item } from "./item"
import { DocumentList } from "./document-list"
import { useSearch } from "@/hooks/use-search"

import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { TrashBox } from "./trash-box"

export const Navigation = () => {
    const search = useSearch()
    const pathName = usePathname()
    const isMobile = useMediaQuery('(max-width: 768px')

    const create = useMutation(api.documents.create)

    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<'aside'>>(null)
    const navbarRef = useRef<ElementRef<'div'>>(null)
    const [isResetting, setIsResetting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobile)

    useEffect(() => {
        if (isMobile) {
            collapse()
        } else {
            resetWidth()
        }
    }, [isMobile])

    useEffect(() => {
        if (isMobile) {
            collapse()
        }
    }, [pathName, isMobile])

    //sidebar move
    const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        ev.preventDefault()
        ev.stopPropagation()

        isResizingRef.current = true
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (ev: MouseEvent) => {
        if (!isResizingRef.current) return
        let newWidth = ev.clientX

        if (newWidth < 240) newWidth = 240
        if (newWidth > 480) newWidth = 480

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`
            navbarRef.current.style.setProperty('left', `${newWidth}px`)
            navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    //sidebar movements
    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false)
            setIsResetting(false)

            sidebarRef.current.style.width = isMobile ? '100%' : '240px'
            navbarRef.current.style.setProperty(
                'width',
                isMobile ? '0' : 'calc(100% - 240px)'
            )
            navbarRef.current.style.setProperty(
                'left',
                isMobile ? '100%' : '240px'
            )
        }
    }

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true)
            setIsResetting(false)

            sidebarRef.current.style.width = '0'
            navbarRef.current.style.setProperty('width', '100%')
            navbarRef.current.style.setProperty('left', '0')
            setTimeout(() => setIsResetting(false), 300)
        }
    }
    //finish sidebar movements


    const handleCreate = () => {
        const promise = create({ title: 'Untitled' })

        toast.promise(promise, {
            loading: 'Creating a new note...',
            success: 'New note created!',
            error: 'Failed to create a new note.'
        })
    }

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60  flex-col z-[99999]",
                    isResetting && 'transition-all ease-in-out duration-300',
                    isMobile && 'w-0')} >
                <div role="button"
                    className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && 'opacity-100'
                    )}
                    onClick={collapse}>
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <div>
                    <UserItem />
                    <Item
                        label="Search"
                        icon={Search}
                        isSearch
                        onClick={search.onOpen}
                    />
                    <Item
                        label="Settings"
                        icon={Settings}
                        onClick={() => { }}
                    />
                    <Item
                        onClick={handleCreate}
                        label='New Page'
                        icon={PlusCircle}
                    />
                </div>
                <div className="mt-4">
                    <DocumentList />
                    <Item onClick={handleCreate} icon={Plus} label="Add a page" />
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label='Trash' icon={Trash} />
                        </PopoverTrigger>
                        <PopoverContent side={isMobile ? 'bottom' : 'right'} className="p-0 w-72">
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside >
            <div ref={navbarRef}
                className={cn("absolute top-0 z-[99999] left-60 -[calc(100%-240px)]",
                    isResetting && 'transition-all ease-in-out',
                    isMobile && 'left-0 w-full')}
            >
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foregorund" />}
                </nav>
            </div>
        </>
    )
}