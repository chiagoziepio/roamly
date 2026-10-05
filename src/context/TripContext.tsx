import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Activity, Expense, Trip } from "../types";

const initialTrip: Trip = {
  destinationSlug: "kyoto-japan",
  startDate: "2026-11-12",
  endDate: "2026-11-16",
  travelers: 2,
  budget: 3200,
  activities: [
    {
      id: "a1",
      day: 1,
      time: "09:00",
      title: "Fushimi Inari sunrise walk",
      category: "Sightseeing",
      location: "Fushimi Ward",
      cost: 0,
    },
    {
      id: "a2",
      day: 1,
      time: "13:00",
      title: "Nishiki Market tasting",
      category: "Food",
      location: "Nakagyo Ward",
      cost: 45,
    },
    {
      id: "a3",
      day: 2,
      time: "10:30",
      title: "Arashiyama bamboo grove",
      category: "Nature",
      location: "Arashiyama",
      cost: 18,
    },
  ],
  expenses: [
    { id: "e1", label: "Flights", amount: 1280 },
    { id: "e2", label: "Hotel deposit", amount: 640 },
  ],
  checklist: [
    { id: "c1", label: "Confirm hotel booking", done: true },
    { id: "c2", label: "Reserve pocket Wi-Fi", done: false },
    { id: "c3", label: "Download offline maps", done: false },
    { id: "c4", label: "Buy travel insurance", done: true },
  ],
};

type NewTrip = Pick<
  Trip,
  "destinationSlug" | "startDate" | "endDate" | "travelers"
>;

type TripContextValue = {
  trip: Trip;
  createTrip: (trip: NewTrip) => void;
  addActivity: (activity: Omit<Activity, "id">) => void;
  updateActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  toggleChecklist: (id: string) => void;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState(initialTrip);

  const value = useMemo<TripContextValue>(
    () => ({
      trip,
      createTrip: (details) =>
        setTrip({
          ...initialTrip,
          ...details,
          activities: [],
          expenses: [],
          checklist: initialTrip.checklist.map((item) => ({
            ...item,
            done: false,
          })),
        }),
      addActivity: (activity) =>
        setTrip((current) => ({
          ...current,
          activities: [
            ...current.activities,
            { ...activity, id: crypto.randomUUID() },
          ],
        })),
      updateActivity: (activity) =>
        setTrip((current) => ({
          ...current,
          activities: current.activities.map((item) =>
            item.id === activity.id ? activity : item,
          ),
        })),
      removeActivity: (id) =>
        setTrip((current) => ({
          ...current,
          activities: current.activities.filter((item) => item.id !== id),
        })),
      addExpense: (expense) =>
        setTrip((current) => ({
          ...current,
          expenses: [
            ...current.expenses,
            { ...expense, id: crypto.randomUUID() },
          ],
        })),
      toggleChecklist: (id) =>
        setTrip((current) => ({
          ...current,
          checklist: current.checklist.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item,
          ),
        })),
    }),
    [trip],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

// Context and its hook intentionally live together as one small public module.
// eslint-disable-next-line react-refresh/only-export-components
export function useTrip() {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used inside TripProvider");
  return context;
}
