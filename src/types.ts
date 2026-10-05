export type TravelStyle = 'Culture' | 'Nature' | 'Food' | 'Coast'

export type Destination = {
  slug: string
  city: string
  country: string
  region: string
  tagline: string
  description: string
  image: string
  styles: TravelStyle[]
  rating: number
  price: string
  coordinates: { latitude: number; longitude: number }
  highlights: { title: string; detail: string }[]
}

export type Activity = {
  id: string
  day: number
  time: string
  title: string
  category: string
  location: string
  cost: number
}

export type Expense = {
  id: string
  label: string
  amount: number
}

export type ChecklistItem = {
  id: string
  label: string
  done: boolean
}

export type Trip = {
  destinationSlug: string
  startDate: string
  endDate: string
  travelers: number
  budget: number
  activities: Activity[]
  expenses: Expense[]
  checklist: ChecklistItem[]
}
