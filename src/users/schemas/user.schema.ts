import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ collection: 'users', timestamps: true })
export class UserModel extends Document {
  @Prop({
    required: [true, 'Name is required'],
    type: String,
  })
  userName: string

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    type: String,
  })
  email: string

  @Prop({
    type: [String],
    enum: ['Junior', 'Mentor', 'Investor', 'Partner'],
    default: ['Junior', 'Investor'],
  })
  roles: string[]

  // @Prop({
  //   type: String,
  //   enum: ['starter', 'pro', 'business'],
  //   default: 'starter',
  // })
  // subscription: string

  @Prop({
    required: [true, 'Password is required'],
    type: String,
  })
  password: string

  @Prop({
    type: String,
  })
  avatar: string

  @Prop({
    type: String,
    default: null,
  })
  access_token: string | null

  @Prop({
    type: String,
    default: null,
  })
  refresh_token: string | null

  @Prop({
    type: Boolean,
    default: false,
  })
  isConfirmed: boolean

  @Prop({
    type: Number,
    default: 0,
  })
  confirmAttempts: number

  @Prop({
    type: String,
    default: null,
  })
  confirmCode: number | null

  @Prop({
    type: Date,
    default: null,
  })
  confirmCodeExpiresAt: Date | null

  @Prop({
    type: Number,
    default: 0,
  })
  requestCodeAttempts: number
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel)
