import { INormalizedEmailAndFindUser } from '../interfaces'

export const normalizedEmailAndFindUser = async ({
  email,
  userModel,
}: INormalizedEmailAndFindUser) => {
  const normalizedEmail = email.toLowerCase()
  const user = await userModel.findOne({
    email: normalizedEmail,
  })

  return { user, normalizedEmail }
}
