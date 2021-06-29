import { useState } from 'react'
import axios from 'axios'

import './App.css';

async function postImage({image, description}) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)

  const result = await axios.post('http://localhost:8080/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
  console.log(result)
  return result.data
}


function App() {

  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])

  const submit = async event => {
    event.preventDefault()
    const result = await postImage({image: file, description})
    if(result.location) {
      alert('uploaded successfully')
    }
    setImages([result.location, ...images])
  }

  const fileSelected = event => {
    const file = event.target.files[0]
    setFile(file)
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      { images.map( (image, idx) => (
        <div key={idx}>
          <img alt='' src={image}></img>
        </div>
      ))}
    </div>
  );
}

export default App;