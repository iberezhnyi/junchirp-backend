export const getConfirmCode = (): number =>
  Math.floor(100000 + Math.random() * 900000)
