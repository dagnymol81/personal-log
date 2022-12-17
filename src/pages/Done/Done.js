import { useCollection } from "../../hooks/useCollection"
import AddEvent from "./AddEvent"
import EventList from "./EventList"
import { useAuthContext } from "../../hooks/useAuthContext"
import './Done.css'

export default function Done() {

  const { user } = useAuthContext()

  const { documents: events } = useCollection(
    'events',
    ['uid', '==', user.uid]
    )

  return (
    <div>

      <EventList events={events} />
      <AddEvent events={events} />

    </div>
  )
}
