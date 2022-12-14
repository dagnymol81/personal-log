import { db } from '../../firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import CreatableSelect from 'react-select/creatable';

export default function AddEvent({ events }) {

  const options = [
    { value: 'blues', label: 'Blues' },
    { value: 'rock', label: 'Rock' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'orchestra', label: 'Orchestra' } 
  ];

  const [newEvent, setNewEvent] = useState('')
  const [newTags, setNewTags] = useState([])
  const { user } = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault()

    let tags = newTags.map(tag => {
      return tag.value
    })

    await addDoc(collection(db, 'events'), {
      event: newEvent,
      completedAt: Timestamp.fromDate(new Date()),
      uid: user.uid,
      tags
    })
    setNewEvent('')
  }

  return (
    <div className="p-3 me-3 my-3 shadow add-event border rounded">
      <form onSubmit={handleSubmit} className="add-event-form">
        <input 
          list="pastEvents"
          id="newEvent"
          placeholder="Add Event"
          onChange={(e) => setNewEvent(e.target.value)}
          value={newEvent}
        />
        <datalist id="pastEvents">
          {events && events.map(done => (
            <option value={done.event} key={done.id} />
          ))}
        </datalist>

        <CreatableSelect 
          onChange= {(option) => setNewTags(option)} 
          options={options} 
          isMulti 
        />

        <button className="btn btn-light border rounded">Add Event</button>
      </form>
    </div>
  )
}
