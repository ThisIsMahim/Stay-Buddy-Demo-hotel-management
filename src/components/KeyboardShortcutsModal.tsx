import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CornerDownLeft, ArrowLeftRight, ArrowUpDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const KeyboardShortcutsModal = ({ isOpen, onClose }: KeyboardShortcutsModalProps) => {
    const shortcuts = [
        {
            keys: [<CornerDownLeft className="w-4 h-4" />],
            label: "Select the date in focus"
        },
        {
            keys: [<ChevronLeft className="w-4 h-4" />, <span className="mx-1">/</span>, <ChevronRight className="w-4 h-4" />],
            label: "Move backward (left) and forward (right) by one day"
        },
        {
            keys: [<ChevronUp className="w-4 h-4" />, <span className="mx-1">/</span>, <ChevronDown className="w-4 h-4" />],
            label: "Move backward (up) and forward (down) by one week"
        },
        {
            keys: ["PGUP/PGDN"],
            label: "Switch months"
        },
        {
            keys: ["HOME/END"],
            label: "Go to the first or last day of a week"
        },
        {
            keys: ["?"],
            label: "Open this panel"
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[568px] p-0 gap-0 bg-background overflow-hidden">
                <DialogHeader className="p-6 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogClose className="absolute left-4 top-4 rounded-full p-2 hover:bg-neutral-100 transition-colors" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </DialogClose>
                    {/* Empty div for spacing if needed */}
                </DialogHeader>

                <div className="px-6 py-6 pb-2">
                    <h2 className="text-2xl font-bold mb-8">Keyboard shortcuts</h2>

                    <div className="space-y-6">
                        {shortcuts.map((shortcut, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-32 shrink-0 flex items-center gap-2">
                                    {Array.isArray(shortcut.keys) ? (
                                        shortcut.keys.map((k, idx) => (
                                            typeof k === "string" ? (
                                                <span key={idx} className="inline-block px-2 py-1 bg-secondary rounded text-xs font-semibold uppercase tracking-wider min-w-[32px] text-center border">
                                                    {k}
                                                </span>
                                            ) : (
                                                <span key={idx} className="inline-flex items-center justify-center w-8 h-8 bg-secondary rounded text-xs border">
                                                    {k}
                                                </span>
                                            )
                                        ))
                                    ) : (
                                        null
                                    )}
                                </div>
                                <div className="text-base text-muted-foreground pt-1">
                                    {shortcut.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 mb-6">
                        <Button
                            className="bg-black hover:bg-neutral-800 text-white font-semibold rounded-lg h-12 px-6"
                            onClick={onClose}
                        >
                            Back to calendar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default KeyboardShortcutsModal;
