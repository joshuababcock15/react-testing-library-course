import * as React from 'react'
import {render, screen} from '@testing-library/react'
// NOTE: for this one we're not using userEvent because
// I wanted to show you how userEvent can improve this test
// in the final lesson.
import userEvent from '@testing-library/user-event'
import {submitForm as mockSubmitForm} from '../api'
import App from '../app'

jest.mock('../api')

test('Can fill out form across mulitple pages', async () => {
  mockSubmitForm.mockResolvedValueOnce({success: true})
  const testData = {food: 'test food', drink: 'test drink'}
  render(<App />)

  userEvent.click(screen.getByText(/fill.*form/i))
  userEvent.type(await screen.findByLabelText(/food/i), testData.food)
  //userEvent.type writes text inside the input
  userEvent.click(await screen.findByText(/next/i))
  userEvent.type(await screen.findByLabelText(/drink/i), testData.drink)
  userEvent.click(await screen.findByText(/review/i))
  expect(await screen.findByLabelText(/food/i)).toHaveTextContent(testData.food)
  expect(await screen.findByLabelText(/drink/i)).toHaveTextContent(
    testData.drink,
  )

  userEvent.click(await screen.findByText(/confirm/i, {selector: 'button'}))
  expect(mockSubmitForm).toHaveBeenCalledWith(testData)
  expect(mockSubmitForm).toHaveBeenCalledTimes(1)
  userEvent.click(await screen.findByText(/home/i))
  expect(screen.getByText(/welcome home/i)).toBeInTheDocument()
})

// tests('Can fill out  form across multiple page', async () => {
//   mockSubmitForm.mockResolvedValueOnce({success: true})
//   const testData = {food: 'test food', drink: 'test drink'}
//   render(<App />)

//   fireEvent.click(screen.getByText(/fill.*form/i))

//   fireEvent.change(screen.getByLabelText(/food/i), {
//     target: {value: testData.food},
//   })
//   fireEvent.click(screen.getByText(/next/i))

//   fireEvent.change(screen.getByLabelText(/drink/i), {
//     target: {value: testData.drink},
//   })
//   fireEvent.click(screen.getByText(/review/i))

//   expect(screen.getByLabelText(/food/i)).toHaveTextContent(testData.food)
//   expect(screen.getByLabelText(/drink/i)).toHaveTextContent(testData.drink)

//   fireEvent.click(screen.getByText(/confirm/i, {selector: 'button'}))

//   expect(mockSubmitForm).toHaveBeenCalledWith(testData)
//   expect(mockSubmitForm).toHaveBeenCalledTimes(1)

//   fireEvent.click(await screen.findByText(/home/i))

//   expect(screen.getByText(/welcome home/i)).toBeInTheDocument()
// })
