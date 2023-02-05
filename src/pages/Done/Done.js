import { useCollection } from "../../hooks/useCollection"
import AddEvent from "./AddEvent"
import EventList from "./EventList"
import { useAuthContext } from "../../hooks/useAuthContext"


export default function Done() {

  const { user } = useAuthContext()

  const { documents: events } = useCollection(
    'events',
    ['uid', '==', user.uid]
    )

  return (
    <div>

      <EventList events={events} />
      <h2 className="mb-5">Add An Event</h2>
      <AddEvent />

    </div>
  )
}
