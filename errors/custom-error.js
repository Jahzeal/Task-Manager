

class CustomerApiError extends Error{
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

const createCustomError = (msg, statusCode) => {
  return new CustomerApiError(msg,statusCode)
} 

module.exports = {createCustomError,CustomerApiError}