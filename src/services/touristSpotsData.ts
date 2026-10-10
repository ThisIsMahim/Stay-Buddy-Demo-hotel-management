export interface TouristSpot {
  id: string;
  name: string;
  nameBn: string;
  region: string;
  regionBn: string;
  category: "sea" | "forest" | "hill" | "heritage" | "tea";
  image: string;
  description: string;
  descriptionBn: string;
  nearbyHotelsCount: number;
  startingPrice: number;
  highlightTag: string;
  highlightTagBn: string;
}

export const DEFAULT_TOURIST_SPOTS: TouristSpot[] = [
  // Sea & Beach
  {
    id: "coxs-bazar",
    name: "Cox's Bazar",
    nameBn: "কক্সবাজার",
    region: "Chittagong Division",
    regionBn: "চট্টগ্রাম বিভাগ",
    category: "sea",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "World's longest unbroken natural sandy sea beach (120 km).",
    descriptionBn: "বিশ্বের দীর্ঘতম অবিচ্ছিন্ন প্রাকৃতিক বালুকাময় সমুদ্র সৈকত (১২০ কিমি)।",
    nearbyHotelsCount: 42,
    startingPrice: 850,
    highlightTag: "Most Popular",
    highlightTagBn: "সর্বাধিক জনপ্রিয়",
  },
  {
    id: "saint-martins",
    name: "Saint Martin's Island",
    nameBn: "সেন্ট মার্টিন দ্বীপ",
    region: "Bay of Bengal",
    regionBn: "বঙ্গোপসাগর অঞ্চল",
    category: "sea",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    description: "Only coral island of Bangladesh with crystal clear waters.",
    descriptionBn: "স্বচ্ছ নীল জলরাশি ও প্রবাল দ্বীপের মনোরম সৌন্দর্য।",
    nearbyHotelsCount: 18,
    startingPrice: 1200,
    highlightTag: "Coral Island",
    highlightTagBn: "একমাত্র প্রবাল দ্বীপ",
  },
  {
    id: "kuakata",
    name: "Kuakata",
    nameBn: "কুয়াকাটা",
    region: "Patuakhali",
    regionBn: "পটুয়াখালী জেলা",
    category: "sea",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
    description: "Daughter of the sea offering sunrise and sunset over the ocean.",
    descriptionBn: "একই স্থানে সূর্যোদয় ও সূর্যাস্ত অবলোকনের অপরূপ সৈকত।",
    nearbyHotelsCount: 24,
    startingPrice: 700,
    highlightTag: "Sunrise & Sunset",
    highlightTagBn: "সূর্যোদয় ও সূর্যাস্ত",
  },
  // Forest & Nature
  {
    id: "sundarbans",
    name: "Sundarbans Mangrove",
    nameBn: "সুন্দরবন ম্যানগ্রোভ",
    region: "Khulna Division",
    regionBn: "খুলনা বিভাগ",
    category: "forest",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    description: "UNESCO World Heritage site & home to the Royal Bengal Tiger.",
    descriptionBn: "বিশ্বের সর্ববৃহৎ ম্যানগ্রোভ বন ও রয়েল বেঙ্গল টাইগারের আবাসভূমি।",
    nearbyHotelsCount: 15,
    startingPrice: 1500,
    highlightTag: "UNESCO Heritage",
    highlightTagBn: "ইউনেস্কো বিশ্ব ঐতিহ্য",
  },
  {
    id: "ratargul",
    name: "Ratargul Swamp Forest",
    nameBn: "রাতারগুল সোয়াম্প ফরেস্ট",
    region: "Sylhet",
    regionBn: "সিলেট জেলা",
    category: "forest",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
    description: "Only freshwater swamp forest in Bangladesh known as the Amazon of BD.",
    descriptionBn: "বাংলার আমাজন খ্যাত দেশের একমাত্র মিঠাপানির জলাবন।",
    nearbyHotelsCount: 28,
    startingPrice: 650,
    highlightTag: "Amazon of BD",
    highlightTagBn: "বাংলার আমাজন",
  },
  // Hill & Adventure
  {
    id: "sajek-valley",
    name: "Sajek Valley",
    nameBn: "সাজেক ভ্যালি",
    region: "Rangamati / Baghaichhari",
    regionBn: "রাঙ্গামাটি / বাঘাইছড়ি",
    category: "hill",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    description: "Queen of Hills floating atop clouds and misty hillscapes.",
    descriptionBn: "মেঘের উপত্যকা খ্যাত পাহাড়ের চূড়ায় অবস্থিত অপূর্ব সাজেক।",
    nearbyHotelsCount: 35,
    startingPrice: 1000,
    highlightTag: "Kingdom of Clouds",
    highlightTagBn: "মেঘের রাজ্য",
  },
  {
    id: "bandarban",
    name: "Bandarban & Nilgiri",
    nameBn: "বান্দরবান ও নীলগিরি",
    region: "Chittagong Hill Tracts",
    regionBn: "পার্বত্য চট্টগ্রাম",
    category: "hill",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Highest peaks, dramatic waterfalls, and rich tribal heritage.",
    descriptionBn: "উঁচু পাহাড়ি শৃঙ্গ, ঝরনা ও আদিবাসী সংস্কৃতির মেলবন্ধন।",
    nearbyHotelsCount: 30,
    startingPrice: 800,
    highlightTag: "Adventure Hub",
    highlightTagBn: "অ্যাডভেঞ্চার হাব",
  },
  // Heritage & History
  {
    id: "paharpur",
    name: "Somapura Mahavihara",
    nameBn: "সোমপুর মহাবিহার (পাহাড়পুর)",
    region: "Naogaon, Rajshahi",
    regionBn: "নওগাঁ, রাজশাহী",
    category: "heritage",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    description: "One of the most famous Buddhist monasteries in South Asia (UNESCO).",
    descriptionBn: "দক্ষিণ এশিয়ার প্রাচীনতম ইউনেস্কো স্বীকৃত বৌদ্ধ মহাবিহার।",
    nearbyHotelsCount: 12,
    startingPrice: 500,
    highlightTag: "Ancient Wonder",
    highlightTagBn: "প্রাচীন ঐতিহ্য",
  },
  {
    id: "bagerhat",
    name: "Sixty Dome Mosque",
    nameBn: "ষাট গম্বুজ মসজিদ",
    region: "Bagerhat",
    regionBn: "বাগেরহাট জেলা",
    category: "heritage",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    description: "Sultanate historic architecture by Khan Jahan Ali (UNESCO).",
    descriptionBn: "খান জাহান আলীর পঞ্চদশ শতাব্দীর ঐতিহাসিক ইসলামিক স্থাপত্য।",
    nearbyHotelsCount: 14,
    startingPrice: 550,
    highlightTag: "Historic Landmark",
    highlightTagBn: "ঐতিহাসিক নিদর্শন",
  },
  // Tea & Haor
  {
    id: "sreemangal",
    name: "Sreemangal Tea Gardens",
    nameBn: "শ্রীমঙ্গল চা বাগান",
    region: "Moulvibazar, Sylhet",
    regionBn: "মৌলভীবাজার, সিলেট",
    category: "tea",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    description: "Tea Capital of Bangladesh with rolling emerald green slopes.",
    descriptionBn: "চা-কন্যা খ্যাত সুবিশাল সবুজ গালিচা মোড়ানো চা বাগান।",
    nearbyHotelsCount: 38,
    startingPrice: 750,
    highlightTag: "Tea Capital",
    highlightTagBn: "চায়ের রাজধানী",
  },
  {
    id: "tanguar-haor",
    name: "Tanguar Haor",
    nameBn: "টাঙ্গুয়ার হাওর",
    region: "Sunamganj",
    regionBn: "সুনামগঞ্জ জেলা",
    category: "tea",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Ramsar wetland site with iconic houseboats and clear blue waters.",
    descriptionBn: "স্বচ্ছ মিঠাপানি ও হাউসবোট ক্রুজিংয়ের বিশ্বখ্যাত রামসার জলাভূমি।",
    nearbyHotelsCount: 22,
    startingPrice: 1100,
    highlightTag: "Houseboat Living",
    highlightTagBn: "হাউসবোট লাইফ",
  },
];

const STORAGE_KEY = "staybd_tourist_spots";

export const getStoredTouristSpots = (): TouristSpot[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TOURIST_SPOTS));
      return DEFAULT_TOURIST_SPOTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TOURIST_SPOTS;
  } catch (err) {
    console.error("Error reading stored tourist spots", err);
    return DEFAULT_TOURIST_SPOTS;
  }
};

export const saveTouristSpots = (spots: TouristSpot[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
    window.dispatchEvent(new CustomEvent("staybd_spots_updated", { detail: spots }));
  } catch (err) {
    console.error("Error saving tourist spots", err);
  }
};

export const addTouristSpot = (spot: Omit<TouristSpot, "id"> & { id?: string }): TouristSpot => {
  const current = getStoredTouristSpots();
  const newSpot: TouristSpot = {
    ...spot,
    id: spot.id || spot.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36)
  };
  const updated = [newSpot, ...current];
  saveTouristSpots(updated);
  return newSpot;
};

export const updateTouristSpot = (spot: TouristSpot): void => {
  const current = getStoredTouristSpots();
  const updated = current.map(s => s.id === spot.id ? spot : s);
  saveTouristSpots(updated);
};

export const deleteTouristSpot = (spotId: string): void => {
  const current = getStoredTouristSpots();
  const updated = current.filter(s => s.id !== spotId);
  saveTouristSpots(updated);
};

export const resetToDefaultTouristSpots = (): TouristSpot[] => {
  saveTouristSpots(DEFAULT_TOURIST_SPOTS);
  return DEFAULT_TOURIST_SPOTS;
};
