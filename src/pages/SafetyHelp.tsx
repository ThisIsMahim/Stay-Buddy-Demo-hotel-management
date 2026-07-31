import { Search, Settings, X, ChevronRight, MoreHorizontal, Phone } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const SafetyHelp = () => {
    const [activeTab, setActiveTab] = useState("All");

    return (
        <div className="flex h-screen bg-white font-sans text-[#222222] overflow-hidden">
            {/* Left Sidebar: Messages */}
            <div className="w-[320px] border-r border-gray-200 flex flex-col h-full bg-[#f7f7f7]">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-[22px] font-semibold">Messages</h1>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab("All")}
                            className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-colors ${activeTab === "All" ? "bg-black text-white" : "bg-white text-black border border-gray-300 hover:border-black"
                                }`}
                        >
                            All
                            <span className="ml-1 text-[10px] align-top">v</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("Unread")}
                            className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-colors ${activeTab === "Unread" ? "bg-black text-white" : "bg-white text-black border border-gray-300 hover:border-black"
                                }`}
                        >
                            Unread
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto px-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 32 32" className="w-8 h-8 text-white fill-current">
                                    <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.114l-.257.26c-2.153 2.127-4.485 3.385-6.709 3.385-3.48 0-6.357-2.416-6.357-6.478 0-1.142.308-2.389.92-3.991l.186-.449c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.15.362c-.345.852-.49 1.54-.524 2.19l-.007.266c0 2.89 2.057 4.478 4.357 4.478 1.644 0 3.575-1.005 5.429-2.904l.313-.32.313.32c1.854 1.899 3.785 2.904 5.429 2.904 2.3 0 4.357-1.588 4.357-4.478 0-.798-.168-1.618-.536-2.485l-.165-.383c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.24 3 16 3z" />
                                </svg>
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-[15px]">Airbnb Support</h3>
                                    <span className="text-[12px] text-gray-500">7:35 PM</span>
                                </div>
                                <p className="text-[13px] text-gray-500 line-clamp-1">Open to see latest messages</p>
                                <p className="text-[13px] text-gray-500">Ongoing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Chat */}
            <div className="flex-grow flex flex-col relative h-full">
                {/* Chat Header */}
                <div className="h-[80px] border-b border-gray-200 flex items-center px-8 shrink-0">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-4">
                        <svg viewBox="0 0 32 32" className="w-6 h-6 text-white fill-current">
                            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.114l-.257.26c-2.153 2.127-4.485 3.385-6.709 3.385-3.48 0-6.357-2.416-6.357-6.478 0-1.142.308-2.389.92-3.991l.186-.449c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.15.362c-.345.852-.49 1.54-.524 2.19l-.007.266c0 2.89 2.057 4.478 4.357 4.478 1.644 0 3.575-1.005 5.429-2.904l.313-.32.313.32c1.854 1.899 3.785 2.904 5.429 2.904 2.3 0 4.357-1.588 4.357-4.478 0-.798-.168-1.618-.536-2.485l-.165-.383c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.24 3 16 3z" />
                        </svg>
                    </div>
                    <h2 className="text-[18px] font-semibold">Airbnb Support</h2>
                </div>

                {/* Chat Area */}
                <div className="flex-grow overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
                    <div className="text-center text-[12px] text-gray-500 mb-4">Airbnb Support 7:35 PM</div>

                    <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0 mt-1">
                            <svg viewBox="0 0 32 32" className="w-5 h-5 text-white fill-current">
                                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.114l-.257.26c-2.153 2.127-4.485 3.385-6.709 3.385-3.48 0-6.357-2.416-6.357-6.478 0-1.142.308-2.389.92-3.991l.186-.449c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.15.362c-.345.852-.49 1.54-.524 2.19l-.007.266c0 2.89 2.057 4.478 4.357 4.478 1.644 0 3.575-1.005 5.429-2.904l.313-.32.313.32c1.854 1.899 3.785 2.904 5.429 2.904 2.3 0 4.357-1.588 4.357-4.478 0-.798-.168-1.618-.536-2.485l-.165-.383c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.24 3 16 3z" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="bg-[#f7f7f7] p-4 rounded-2xl rounded-tl-none text-[15px] leading-relaxed">
                                Hi Md Tohidul, if there's an emergency in progress, let's get you connected with local emergency services now.
                            </div>

                            <button className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl hover:bg-gray-50 transition-colors w-full max-w-[300px] shadow-sm">
                                <span className="font-semibold text-[15px]">Dial emergency services</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2 mt-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-[#f7f7f7] p-4 rounded-2xl text-[15px] leading-relaxed mt-2">
                                If you need help from Airbnb, select the issue you're experiencing. This info helps us get you to the right person faster.
                            </div>

                            <div className="mt-4 border border-gray-200 rounded-2xl overflow-hidden w-full max-w-[320px] bg-white shadow-sm">
                                <button className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors text-[15px]">
                                    Privacy concerns
                                </button>
                                <button className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors text-[15px]">
                                    Violence or threats
                                </button>
                                <button className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors text-[15px]">
                                    Gas leak
                                </button>
                                <button className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors text-[15px]">
                                    Cleanliness or amenity issues
                                </button>
                                <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors text-[15px]">
                                    I need help with something else
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Scrollbar indicator (approximate) */}
                <div className="absolute right-2 top-[80px] bottom-0 w-[5px] flex justify-center py-4 pointer-events-none">
                    <div className="w-[4px] bg-gray-300 rounded-full h-[60%] mt-20 opacity-40"></div>
                </div>
            </div>

            {/* Right Sidebar: Details */}
            <div className="w-[380px] border-l border-gray-200 flex flex-col h-full bg-white">
                <div className="h-[80px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                    <h2 className="text-[20px] font-semibold">Details</h2>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex gap-4 items-center mb-6">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 32 32" className="w-8 h-8 text-white fill-current">
                                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.114l-.257.26c-2.153 2.127-4.485 3.385-6.709 3.385-3.48 0-6.357-2.416-6.357-6.478 0-1.142.308-2.389.92-3.991l.186-.449c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.15.362c-.345.852-.49 1.54-.524 2.19l-.007.266c0 2.89 2.057 4.478 4.357 4.478 1.644 0 3.575-1.005 5.429-2.904l.313-.32.313.32c1.854 1.899 3.785 2.904 5.429 2.904 2.3 0 4.357-1.588 4.357-4.478 0-.798-.168-1.618-.536-2.485l-.165-.383c-.971-2.262-5.105-10.916-7.031-14.692l-.523-1.008C18.053 3.539 17.24 3 16 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-[18px] font-semibold">Airbnb Support</h3>
                            <p className="text-[14px] text-gray-500">Get help from a member of our team.</p>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-gray-100 my-8"></div>
                </div>
            </div>

            <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
};

export default SafetyHelp;
