import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Copy,
    Mail,
    MessageCircle,
    MessageSquare,
    Facebook,
    Twitter,
    Code,
    MoreHorizontal,
    X
} from "lucide-react";
import img1 from "@/assets/img1.avif";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShareModal = ({ isOpen, onClose }: ShareModalProps) => {
    const shareOptions = [
        { icon: <Copy className="w-5 h-5" />, label: "Copy Link" },
        { icon: <Mail className="w-5 h-5" />, label: "Email" },
        { icon: <MessageSquare className="w-5 h-5" />, label: "Messages" },
        { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp" },
        { icon: <div className="w-5 h-5 flex items-center justify-center font-bold text-lg leading-none">~</div>, label: "Messenger" }, // Placeholder for Messenger icon
        { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
        { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
        { icon: <Code className="w-5 h-5" />, label: "Embed" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[568px] p-0 gap-0 bg-background overflow-hidden">
                <DialogHeader className="p-6 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogClose className="absolute left-4 top-4 rounded-full p-2 hover:bg-neutral-100 transition-colors" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </DialogClose>
                    <div /> {/* Spacer for centering if needed, though title is left-aligned usually in Airbnb share modal, but screenshot implies left title 'Share this place' is actually body or header? Screenshot shows 'Share this place' with X on right. */}
                    {/* Wait, screenshot shows 'Share this place' as a large heading, and close button on RIGHT. 
                         Standard Shadcn Dialog puts X on right. 
                         Let's match screenshot: "Share this place" on left, X on right.
                     */}
                </DialogHeader>
                {/* Custom Header construction to match screenshot exactly */}
                <div className="flex items-center justify-between px-6 py-6 pb-6">
                    <h2 className="text-2xl font-semibold">Share this place</h2>
                    {/* X is handled by DialogPrimitive or we can add custom one if default is hidden/styled differently */}
                </div>

                <div className="px-6 pb-6">
                    {/* Property Snippet */}
                    <div className="flex gap-4 mb-8">
                        <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                            <img src={img1} alt="Property" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="font-medium text-sm">Home in Seoul • ★4.97 • 1 bedroom • 1 bed • 1 shared bath</div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {shareOptions.map((option, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                className="h-14 justify-start gap-4 text-base font-normal border-neutral-300 rounded-xl hover:bg-neutral-50 px-6"
                            >
                                {option.icon}
                                {option.label}
                            </Button>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Button
                            variant="outline"
                            className="h-14 w-full sm:w-auto justify-start gap-4 text-base font-normal border-neutral-300 rounded-xl hover:bg-neutral-50 px-6"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                            More options
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;
