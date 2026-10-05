import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import type { Destination } from "../types";
import { Modal } from "./Modal";

export function PlanTripModal({
  destination,
  open,
  onClose,
}: {
  destination: Destination;
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { createTrip } = useTrip();
  const [startDate, setStartDate] = useState("2026-11-12");
  const [endDate, setEndDate] = useState("2026-11-16");
  const [travelers, setTravelers] = useState(2);
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!startDate || !endDate || endDate < startDate) {
      setError("Choose an end date after your start date.");
      return;
    }
    createTrip({
      destinationSlug: destination.slug,
      startDate,
      endDate,
      travelers,
    });
    onClose();
    navigate("/planner");
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="New adventure"
      title={`Plan ${destination.city}`}
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm font-semibold">
            Start date
            <input
              className="field mt-2"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label className="text-sm font-semibold">
            End date
            <input
              className="field mt-2"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Travelers
          <select
            className="field mt-2"
            value={travelers}
            onChange={(event) => setTravelers(Number(event.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <option key={number} value={number}>
                {number} {number === 1 ? "traveler" : "travelers"}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}
        <button className="btn-primary w-full" type="submit">
          Create my trip
        </button>
      </form>
    </Modal>
  );
}
