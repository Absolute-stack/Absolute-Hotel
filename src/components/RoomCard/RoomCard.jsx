import { Link } from "react-router-dom";
import person from "../../assets/images/person.webp";
import rating_star from "../../assets/images/rating_star.png";

function RoomCardCompound({ children }) {
  return <div className="room-card">{children}</div>;
}

function CardImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      className="room-card-img"
      fetchPriority="high"
      crossOrigin="anonymous"
    />
  );
}

function ImageTag({ children }) {
  return <div className="img-tag">{children}</div>;
}

function CardLayout({ children }) {
  return <div className="card-layout">{children}</div>;
}

function CardStats({ floor, roomNumber, avgRating }) {
  return (
    <div className="card-stats flex-sb">
      <div className="left label-1">Room Number {roomNumber}</div>
      <div className="right">
        <div className="rating-container flex-sml">
          <img src={rating_star} alt="star" loading="lazy" decoding="async" />
          <p>{avgRating}</p>
        </div>
      </div>
    </div>
  );
}

function CardName({ children }) {
  return <h3 className="card-name">{children}</h3>;
}

function CardAmenities({ children }) {
  return <div className="card-amenities flex">{children}</div>;
}

function CardPriceDetails({ price, capacity }) {
  return (
    <div className="card-price-details flex-sb">
      <div className="left flex-sml">
        GH₵{price}
        <span className="label-1">/night</span>
      </div>
      <div className="guests">
        <img src={person} alt="person_icon" loading="eager" decoding="async" />
        <div>{capacity}</div>
      </div>
    </div>
  );
}

RoomCardCompound.CardImage = CardImage;
RoomCardCompound.ImageTag = ImageTag;
RoomCardCompound.CardLayout = CardLayout;
RoomCardCompound.CardStats = CardStats;
RoomCardCompound.CardName = CardName;
RoomCardCompound.CardAmenities = CardAmenities;
RoomCardCompound.CardPriceDetails = CardPriceDetails;

export default function RoomCard({ room }) {
  return (
    <Link to={`/room-details/${room._id}`}>
      <RoomCardCompound>
        <RoomCardCompound.CardLayout>
          <RoomCardCompound.CardImage src={room?.images?.[0]} />
          <RoomCardCompound.CardStats
            floor={room?.floor}
            roomNumber={room?.roomNumber}
            avgRating={room?.avgRating}
          />
          <RoomCardCompound.CardName children={room.name} />
          <RoomCardCompound.CardAmenities
            children={room?.amenities?.slice(0, 4).map((amenity) => {
              return <span>{amenity}</span>;
            })}
          />
          <RoomCardCompound.CardPriceDetails
            price={room.price}
            capacity={room.capacity}
          />
        </RoomCardCompound.CardLayout>
      </RoomCardCompound>
    </Link>
  );
}
