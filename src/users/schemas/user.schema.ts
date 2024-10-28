import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

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
    enum: ['user', 'admin'],
    default: ['user'],
  })
  roles: string[]

  @Prop({
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  })
  subscription: string

  @Prop({
    required: [true, 'Password is required'],
    type: String,
  })
  password: string

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
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel)
