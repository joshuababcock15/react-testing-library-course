import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {savePost as mockSavePost} from '../api'
import {Editor} from '../post-editor-02-state'

jest.mock('../api')

test('renders a form with title, content, tags, and a submit button', () => {
  mockSavePost.mockResolvedValueOnce()
  render(<Editor />)
  screen.getByLabelText(/title/i).value = 'Test Title'
  screen.getByLabelText(/content/i).value = 'Test Content'
  screen.getByLabelText(/tags/i).value = 'tag1, tag2'
  const submitButton = screen.getByText(/submit/i)

  userEvent.click(submitButton)

  expect(submitButton).toBeDisabled()
  expect(mockSavePost).toHaveBeenCalledWith({
    title: 'Test Title',
    content: 'Test Content',
    tags: ['tag1', 'tag2'],
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)
})

// disabling this rule for now. We'll get to this later
/*
eslint
  testing-library/prefer-explicit-assert: "off",
*/
