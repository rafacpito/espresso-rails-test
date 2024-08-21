import helpers from "../../../../app/javascript/helpers"
import "@testing-library/jest-dom"

describe('test sending development to setUrl', () => {
  it('should return http://localhost:3000', () => {
    expect(helpers.functions.setUrl('development')).toEqual('http://localhost:3000')
  })
})

describe('test sending production to setUrl', () => {
  it('should return http://localhost:3000', () => {
    expect(helpers.functions.setUrl('production')).toEqual('https://espresso-rails-test-6b9ca6b10623.herokuapp.com')
  })
})