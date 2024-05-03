import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
    children: React.ReactNode
    onConfirm: () => void
}

export const ConfirmModal = ({ children, onConfirm }: ConfirmModalProps) => {
    const handleConfirm = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev.stopPropagation()
        onConfirm()
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger onClick={(ev) => ev.stopPropagation()}>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the document.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(ev) => ev.stopPropagation()}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}