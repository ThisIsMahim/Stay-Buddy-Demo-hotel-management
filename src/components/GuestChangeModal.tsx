import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface GuestChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Counter = ({ value }: { value: number }) => (
    <div className="flex items-center gap-4">
        <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full border-neutral-300 disabled:opacity-20"
            disabled={value <= 0}
        >
            <Minus className="w-4 h-4" />
        </Button>
        <span className="w-4 text-center text-base">{value}</span>
        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-neutral-300">
            <Plus className="w-4 h-4" />
        </Button>
    </div>
);

const GuestChangeModal = ({ isOpen, onClose }: GuestChangeModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 gap-0 bg-background">
                <DialogHeader className="p-6 pb-2 space-y-0">
                    <DialogTitle className="text-xl font-bold text-left">Change guests</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-2">
                    <p className="text-sm text-neutral-600 mb-6">
                        This place has a maximum of 1 guest, not including infants. Pets aren't allowed. The host indicated their place has features that aren't kid-friendly. You can message the host for more details if you're traveling with kids.
                    </p>

                    <div className="space-y-6 mb-6">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-base">Adults</div>
                                <div className="text-sm text-muted-foreground">Age 13+</div>
                            </div>
                            <Counter value={1} />
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-base">Children</div>
                                <div className="text-sm text-muted-foreground">Ages 2 – 12</div>
                            </div>
                            <Counter value={0} />
                        </div>

                        {/* Infants */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-base">Infants</div>
                                <div className="text-sm text-muted-foreground">Under 2</div>
                            </div>
                            <Counter value={0} />
                        </div>

                        {/* Pets */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-base">Pets</div>
                                <div className="text-sm text-muted-foreground underline font-medium">Bringing a service animal?</div>
                            </div>
                            <Counter value={0} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border-t bg-background">
                    <Button variant="link" className="font-semibold underline text-foreground p-0 h-auto" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="bg-black hover:bg-neutral-800 text-white px-8 h-12 text-base font-semibold rounded-lg" onClick={onClose}>
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GuestChangeModal;
