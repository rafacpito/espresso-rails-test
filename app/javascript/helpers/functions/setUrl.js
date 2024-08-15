const setUrl = (env) => {
  if (env == 'production') {
    return 'https://espresso-rails-test-6b9ca6b10623.herokuapp.com'
  }

  return 'http://localhost:3000'
}

export default setUrl