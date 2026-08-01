const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { convertMapUrlToPointCustom } = require('../utils/mapHelpers');

// GET /api/hotels — search hotels (public)
router.get('/', async (req, res) => {
  try {
    const { q, city, showRedMarked, checkIn, checkOut, adults, children, roomsCount } = req.query;
    const filter = {};
    if (!showRedMarked || showRedMarked === 'false') filter.isRedMarked = false;
    if (city) filter.city = new RegExp(city, 'i');
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { city: new RegExp(q, 'i') },
        { address: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
      ];
    }
    const hotels = await Hotel.find(filter).sort({ updatedAt: -1 }).lean();

    // Attach rooms to each hotel
    const hotelIds = hotels.map(h => h._id);
    const rooms = await Room.find({ hotel: { $in: hotelIds } }).lean();
    
    // Find overlapping bookings if checkIn & checkOut are provided
    let bookedRoomCapacity = {}; // { roomId: number of overlaps }
    if (checkIn && checkOut) {
      const Booking = require('../models/Booking');
      const overlappingBookings = await Booking.find({
        status: { $ne: 'CANCELLED' },
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
      }).lean();
      
      overlappingBookings.forEach(b => {
        const rid = b.room.toString();
        bookedRoomCapacity[rid] = (bookedRoomCapacity[rid] || 0) + 1;
      });
    }

    const roomsByHotel = {};
    const reqAdults = parseInt(adults || 2);
    const reqChildren = parseInt(children || 0);
    const reqRooms = parseInt(roomsCount || 1);
    
    // Calculate required capacity per room
    const adultsPerRoom = Math.ceil(reqAdults / reqRooms);
    const childrenPerRoom = Math.ceil(reqChildren / reqRooms);

    rooms.forEach(r => {
      const hid = r.hotel.toString();
      const rid = r._id.toString();
      
      // 1. Availability Check (Dates)
      const booked = bookedRoomCapacity[rid] || 0;
      const total = r.totalInventory || 1;
      if (checkIn && checkOut && booked >= total) {
        return; // skip this room (no inventory)
      }

      // 2. Capacity Check (Guests)
      // Check if this room can accommodate the required density
      const fitsAdults = (r.maxAdults || 2) >= adultsPerRoom;
      const fitsChildren = (r.maxChildren || 0) >= childrenPerRoom;
      
      if (!fitsAdults || !fitsChildren) {
        return; // skip this room (too small)
      }
      
      if (!roomsByHotel[hid]) roomsByHotel[hid] = [];
      roomsByHotel[hid].push({ ...r, id: r._id.toString(), hotelId: hid });
    });

    let result = hotels.map(h => ({
      ...h,
      id: h._id.toString(),
      ownerId: h.owner?.toString() || '',
      rooms: roomsByHotel[h._id.toString()] || [],
    }));
    
    // If user asked for dates, and a hotel has no rooms left, hide the hotel entirely
    if (checkIn && checkOut) {
      result = result.filter(h => h.rooms.length > 0);
    }

    res.json({ hotels: result });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/hotels/all — admin: all hotels
router.get('/all', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ updatedAt: -1 }).lean();
    res.json(hotels.map(h => ({ ...h, id: h._id.toString(), ownerId: h.owner?.toString() || '' })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).lean();
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    const rooms = await Room.find({ hotel: hotel._id }).lean();
    res.json({
      ...hotel,
      id: hotel._id.toString(),
      ownerId: hotel.owner?.toString() || '',
      rooms: rooms.map(r => ({ ...r, id: r._id.toString(), hotelId: hotel._id.toString() })),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

const { uploadImages } = require('../utils/uploadHelpers');

// POST /api/hotels
router.post('/', async (req, res) => {
  try {
    let { mapUrl, locationLat, locationLng, images, ownerId, owner, name, address, city, ...rest } = req.body;
    
    // Fallback/Resolve valid owner ObjectId
    let finalOwnerId = ownerId || owner;
    if (!finalOwnerId || !mongoose.Types.ObjectId.isValid(finalOwnerId)) {
      const User = require('../models/User');
      let fallbackUser = await User.findOne({ role: { $in: ['OWNER', 'ADMIN'] } });
      if (!fallbackUser) {
        fallbackUser = await User.create({ name: 'Default Owner', email: 'owner@staybuddy.com', role: 'OWNER' });
      }
      finalOwnerId = fallbackUser._id;
    }

    if (mapUrl && typeof mapUrl === 'string' && mapUrl.trim() !== "") {
      try {
        const pt = await convertMapUrlToPointCustom(mapUrl);
        if (pt && pt.latitude) {
          locationLat = pt.latitude;
          locationLng = pt.longitude;
        }
      } catch(e) { console.error(e); }
    }

    let uploadedImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      try {
        uploadedImages = await uploadImages(images, 'staybuddy/hotels');
      } catch (imgErr) {
        console.error("Image upload failed, using provided images:", imgErr);
        uploadedImages = images;
      }
    } else if (images) {
      uploadedImages = Array.isArray(images) ? images : [];
    }

    const hotel = await Hotel.create({
      ...rest,
      name: name || 'New Hotel',
      address: address || 'Default Address',
      city: city || 'Dhaka',
      locationLat: Number(locationLat) || 0,
      locationLng: Number(locationLng) || 0,
      mapUrl: mapUrl || '',
      images: uploadedImages,
      owner: finalOwnerId
    });

    const hotelObj = hotel.toObject();
    res.status(201).json({
      ...hotelObj,
      id: hotel._id.toString(),
      ownerId: hotel.owner ? hotel.owner.toString() : ''
    });
  } catch (err) {
    console.error("POST /api/hotels Error:", err);
    res.status(400).json({ message: err.message || 'Failed to create hotel' });
  }
});

// PATCH /api/hotels/:id
router.patch('/:id', async (req, res) => {
  try {
    let { mapUrl, locationLat, locationLng, images, ...rest } = req.body;
    if (mapUrl && mapUrl.trim() !== "") {
      try {
        const pt = await convertMapUrlToPointCustom(mapUrl);
        if (pt && pt.latitude) {
          locationLat = pt.latitude;
          locationLng = pt.longitude;
        }
      } catch(e) { console.error(e); }
    }

    const uploadedImages = images ? await uploadImages(images, 'staybuddy/hotels') : undefined;
    const updateData = { ...rest, locationLat, locationLng, mapUrl };
    if (uploadedImages) updateData.images = uploadedImages;
    
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, updateData, { new: true }).lean();
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json({ ...hotel, id: hotel._id.toString(), ownerId: hotel.owner?.toString() || '' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/hotels/:id
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    // Also delete associated rooms
    await Room.deleteMany({ hotel: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/hotels/:id/redmark
router.patch('/:id/redmark', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    hotel.isRedMarked = !hotel.isRedMarked;
    await hotel.save();
    res.json({ ...hotel.toObject(), id: hotel._id.toString(), ownerId: hotel.owner?.toString() || '' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/hotels/:id/active
router.patch('/:id/active', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    hotel.isActive = !hotel.isActive;
    await hotel.save();
    res.json({ ...hotel.toObject(), id: hotel._id.toString(), ownerId: hotel.owner?.toString() || '' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/hotels/owner/:ownerId — owner's hotels
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.params.ownerId }).sort({ updatedAt: -1 }).lean();
    const hotelIds = hotels.map(h => h._id);
    const rooms = await Room.find({ hotel: { $in: hotelIds } }).lean();
    const roomsByHotel = {};
    rooms.forEach(r => {
      const hid = r.hotel.toString();
      if (!roomsByHotel[hid]) roomsByHotel[hid] = [];
      roomsByHotel[hid].push({ ...r, id: r._id.toString(), hotelId: hid });
    });
    res.json(hotels.map(h => ({
      ...h,
      id: h._id.toString(),
      ownerId: h.owner?.toString() || '',
      rooms: roomsByHotel[h._id.toString()] || [],
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
