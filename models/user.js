import { model, Schema, Types } from 'mongoose'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    hashed_password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    organization: {
      type: Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    salt: String,
  },
  { timestamps: true }
)

userSchema
  .virtual('password')
  .get(function () {
    return this._password
  })
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto.createHmac('sha256', this.salt).update(password).digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + ''
  },
}

export default model('User', userSchema)
