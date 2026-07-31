import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Mail } from "lucide-react";

const AuthModal = ({
    isOpen,
    onClose,
    title = "Log in or sign up",
    socialLayout = "vertical"
}: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    socialLayout?: "horizontal" | "vertical";
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-background">
                <DialogHeader className="p-4 border-b relative flex items-center justify-center">
                    <DialogTitle className="text-base font-bold">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <h2 className="text-2xl font-semibold mb-6">Welcome to Airbnb</h2>

                    <div className="space-y-4">
                        <div className="border rounded-lg border-input">
                            <div className="border-b border-input">
                                <Select defaultValue="bd">
                                    <SelectTrigger className="w-full border-0 focus:ring-0 rounded-t-lg rounded-b-none h-14 bg-transparent">
                                        <SelectValue placeholder="Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bd">Bangladesh (+880)</SelectItem>
                                        <SelectItem value="us">United States (+1)</SelectItem>
                                        <SelectItem value="uk">United Kingdom (+44)</SelectItem>
                                        <SelectItem value="in">India (+91)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Input
                                    type="tel"
                                    placeholder="Phone number"
                                    className="border-0 focus-visible:ring-0 rounded-t-none rounded-b-lg h-12 bg-transparent"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-tight">
                            We'll call or text you to confirm your number. Standard message and
                            data rates apply.{" "}
                            <a href="#" className="underline font-medium text-foreground">
                                Privacy Policy
                            </a>
                        </p>

                        <Button className="w-full bg-[#E51D55] hover:bg-[#D41B4E] text-white py-6 text-lg font-semibold rounded-lg mt-2">
                            Continue
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 my-6">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground font-medium">or</span>
                        <Separator className="flex-1" />
                    </div>

                    <div className="space-y-4">
                        {socialLayout === "horizontal" ? (
                            <div className="grid grid-cols-3 gap-4">
                                <Button variant="outline" className="h-12 hover:bg-accent border-input">
                                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fill="#1877F2" /></svg>
                                </Button>
                                <Button variant="outline" className="h-12 hover:bg-accent border-input">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.225 -9.426 56.472 -10.686 57.325 L -10.686 60.325 L -6.842 60.325 C -4.604 58.219 -3.264 55.109 -3.264 51.509 Z" />
                                            <path fill="#34A853" d="M -14.754 63.239 C -11.516 63.239 -8.801 62.157 -6.842 60.353 L -10.686 57.353 C -11.761 58.051 -13.139 58.489 -14.754 58.489 C -17.885 58.489 -20.533 56.371 -21.48 53.535 L -25.464 53.535 L -25.464 56.634 C -23.504 60.532 -19.49 63.239 -14.754 63.239 Z" />
                                            <path fill="#FBBC05" d="M -21.48 53.535 C -21.726 52.808 -21.866 52.033 -21.866 51.239 C -21.866 50.445 -21.726 49.669 -21.48 48.942 L -21.48 45.842 L -25.464 45.842 C -26.276 47.478 -26.737 49.303 -26.737 51.239 C -26.737 53.175 -26.276 55.001 -25.464 56.634 L -21.48 53.535 Z" />
                                            <path fill="#EA4335" d="M -14.754 43.989 C -12.981 43.989 -11.401 44.594 -10.153 45.784 L -6.737 42.368 C -8.801 40.447 -11.516 39.239 -14.754 39.239 C -19.49 39.239 -23.504 41.946 -25.464 45.842 L -21.48 48.942 C -20.533 46.106 -17.885 43.989 -14.754 43.989 Z" />
                                        </g>
                                    </svg>
                                </Button>
                                <Button variant="outline" className="h-12 hover:bg-accent border-input">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.62.27.01 1.03.07 1.8.38-2.5 1.43-2.03 5.46 1.35 6.8-.57 2.05-2.01 4.58-2.6 6.67zM14.03 4.33c.18-1.57 1.12-2.95 2.37-3.33.27 1.63-.61 3.23-2.37 3.33z" /></svg>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button variant="outline" className="w-full justify-between h-12 hover:bg-accent text-sm font-medium border-input text-foreground">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.225 -9.426 56.472 -10.686 57.325 L -10.686 60.325 L -6.842 60.325 C -4.604 58.219 -3.264 55.109 -3.264 51.509 Z" />
                                                <path fill="#34A853" d="M -14.754 63.239 C -11.516 63.239 -8.801 62.157 -6.842 60.353 L -10.686 57.353 C -11.761 58.051 -13.139 58.489 -14.754 58.489 C -17.885 58.489 -20.533 56.371 -21.48 53.535 L -25.464 53.535 L -25.464 56.634 C -23.504 60.532 -19.49 63.239 -14.754 63.239 Z" />
                                                <path fill="#FBBC05" d="M -21.48 53.535 C -21.726 52.808 -21.866 52.033 -21.866 51.239 C -21.866 50.445 -21.726 49.669 -21.48 48.942 L -21.48 45.842 L -25.464 45.842 C -26.276 47.478 -26.737 49.303 -26.737 51.239 C -26.737 53.175 -26.276 55.001 -25.464 56.634 L -21.48 53.535 Z" />
                                                <path fill="#EA4335" d="M -14.754 43.989 C -12.981 43.989 -11.401 44.594 -10.153 45.784 L -6.737 42.368 C -8.801 40.447 -11.516 39.239 -14.754 39.239 C -19.49 39.239 -23.504 41.946 -25.464 45.842 L -21.48 48.942 C -20.533 46.106 -17.885 43.989 -14.754 43.989 Z" />
                                            </g>
                                        </svg>
                                    </div>
                                    <span>Continue with Google</span>
                                    <div className="w-5" />
                                </Button>

                                <Button variant="outline" className="w-full justify-between h-12 hover:bg-accent text-sm font-medium border-input text-foreground">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.62.27.01 1.03.07 1.8.38-2.5 1.43-2.03 5.46 1.35 6.8-.57 2.05-2.01 4.58-2.6 6.67zM14.03 4.33c.18-1.57 1.12-2.95 2.37-3.33.27 1.63-.61 3.23-2.37 3.33z" /></svg>
                                    </div>
                                    <span>Continue with Apple</span>
                                    <div className="w-5" />
                                </Button>
                            </>
                        )}

                        <Button variant="outline" className="w-full justify-between h-12 hover:bg-accent text-sm font-medium border-input text-foreground">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span>Continue with email</span>
                            <div className="w-5" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
