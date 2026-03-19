import "./Rooms.css";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRoomFilters, useRooms } from "../../hooks/useRooms.js";
import RoomCard from "../../components/RoomCard/RoomCard.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";

export default function Rooms() {
  const [SearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: SearchParams.get("type") || "",
    checkIn: SearchParams.get("checkIn") || "",
    checkOut: SearchParams.get("checkOut") || "",
    minPrice: "",
    maxPrice: "",
  });
  const [filtersOpen, setFiltersOpen] = useState(false); // ← mobile toggle

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useRooms(filters);

  if (isPending) return <div>Loading...</div>;

  let allRooms = data?.pages?.flatMap((page) => page.rooms);

  return (
    <main className="rooms">
      <Navbar />
      <div className="rooms-header">
        <p className="highlight-text">OUR COLLECTION</p>
        <p className="title-text">Rooms & Suites</p>
        <p className="label-1">Find Your Perfect Stay</p>
      </div>

      {/* Mobile filter toggle — hidden on desktop via CSS */}
      <button
        type="button"
        className="filter-toggle-btn"
        onClick={() => setFiltersOpen((prev) => !prev)}
      >
        <span>⚙</span>
        {filtersOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="rooms-divider">
        <FilterSideBar
          filters={filters}
          onChange={setFilters}
          isOpen={filtersOpen}
        />
        <div className="rooms-grid">
          <div className="container">
            {allRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
          {hasNextPage ? (
            <button
              type="button"
              disabled={isFetchingNextPage}
              onClick={fetchNextPage}
              className="btn-2"
            >
              {isFetchingNextPage ? "Loading more rooms" : "Load more"}
            </button>
          ) : (
            <p className="label-1 center">No more rooms.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function FilterSideBar({ filters = {}, onChange, isOpen }) {
  const { data, isPending } = useRoomFilters();

  function handleMinPrice(e) {
    onChange({ ...filters, minPrice: Number(e.target.value) });
  }

  function handleMaxPrice(e) {
    onChange({ ...filters, maxPrice: Number(e.target.value) });
  }

  if (isPending) return <div>Loading filters....</div>;

  return (
    // ← adds "open" class on mobile to trigger the drawer animation
    <div className={`filter-sidebar ${isOpen ? "open" : ""}`}>
      <p className="filter-title">Room Type</p>
      <hr />
      {data?.types?.map(({ type, count }) => (
        <div key={type} className="filter flex">
          <input
            type="checkbox"
            id={type}
            name={type}
            checked={filters.type === type}
            onChange={() =>
              onChange({
                ...filters,
                type: filters.type === type ? undefined : type,
              })
            }
          />
          <label htmlFor={type}>
            {type} ({count})
          </label>
        </div>
      ))}
      <p className="filter-title">Price Range</p>
      <hr />
      <div className="filter-group">
        <label htmlFor="Min">Sort By: Min Price</label>
        <input
          type="number"
          name="Min"
          value={filters.minPrice || ""}
          placeholder={`Min ${data.minPrice ?? 0} GHC per night`}
          onChange={handleMinPrice}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="Max">Sort By: Max Price</label>
        <input
          type="number"
          name="Max"
          placeholder={`Max ${data.maxPrice ?? 0} GHC per night`}
          value={filters.maxPrice || ""}
          onChange={handleMaxPrice}
        />
      </div>
    </div>
  );
}
