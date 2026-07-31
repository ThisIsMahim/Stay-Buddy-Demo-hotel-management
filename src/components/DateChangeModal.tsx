import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DateChangeModal = ({ isOpen, onClose }: DateChangeModalProps) => {
    // Helper to render calendar grid
    const renderCalendar = (month: string, days: (number | null)[], activeRange: number[]) => {
        return (
            <div className="w-full">
                <div className="text-center font-semibold mb-4">{month}</div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {days.map((day, i) => {
                        if (day === null) return <div key={i} />;

                        let className = "h-10 w-10 flex items-center justify-center rounded-full mx-auto hover:border hover:border-black cursor-pointer font-semibold";

                        // Mock logic for visuals based on screenshot
                        if (month === "February 2026") {
                            if (day === 27) className = "h-10 w-10 flex items-center justify-center rounded-full bg-black text-white mx-auto";
                            if (day === 28) className = "h-10 w-10 flex items-center justify-center bg-neutral-100 mx-auto w-full";
                            if (day < 27 && day > 7) className += " text-neutral-300 line-through decoration-neutral-300"; // disable/strike styling mock
                        }
                        if (month === "March 2026") {
                            if (day === 1) className = "h-10 w-10 flex items-center justify-center rounded-full bg-black text-white mx-auto";
                            // disable/strike styling mock
                            if (day !== 1 && day < 15) className = "h-10 w-10 flex items-center justify-center rounded-full mx-auto text-neutral-300 line-through decoration-neutral-300";
                        }

                        return (
                            <div key={i} className={day === 28 && month === "February 2026" ? "p-0" : ""}>
                                <div className={className}>
                                    {day}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Days arrays
    const febDays = [
        1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, 26, 27, 28
    ];

    // March starts on Sunday (mocking for 2026 based on screenshot day placement)
    // Screenshot: Feb 28 is Saturday. So March 1 is Sunday.
    const marchDays = [
        1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, 26, 27, 28,
        29, 30, 31, null, null, null, null
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[800px] p-0 gap-0 bg-background overflow-hidden">
                <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between border-b-0 space-y-0 relative">
                    {/* Close button handled by Dialog primitive, we just put title */}
                    {/* <Button variant="ghost" size="icon" className="absolute left-4 top-4 rounded-full" onClick={onClose}>
                        <ArrowLeft className="w-4 h-4" />
                     </Button> */}
                    <DialogTitle className="text-xl font-bold text-left ml-2 md:ml-0">Change dates</DialogTitle>
                </DialogHeader>

                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {renderCalendar("February 2026", febDays, [27, 28])}
                        <div className="hidden md:block">
                            {renderCalendar("March 2026", marchDays, [1])}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-6 border-t bg-background">
                    <Button variant="link" className="font-semibold underline text-foreground p-0 h-auto">
                        Clear dates
                    </Button>
                    <div className="flex gap-3">
                        <Button className="bg-black hover:bg-neutral-800 text-white px-8 h-12 text-base font-semibold rounded-lg" onClick={onClose}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DateChangeModal;
