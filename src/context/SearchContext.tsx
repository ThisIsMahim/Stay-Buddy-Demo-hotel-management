import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export interface RoomConfig {
    adults: number;
    children: number;
}

export interface SearchState {
    q: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
    petsAllowed: boolean;
    roomsData: RoomConfig[];
}

interface SearchContextType {
    search: SearchState;
    updateSearch: (patch: Partial<SearchState>) => void;
    clearSearch: () => void;
    isSearchActive: boolean;
}

const DEFAULT_SEARCH: SearchState = {
    q: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    rooms: 1,
    petsAllowed: false,
    roomsData: [{ adults: 2, children: 0 }],
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [params] = useSearchParams();
    const [search, setSearch] = useState<SearchState>(() => {
        // Initialize from localStorage or URL if available
        const saved = localStorage.getItem("sb_search_intent");
        const initial = saved ? JSON.parse(saved) : DEFAULT_SEARCH;

        // Override with URL params if present (URL wins over localStorage)
        const adultsCount = parseInt(params.get("adults") || initial.adults.toString());
        const childrenCount = parseInt(params.get("children") || initial.children.toString());
        const roomsCount = parseInt(params.get("rooms") || initial.rooms.toString());

        // If roomsData is missing or wrong size, rebuild it from total counts as fallback
        let roomsData = initial.roomsData || [];
        if (roomsData.length !== roomsCount) {
            roomsData = Array(roomsCount).fill(null).map((_, i) => ({
                adults: i === 0 ? adultsCount : 1, // First room gets the primary guest count if rebuilding
                children: i === 0 ? childrenCount : 0,
            }));
        }

        return {
            q: params.get("q") || initial.q,
            checkIn: params.get("checkIn") || initial.checkIn,
            checkOut: params.get("checkOut") || initial.checkOut,
            adults: adultsCount,
            children: childrenCount,
            rooms: roomsCount,
            petsAllowed: params.get("pets") === "true" || initial.petsAllowed,
            roomsData,
        };
    });

    useEffect(() => {
        // Sync state when URL params change (e.g. navigation or manual URL edit)
        const q = params.get("q");
        const checkIn = params.get("checkIn");
        const checkOut = params.get("checkOut");
        const adults = params.get("adults");
        const children = params.get("children");
        const rooms = params.get("rooms");
        const pets = params.get("pets");

        if (q !== null || checkIn !== null || checkOut !== null || adults !== null || children !== null || rooms !== null || pets !== null) {
            setSearch(prev => {
                const nextAdults = adults ? parseInt(adults) : prev.adults;
                const nextChildren = children ? parseInt(children) : prev.children;
                const nextRooms = rooms ? parseInt(rooms) : prev.rooms;

                // Rebuild roomsData if rooms count changed via URL
                let nextRoomsData = prev.roomsData;
                if (nextRoomsData.length !== nextRooms) {
                    nextRoomsData = Array(nextRooms).fill(null).map((_, i) => ({
                        adults: i === 0 ? nextAdults : 1,
                        children: i === 0 ? nextChildren : 0,
                    }));
                }

                return {
                    ...prev,
                    q: q ?? prev.q,
                    checkIn: checkIn ?? prev.checkIn,
                    checkOut: checkOut ?? prev.checkOut,
                    adults: nextAdults,
                    children: nextChildren,
                    rooms: nextRooms,
                    petsAllowed: pets ? pets === "true" : prev.petsAllowed,
                    roomsData: nextRoomsData,
                };
            });
        }
    }, [params]);

    useEffect(() => {
        localStorage.setItem("sb_search_intent", JSON.stringify(search));
    }, [search]);

    const updateSearch = (patch: Partial<SearchState>) => {
        setSearch(prev => ({ ...prev, ...patch }));
    };

    const clearSearch = () => {
        setSearch(DEFAULT_SEARCH);
        localStorage.removeItem("sb_search_intent");
    };

    const isSearchActive = !!(search.q || search.checkIn || search.checkOut || search.adults > 2 || search.children > 0 || search.rooms > 1);

    return (
        <SearchContext.Provider value={{ search, updateSearch, clearSearch, isSearchActive }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error("useSearch must be used within a SearchProvider");
    return context;
};
