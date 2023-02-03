import {collection, doc, addDoc} from "firebase/firestore"
import { useState } from "react"
import { db } from '../../firebase/config'
import { Form, Button } from "react-bootstrap"

export default function Feedback({ user }) {

  const [title, setTitle] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const docRef = await addDoc(collection(db, 'feedback'), {
      title,
      feedback,
      uid: user.uid,
      isNew: true
    })
    console.log("Document written with ID: ", docRef.id);
    alert("Thanks for your feedback")
    setTitle('')
    setFeedback('')
  }

   return (
    <div>
      <h2>Submit Feedback</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Control 
              type="text"
              placeholder="Short Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
         <br />
         <Form.Control 
            as="textarea"
            rows={3}
            placeholder="Description"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)} 
         />
          <Button variant="secondary my-3">Submit Feedback</Button>
        </Form>
    </div>
  )
}
