export const getConfirmExpiresAtDate = (): Date =>
  new Date(Date.now() + 10 * 60 * 1000) //* 10 minutes from the current time
