import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {HiddenMessage} from '../hidden-message'

jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props) => (props.in ? props.children : null),
  }
})

test('Shows hidden message when toggle is clicked', () => {
  const myMessage = 'Hello world'
  render(<HiddenMessage>{myMessage}</HiddenMessage>)
  // expect myMessage not to be shown
  const toggleButton = screen.getByText(/toggle/i)
  expect(screen.queryByText(myMessage)).not.toBeInTheDocument()
  // Click the button wiht a fire event && expect myMessage to be shown
  userEvent.click(toggleButton)
  expect(screen.getByText(myMessage)).toBeInTheDocument()
  // reset it and xpect myMessage not to be shown
  userEvent.click(toggleButton)
  expect(screen.queryByText(myMessage)).not.toBeInTheDocument()
})

// the much slower way with async awaie
// tes('shows hidden message when toggle is click', aysnc () => {
//   const myMessage = 'hello world'
//   render(<HiddenMessage>{myMessage}</HiddenMessage>)
//   const toggleButton = screen.getByText(/toggle/i)
//   expect(screen.queryByText(myMessage)).not.toBeInTheDocument()
//   userEvent.click(toggleButton)
//   expect(screen.getByText(myMessage)).toBeInTheDocument()
//   userEvent.click(toggleButton)
//   await waitFor (() => expect(screen.queryByText(myMessage)).not.toBeInTheDocument())
// })
