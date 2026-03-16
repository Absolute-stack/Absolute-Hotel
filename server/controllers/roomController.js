import { Room } from "../models/roomModel.js";
import { Booking } from "../models/bookingModel.js";
import { deleteCloudinaryImages } from "../middleware/multer.js";

// @desc Show all rooms
// @route Get : /api/room/all
// @access Public
export async function getAllRooms(req, res) {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      capacity,
      limit = 10,
      isAvailable,
      cursor,
    } = req.query;
    const limitNum = Math.min(Number(limit), 50);
    const filter = {};
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (capacity) filter.capacity = { $lte: Number(capacity) };
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === true;
    if (cursor) filter._id = { $lt: cursor };
    const rooms = await Room.find(filter)
      .sort({ createdAt: -1, _id: 1 })
      .limit(limitNum + 1)
      .lean();

    const hasNextPage = rooms.length > limitNum;
    if (hasNextPage) rooms.pop();

    const nextCursor = hasNextPage ? rooms[rooms.length - 1]._id : null;
    return res.status(200).json({
      rooms,
      nextCursor,
      hasNextPage,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc Get all types of rooms with counts with a price range filter
// @route Get : /api/room/room-filters
// @access Public
export async function getRoomFilters(req, res) {
  try {
    const [typesWithCount, priceRange] = await Promise.all([
      Room.aggregate([
        { $match: { isAvailable: true } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $project: { _id: 0, type: "$_id", count: 1 } },
      ]),
      Room.aggregate([
        { $match: { isAvailable: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      types: typesWithCount,
      minPrice: priceRange?.[0].minPrice ?? 0,
      maxPrice: priceRange?.[0].maxPrice ?? 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc getting roomdetails
// @route Get : /api/room/:id
// @access Public
export async function getRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room)
      return res.status(400).json({
        success: false,
        message: "Room not found",
      });
    return res.status(200).json({
      room,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc check availabilityOfRoom
// @route Get: /api/room/check
// @access Public
export async function checkAvailability(req, res) {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut)
      return res.status(400).json({
        success: false,
        message: "CheckIn and CheckOut are required",
      });
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const overlapping = await Booking.findOne({
      room: req.params.id,
      status: { $in: ["pending", "confirmed"] },
      $or: { checkIn: { $lte: checkOutDate }, checkout: { $gte: checkInDate } },
    });
    return res.status(200).json({ success: true, available: !overlapping });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc create a room
// @route Post: /api/room/admin/create
// @access adminProtect
export async function createRoom(req, res) {
  try {
    const {
      name,
      roomNumber,
      type,
      price,
      description,
      amenities,
      avgRating = 0,
      totalReviews = 0,
    } = req.body;

    const exists = await Room.findOne({ roomNumber });
    if (exists)
      return res.status(409).json({
        success: false,
        message: "Room Number already exists",
      });
    const parsedAmenities =
      typeof amenities === "string" ? JSON.parse(amenities) : amenities;
    const images = req?.files
      ?.map((f) => f.secure_url || f.path)
      .filter(Boolean);

    const room = await Room.create({
      name,
      roomNumber,
      type,
      price: Number(price),
      description,
      images,
      amenities: parsedAmenities,
      isAvailable: true,
      avgRating,
      totalReviews,
    });

    return res.status(201).json({
      room,
      success: true,
    });
  } catch (error) {
    if (req.files.length > 0) {
      req?.files?.map(
        async (f) => await deleteCloudinaryImages(f.secure_url || f.path),
      );
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc update or edit a room
// @route PATCH: /api/room/update/:id
// @access adminProtect
export async function updateRoom(req, res) {
  try {
    const {
      name,
      roomNumber,
      type,
      price,
      description,
      amenities,
      imagesToDelete,
    } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room)
      return res.status(400).json({
        success: false,
        message: "Room not found",
      });
    let currentImages = [...room.images];
    if (imagesToDelete) {
      const toDelete =
        typeof imagesToDelete === "string"
          ? JSON.parse(imagesToDelete)
          : imagesToDelete;
      currentImages = currentImages.filter((img) => !toDelete.includes(img));
      await deleteCloudinaryImages(toDelete);
    }
    const newImages = req?.files?.map((f) => f.secure_url || f.path);
    const updatedImages = [...currentImages, ...newImages];
    const updates = {};
    if (name) updates.name = name;
    if (roomNumber) updates.roomNumber = roomNumber;
    if (type) updates.types = types;
    if (price) updates.price = Number(price);
    if (description) updates.description = description;
    if (amenities)
      updates.amenities =
        typeof amenities === "string" ? JSON.parse(amenities) : amenities;
    updates.images = updatedImages;

    await Room.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: false,
    });
    await room.save({ validateBeforeSave: false });
    return res.status(200).json({
      room,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc delete room
// @route DELETE: /api/room/delete/:id
// @access adminProtect
export async function deleteRoom(req, res) {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room)
      return res.status(400).json({
        success: false,
        message: "Room not found",
      });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
