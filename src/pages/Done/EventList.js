import { db } from '../../firebase/config'
import { doc, deleteDoc } from "firebase/firestore"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function EventList({ events }) {

  const handleClick = async (id) => {
    const ref = doc(db, 'events', id)
    await deleteDoc(ref)
  }

  return (
    <div className="list">
        {events && events.map(done => (
            <div key={done.id} className="card p-3 me-3 my-3 shadow">
              <h5 className="card-title">{done.event}</h5>
              <p>{done.completedAt.toDate().toDateString()}<br />
              {formatDistanceToNow(done.completedAt.toDate(), { addSuffix: true })}</p>
              <p>
              Do this again: {done.timeDue.toDate().toDateString()} in {formatDistanceToNow(done.timeDue.toDate())}
              </p>
              <p>Tags:&nbsp;
                {done.tags && done.tags.map((tag, i) => (
                  <span key={i}>{tag.value} </span>
                ))}
              </p>
              <i className="bi bi-trash3" onClick={() => handleClick(done.id)}></i>            
      </div>
      ))}

    </div>
  )
}
