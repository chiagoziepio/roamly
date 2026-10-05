import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Modal } from "../components/Modal";
import { useTrip } from "../context/TripContext";
import { getDestination } from "../data/destinations";
import type { Activity } from "../types";

const emptyActivity = {
  day: 1,
  time: "09:00",
  title: "",
  category: "Sightseeing",
  location: "",
  cost: 0,
};

function formatDay(date: Date) {
  return {
    weekday: date.toLocaleDateString("en", { weekday: "short" }),
    date: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
  };
}

export function PlannerPage() {
  const { trip, addActivity, updateActivity, removeActivity } = useTrip();
  const destination = getDestination(trip.destinationSlug)!;
  const [activeDay, setActiveDay] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [draft, setDraft] = useState(emptyActivity);
  const [error, setError] = useState("");
  const days = useMemo(() => {
    const start = new Date(`${trip.startDate}T12:00:00`);
    const end = new Date(`${trip.endDate}T12:00:00`);
    const count = Math.max(
      1,
      Math.min(
        10,
        Math.round((end.getTime() - start.getTime()) / 86400000) + 1,
      ),
    );
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return { number: index + 1, ...formatDay(date) };
    });
  }, [trip.startDate, trip.endDate]);
  const dayActivities = trip.activities
    .filter((activity) => activity.day === activeDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  function openNew() {
    setEditing(null);
    setDraft({ ...emptyActivity, day: activeDay });
    setError("");
    setModalOpen(true);
  }
  function openEdit(activity: Activity) {
    setEditing(activity);
    setDraft(activity);
    setError("");
    setModalOpen(true);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.location.trim()) {
      setError("Add an activity name and location.");
      return;
    }
    if (editing) updateActivity({ ...editing, ...draft });
    else addActivity(draft);
    setModalOpen(false);
  }
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-14 lg:px-8">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Your itinerary</p>
            <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight md:text-7xl">
              {destination.city}, day by day.
            </h1>
            <p className="mt-4 text-[#687069]">
              {trip.startDate} — {trip.endDate} · {trip.travelers} travelers
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/destination/${destination.slug}`}
              className="btn-secondary"
            >
              Destination guide
            </Link>
            <button onClick={openNew} className="btn-primary">
              <Icon name="plus" className="size-4" /> Add activity
            </button>
          </div>
        </div>
        <div
          className="mt-10 flex gap-3 overflow-x-auto pb-3"
          role="tablist"
          aria-label="Trip days"
        >
          {days.map((day) => (
            <button
              key={day.number}
              role="tab"
              aria-selected={activeDay === day.number}
              onClick={() => setActiveDay(day.number)}
              className={`min-w-24 rounded-2xl px-5 py-4 text-left transition ${activeDay === day.number ? "bg-[#17211b] text-white shadow-lg" : "bg-white hover:bg-[#f0eee8]"}`}
            >
              <span className="block text-xs font-bold uppercase tracking-wider opacity-60">
                Day {day.number}
              </span>
              <strong className="mt-1 block">{day.weekday}</strong>
              <span className="text-sm opacity-65">{day.date}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-7 px-5 pt-10 lg:grid-cols-[1fr_20rem] lg:px-8">
        <div className="`rounded-4xl bg-white p-5 ring-1 ring-black/5 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Day {activeDay}</p>
              <h2 className="mt-1 font-display text-3xl font-semibold">
                Today’s rhythm
              </h2>
            </div>
            <span className="text-sm text-[#777e78]">
              {dayActivities.length}{" "}
              {dayActivities.length === 1 ? "plan" : "plans"}
            </span>
          </div>
          <div className="mt-8 space-y-4">
            {dayActivities.map((activity) => (
              <article
                key={activity.id}
                className="group grid grid-cols-[4.5rem_1fr_auto] gap-4 rounded-2xl border border-black/8 p-4 transition hover:border-black/15 hover:shadow-sm"
              >
                <div className="border-r border-black/10 pt-1 text-sm font-bold">
                  {activity.time}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#edf4ee] px-2.5 py-1 text-xs font-bold text-[#32654f]">
                      {activity.category}
                    </span>
                    {activity.cost > 0 && (
                      <span className="text-xs text-[#747b75]">
                        ${activity.cost}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold">
                    {activity.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#747b75]">
                    {activity.location}
                  </p>
                </div>
                <div className="flex gap-1 self-center">
                  <button
                    onClick={() => openEdit(activity)}
                    className="grid size-9 place-items-center rounded-full hover:bg-[#f0eee8]"
                    aria-label={`Edit ${activity.title}`}
                  >
                    <Icon name="edit" className="size-4" />
                  </button>
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="grid size-9 place-items-center rounded-full text-[#b74734] hover:bg-red-50"
                    aria-label={`Delete ${activity.title}`}
                  >
                    <Icon name="trash" className="size-4" />
                  </button>
                </div>
              </article>
            ))}
            {dayActivities.length === 0 && (
              <div className="rounded-2xl border border-dashed border-black/15 px-6 py-14 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f0e7d7] text-[#b04e38]">
                  <Icon name="calendar" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  A wide-open day
                </h3>
                <p className="mt-2 text-sm text-[#727972]">
                  Add your first activity and give the day a little shape.
                </p>
                <button onClick={openNew} className="btn-primary mt-5">
                  Add an activity
                </button>
              </div>
            )}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-[1.75rem] bg-[#17211b] text-white">
            <img
              src={destination.image}
              alt=""
              className="h-40 w-full object-cover opacity-80"
            />
            <div className="p-5">
              <p className="text-xs uppercase tracking-widest text-white/50">
                Planning for
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {destination.city}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {destination.tagline}
              </p>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-[#f2c14e] p-6">
            <Icon name="sparkle" />
            <h3 className="mt-8 font-display text-xl font-semibold">
              Leave room for surprise.
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#5e5125]">
              Two or three anchors per day is usually enough. The best moments
              are often unplanned.
            </p>
          </div>
        </aside>
      </section>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        eyebrow={editing ? "Update your day" : `Day ${activeDay}`}
        title={editing ? "Edit activity" : "Add an activity"}
      >
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold">
            Activity name
            <input
              className="field mt-2"
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
              placeholder="e.g. Tea ceremony"
              autoFocus
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm font-semibold">
              Day
              <select
                className="field mt-2"
                value={draft.day}
                onChange={(event) =>
                  setDraft({ ...draft, day: Number(event.target.value) })
                }
              >
                {days.map((day) => (
                  <option key={day.number} value={day.number}>
                    Day {day.number}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Time
              <input
                className="field mt-2"
                type="time"
                value={draft.time}
                onChange={(event) =>
                  setDraft({ ...draft, time: event.target.value })
                }
              />
            </label>
          </div>
          <label className="block text-sm font-semibold">
            Location
            <input
              className="field mt-2"
              value={draft.location}
              onChange={(event) =>
                setDraft({ ...draft, location: event.target.value })
              }
              placeholder="Neighborhood or address"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm font-semibold">
              Category
              <select
                className="field mt-2"
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
              >
                {["Sightseeing", "Food", "Nature", "Culture", "Relax"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Estimated cost
              <input
                className="field mt-2"
                type="number"
                min="0"
                value={draft.cost}
                onChange={(event) =>
                  setDraft({ ...draft, cost: Number(event.target.value) })
                }
              />
            </label>
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary w-full">
            {editing ? "Save changes" : "Add to itinerary"}
          </button>
        </form>
      </Modal>
    </>
  );
}
