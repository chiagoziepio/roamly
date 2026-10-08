import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Modal } from "../components/Modal";
import { useTrip } from "../context/TripContext";
import { getDestination } from "../data/destinations";

export function TripPage() {
  const { trip, addExpense, toggleChecklist } = useTrip();
  const destination = getDestination(trip.destinationSlug)!;
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const spent = trip.expenses.reduce((sum, item) => sum + item.amount, 0);
  const percentage = Math.min(100, Math.round((spent / trip.budget) * 100));
  const completed = trip.checklist.filter((item) => item.done).length;
  function submitExpense(event: FormEvent) {
    event.preventDefault();
    if (!label.trim() || Number(amount) <= 0) return;
    addExpense({ label: label.trim(), amount: Number(amount) });
    setLabel("");
    setAmount("");
    setExpenseOpen(false);
  }
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-14 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-[#17211b] p-7 text-white md:p-12">
          <img
            src={destination.image}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#17211b] via-[#17211b]/85 to-transparent" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#f2c14e]">
              Your upcoming trip
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-7xl">
              {destination.city} is calling.
            </h1>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/75">
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                {trip.startDate} — {trip.endDate}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                {trip.travelers} travelers
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/planner"
                aria-label="navigate to planner page"
                className="rounded-full bg-[#f2c14e] px-5 py-3 font-bold text-[#17211b]"
              >
                Open itinerary
              </Link>
              <button
                onClick={() => setBookingOpen(true)}
                className="rounded-full border border-white/30 px-5 py-3 font-bold hover:bg-white/10"
              >
                Booking details
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pt-8 lg:grid-cols-3 lg:px-8">
        <article className="rounded-[1.75rem] bg-white p-6 ring-1 ring-black/5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Trip budget</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                ${spent.toLocaleString()}{" "}
                <span className="text-lg font-normal text-[#747b75]">
                  of ${trip.budget.toLocaleString()}
                </span>
              </h2>
            </div>
            <button
              onClick={() => setExpenseOpen(true)}
              className="btn-secondary"
            >
              <Icon name="plus" className="size-4" /> Expense
            </button>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#eceae4]">
            <div
              role="progressbar"
              aria-label="Budget used"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage}
              className="h-full rounded-full bg-[#e75d43] transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[#777e78]">
            <span>{percentage}% used</span>
            <span>
              ${Math.max(0, trip.budget - spent).toLocaleString()} remaining
            </span>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {trip.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-2xl bg-[#f8f6f1] px-4 py-3"
              >
                <span className="text-sm font-medium">{expense.label}</span>
                <strong>${expense.amount.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[1.75rem] bg-[#1f5c4a] p-6 text-white">
          <div className="flex justify-between">
            <Icon name="check" className="size-7 text-[#f2c14e]" />
            <span className="text-sm text-white/55">
              {completed}/{trip.checklist.length}
            </span>
          </div>
          <h2 className="mt-8 font-display text-3xl font-semibold">
            Ready to roam?
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            A few small things before you go.
          </p>
          <div className="mt-6 space-y-2">
            {trip.checklist.map((item) => (
              <label
                key={item.id}
                role="checklistLabel"
                aria-checked={item.done}
                className="flex cursor-pointer items-start gap-3 rounded-xl p-2 transition hover:bg-white/5"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklist(item.id)}
                  className="mt-0.5 size-5 accent-[#f2c14e]"
                />
                <span
                  className={`text-sm ${item.done ? "text-white/40 line-through" : "text-white/85"}`}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </article>
        <article className="rounded-[1.75rem] bg-[#efb7a8] p-6 lg:col-span-3">
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-center">
            <div>
              <p className="eyebrow text-[#783a2c]">At a glance</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                Your itinerary has {trip.activities.length} moments planned.
              </h2>
              <Link
                to="/planner"
                aria-label="navigate to planner page"
                className="mt-5 inline-flex items-center gap-2 font-bold text-[#713d31]"
              >
                Fine-tune your days <Icon name="arrow" className="size-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((day) => (
                <div key={day} className="rounded-2xl bg-white/45 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8a4c37]">
                    Day {day}
                  </span>
                  <strong className="mt-7 block font-display text-xl">
                    {trip.activities.filter((item) => item.day === day).length}{" "}
                    plans
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
      <Modal
        open={expenseOpen}
        onClose={() => setExpenseOpen(false)}
        eyebrow="Keep on track"
        title="Add an expense"
      >
        <form onSubmit={submitExpense} className="space-y-4">
          <label className="block text-sm font-semibold">
            Expense name
            <input
              className="field mt-2"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="e.g. Train tickets"
              autoFocus
            />
          </label>
          <label className="block text-sm font-semibold">
            Amount (USD)
            <input
              className="field mt-2"
              type="number"
              min="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0"
            />
          </label>
          <button className="btn-primary w-full">Add expense</button>
        </form>
      </Modal>
      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        eyebrow="Booking status"
        title="The essentials"
      >
        <div className="space-y-3">
          {[
            ["Flight to Kansai", "Confirmed", "JL 702"],
            ["Ace Hotel Kyoto", "Deposit paid", "4 nights"],
            ["Airport transfer", "Still to book", "—"],
          ].map(([name, status, detail], index) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-2xl bg-[#f4f1ea] p-4"
            >
              <div>
                <strong className="block">{name}</strong>
                <span className="mt-1 block text-sm text-[#747b75]">
                  {detail}
                </span>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${index === 2 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
