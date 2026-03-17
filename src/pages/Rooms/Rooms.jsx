import "./Rooms.css";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRooms, useRoomFilters } from "../../hooks/useRooms.js";
import RoomCard from "../../components/RoomCard/RoomCard.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

const TYPES = ["single", "double", "suite", "penthouse"];

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    minPrice: "",
    maxPrice: "",
    capacity: searchParams.get("guests") || "",
  });

  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useRooms(filters);
  const { data: filterData } = useRoomFilters();

  const rooms = data?.pages?.flatMap((p) => p.rooms) ?? [];

  function handleFilter(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: value === prev[key] ? "" : value,
    }));
  }

  return (
    <div className="rooms-page">
      <Navbar />

      <div className="rooms-page__hero">
        <div className="container">
          <p className="label">Our Collection</p>
          <h1 className="display-lg rooms-page__title">Rooms & Suites</h1>
          <p className="rooms-page__sub">
            {rooms.length > 0
              ? `${rooms.length}+ rooms available`
              : "Find your perfect stay"}
          </p>
        </div>
      </div>

      <div className="container rooms-page__layout">
        {/* Sidebar Filters */}
        <aside className="filters">
          <div className="filters__section">
            <p className="filters__heading">Room Type</p>
            {filterData?.types?.map(({ type, count }) => (
              <label key={type} className="filters__option">
                <input
                  type="checkbox"
                  checked={filters.type === type}
                  onChange={() => handleFilter("type", type)}
                />
                <span className="filters__option-label">{type}</span>
                <span className="filters__option-count">{count}</span>
              </label>
            ))}
          </div>

          <div className="filters__section">
            <p className="filters__heading">Price Range</p>
            <div className="filters__price">
              <input
                type="number"
                placeholder={`Min GH₵${filterData?.minPrice ?? 0}`}
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, minPrice: e.target.value }))
                }
              />
              <span>—</span>
              <input
                type="number"
                placeholder={`Max GH₵${filterData?.maxPrice ?? 9999}`}
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, maxPrice: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="filters__section">
            <p className="filters__heading">Guests</p>
            <div className="filters__guests">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`filters__guest-btn ${filters.capacity === String(n) ? "active" : ""}`}
                  onClick={() => handleFilter("capacity", String(n))}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {(filters.type ||
            filters.minPrice ||
            filters.maxPrice ||
            filters.capacity) && (
            <button
              className="filters__clear"
              onClick={() =>
                setFilters({
                  type: "",
                  minPrice: "",
                  maxPrice: "",
                  capacity: "",
                })
              }
            >
              Clear Filters
            </button>
          )}
        </aside>

        {/* Room Grid */}
        <main className="rooms-page__main">
          {isPending ? (
            <div className="page-loading">
              <div className="spinner" />
              <span>Loading rooms...</span>
            </div>
          ) : rooms.length === 0 ? (
            <div className="rooms-page__empty">
              <p className="display-md">No rooms found</p>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="rooms-grid">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>
              {hasNextPage && (
                <div className="rooms-page__load-more">
                  <button
                    className="btn btn--outline btn--lg"
                    onClick={fetchNextPage}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More Rooms"}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
