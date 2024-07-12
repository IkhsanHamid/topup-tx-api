import crypto from 'crypto'

//  encode
export const hashing = (password: string) => {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  return hash
}

// decode
export const checkPassword = (password: string, userPassword: string) => {
  const hashedPassword = hashing(password)
  const compareResult = crypto.timingSafeEqual(Buffer.from(hashedPassword, 'hex'), Buffer.from(userPassword, 'hex'))
  return compareResult
}
