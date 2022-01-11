import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {build, fake, sequence} from 'test-data-bot'
import {Redirect as MockRedirect} from 'react-router'
import userEvent from '@testing-library/user-event'
import {savePost as mockSavePost} from '../api'
import {Editor} from '../post-editor-03-api'

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

jest.mock('../api')

afterEach(() => {
  jest.clearAllMocks()
})

const postBuilder = build('Post').fields({
  title: fake((f) => f.lorem.words()),
  // replace all r globally with an empty string
  content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake((f) => [f.lorem.words(), f.lorem.words(), f.lorem.words()]),
})

const userBuilder = build('User').fields({
  id: sequence((s) => `user-${s}`),
})

function renderEditor() {
  const fakeUser = userBuilder()
  const utils = render(<Editor user={fakeUser} />)
  const fakePost = postBuilder()

  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  const submitButton = screen.getByText(/submit/i)
  return {
    ...utils,
    submitButton,
    fakePost,
    fakeUser,
  }
}

test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()

  const {submitButton, fakePost, fakeUser} = renderEditor()

  const preDate = new Date().getTime()
  userEvent.click(submitButton)

  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    date: expect.any(String),
    authorId: fakeUser.id,
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)

  const postDate = new Date().getTime()
  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)

  // keep what is in the await function as slim as possible so it fails faster
  await waitFor(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
  expect(MockRedirect).toHaveBeenCalledTimes(1)
})

test('renders a error message from the server', async () => {
  const testError = 'test error'
  const {submitButton} = renderEditor()
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})

  userEvent.click(submitButton)

  const postError = await screen.findByRole('alert')
  expect(postError).toHaveTextContent(testError)
  expect(submitButton).toBeEnabled()
})
