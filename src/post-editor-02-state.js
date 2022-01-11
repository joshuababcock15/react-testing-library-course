import * as React from 'react'
import {savePost} from './api'

function Editor() {
  const [isSaving, setIsSaving] = React.useState(false)
  function handleSubmit(e) {
    // prevent a full page refresh
    e.preventDefault()
    const {title, content, tags} = e.target.elements
    savePost({
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((t) => t.trim()),
    })
    setIsSaving(true)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" name="title" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" name="content" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" name="tags" />

      <button type="submit" disabled={isSaving}>
        Submit
      </button>
    </form>
  )
}

export {Editor}
