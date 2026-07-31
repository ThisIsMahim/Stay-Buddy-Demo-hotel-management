import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  MapPin, Wifi, Car, Utensils, Tv, Thermometer, WashingMachine,
  Phone, Globe, Coffee, Dumbbell, Clock, Shield, CreditCard,
  Users, Baby, Smoking, NoSmoking, CheckCircle, X
} from 'lucide-react';
import { Hotel } from '@/services/api';

interface HotelDetailsModalProps {
  hotel: Hotel;
  isOpen: boolean;
  onClose: () => void;
}

// Amenity categories mapping (ShareTrip style)
const amenityCategories = {
  services: {
    name: 'Services',
    icon: Shield,
    items: ['Air conditioning', 'Elevator/lift', '24-hour reception', 'Room service', 'Concierge']
  },
  meals: {
    name: 'Meals & Dining',
    icon: Utensils,
    items: ['Restaurant', 'Breakfast', 'Coffee/tea for guests', 'Bar', 'Room service']
  },
  internet: {
    name: 'Internet',
    icon: Wifi,
    items: ['Free internet', 'High-speed WiFi', 'Business center']
  },
  sports: {
    name: 'Sports & Recreation',
    icon: Dumbbell,
    items: ['Gym', 'Swimming pool', 'Spa', 'Fitness center']
  },
  rooms: {
    name: 'Room Amenities',
    icon: Tv,
    items: ['TV', 'Cable TV', 'Shower', 'Bathtub', 'Wardrobe/Closet', 'Slippers', 'Toiletries']
  },
  policies: {
    name: 'Policies',
    icon: Shield,
    items: ['Non-smoking rooms', 'Pet-friendly', 'Child-friendly', 'Check-in/Check-out times']
  },
  payment: {
    name: 'Payment Options',
    icon: CreditCard,
    items: ['Visa', 'Mastercard', 'Cash', 'bKash', 'Amex']
  },
  languages: {
    name: 'Languages',
    icon: Globe,
    items: ['English', 'Bangla', 'Hindi', 'Arabic']
  }
};

// Icon mapping for amenities
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase();
  if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return Wifi;
  if (amenityLower.includes('parking') || amenityLower.includes('car')) return Car;
  if (amenityLower.includes('restaurant') || amenityLower.includes('food')) return Utensils;
  if (amenityLower.includes('tv') || amenityLower.includes('television')) return Tv;
  if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return Dumbbell;
  if (amenityLower.includes('pool') || amenityLower.includes('swimming')) return Thermometer;
  if (amenityLower.includes('air') || amenityLower.includes('conditioning')) return Thermometer;
  if (amenityLower.includes('elevator') || amenityLower.includes('lift')) return Car;
  if (amenityLower.includes('coffee') || amenityLower.includes('tea')) return Coffee;
  if (amenityLower.includes('phone') || amenityLower.includes('telephone')) return Phone;
  if (amenityLower.includes('smoking')) return amenityLower.includes('non') ? NoSmoking : Smoking;
  if (amenityLower.includes('child') || amenityLower.includes('baby')) return Baby;
  if (amenityLower.includes('payment') || amenityLower.includes('card')) return CreditCard;
  return CheckCircle;
};

const HotelDetailsModal: React.FC<HotelDetailsModalProps> = ({ hotel, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Group amenities by category
  const groupedAmenities = React.useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    hotel.amenities.forEach(amenity => {
      let category = 'services'; // default
      
      // Categorize amenities
      if (amenityLower.includes('wifi') || amenityLower.includes('internet')) category = 'internet';
      else if (amenityLower.includes('restaurant') || amenityLower.includes('breakfast') || amenityLower.includes('coffee')) category = 'meals';
      else if (amenityLower.includes('gym') || amenityLower.includes('pool') || amenityLower.includes('spa')) category = 'sports';
      else if (amenityLower.includes('tv') || amenityLower.includes('shower') || amenityLower.includes('wardrobe')) category = 'rooms';
      else if (amenityLower.includes('payment') || amenityLower.includes('visa') || amenityLower.includes('cash')) category = 'payment';
      else if (amenityLower.includes('language') || amenityLower.includes('english')) category = 'languages';
      
      if (!groups[category]) groups[category] = [];
      groups[category].push(amenity);
    });
    
    return groups;
  }, [hotel.amenities]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' },
    { id: 'policies', label: 'Policies' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{hotel.name}</h2>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {hotel.address}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Hotel Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About {hotel.name}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {hotel.description || 'Experience comfort and convenience at this exceptional property. Located in the heart of the city, this hotel offers modern amenities and exceptional service for both business and leisure travelers.'}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{hotel.rating}</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{hotel.totalReviews}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{hotel.amenities.length}</div>
                  <div className="text-sm text-muted-foreground">Amenities</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Service</div>
                </div>
              </div>

              {/* Featured Amenities */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Featured Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 8).map(amenity => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {amenity}
                      </Badge>
                    );
                  })}
                  {hotel.amenities.length > 8 && (
                    <Badge variant="outline">+{hotel.amenities.length - 8} more</Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="space-y-6">
              {Object.entries(amenityCategories).map(([categoryId, category]) => {
                const categoryAmenities = groupedAmenities[categoryId] || [];
                if (categoryAmenities.length === 0) return null;
                
                const Icon = category.icon;
                
                return (
                  <div key={categoryId}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryAmenities.map(amenity => {
                        const AmenityIcon = getAmenityIcon(amenity);
                        return (
                          <div key={amenity} className="flex items-center gap-2 p-3 border rounded-lg">
                            <AmenityIcon className="w-4 h-4 text-primary" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Location Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">{hotel.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">City</p>
                      <p className="text-muted-foreground">{hotel.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-muted rounded-lg p-8 text-center">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Interactive map will be displayed here</p>
                <p className="text-sm text-muted-foreground">Coordinates: {hotel.locationLat}, {hotel.locationLng}</p>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Hotel Policies</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Check-in / Check-out</p>
                      <p className="text-muted-foreground">Check-in: 2:00 PM</p>
                      <p className="text-muted-foreground">Check-out: 11:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Cancellation Policy</p>
                      <p className="text-muted-foreground">Free cancellation up to 24 hours before check-in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Payment Methods</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Visa', 'Mastercard', 'bKash', 'Cash'].map(method => (
                          <Badge key={method} variant="outline">{method}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Guest Policies</p>
                      <p className="text-muted-foreground">Photo ID required at check-in</p>
                      <p className="text-muted-foreground">No pets allowed (service animals exempt)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelDetailsModal;
