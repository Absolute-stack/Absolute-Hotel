import "./RoomCard.css";
import { Link } from "react-router-dom";

export default function RoomCard({ room }) {
  const stars = Math.round(room.avgRating || 0);

  return (
    <Link to={`/rooms/${room._id}`} className="room-card">
      <div className="room-card__image-wrap">
        <img
          src={room.images?.[0]}
          alt={room.name}
          loading="lazy"
          decoding="async"
          className="room-card__image"
        />
        <div className="room-card__badge">{room.type}</div>
        {!room.isAvailable && (
          <div className="room-card__unavailable">Unavailable</div>
        )}
      </div>

      <div className="room-card__body">
        <div className="room-card__top">
          <p className="room-card__floor">
            Floor {room.floor} · Room {room.roomNumber}
          </p>
          {room.avgRating > 0 && (
            <div className="room-card__rating">
              <span className="room-card__star">★</span>
              <span>{Number(room.avgRating).toFixed(1)}</span>
              <span className="room-card__reviews">({room.totalReviews})</span>
            </div>
          )}
        </div>

        <h3 className="room-card__name">{room.name}</h3>

        <div className="room-card__amenities">
          {room.amenities?.slice(0, 3).map((a) => (
            <span key={a} className="room-card__amenity">
              {a}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="room-card__amenity">
              +{room.amenities.length - 3}
            </span>
          )}
        </div>

        <div className="room-card__footer">
          <div className="room-card__price">
            <span className="room-card__price-amount">
              GH₵{room.price?.toLocaleString()}
            </span>
            <span className="room-card__price-night"> / night</span>
          </div>
          <div className="room-card__capacity">
            <span>👤</span>
            <span>{room.capacity}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
