import { Injectable, NotFoundException } from '@nestjs/common'
import { Express } from 'express'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@/common/configs/config.service'
import { UploadService } from '@/common/upload/upload.service'
import { UserModel } from '@/users/schemas'
import { IUpdateUser, ICreateUser, IUserResponse } from '@/users/interfaces'
import { UPLOAD } from '@/common/configs/upload'

@Injectable()
export class UsersService {
  constructor(
    // @Inject(forwardRef(() => TokensService))
    // private readonly tokensService: TokensService,
    private readonly configService: ConfigService,
    private readonly uploadService: UploadService,

    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  //* CURRENT-USER
  async getCurrentUser(user: UserModel): Promise<IUserResponse> {
    return {
      message: 'Profile fetched successfully',
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        // subscription: user.subscription,
        // role: user.roles[0],
      },
    }
  }

  //* UPLOAD AVATAR
  async uploadUserAvatar({
    user,
    file,
  }: {
    user: UserModel
    file: Express.Multer.File
  }): Promise<IUserResponse> {
    // const userId = user._id as string

    if (user.avatar !== this.configService.defaultAvatarUrl) {
      const oldPublicId = this.uploadService.extractPublicId(user.avatar)

      await this.uploadService.deleteFile(oldPublicId)
    }

    const avatarUrl = await this.uploadService.saveFile({
      file,
      userId: user.id,
      folder: UPLOAD.AVATAR_UPLOAD_FOLDER,
    })

    user.avatar = avatarUrl

    await user.save()

    return {
      message: 'Avatar uploaded successfully',
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
      },
    }
  }

  //* DELETE AVATAR
  async deleteUserAvatar(user: UserModel): Promise<IUserResponse> {
    if (user.avatar === this.configService.defaultAvatarUrl) {
      throw new NotFoundException('User has no avatar')
    }

    const publicId = this.uploadService.extractPublicId(user.avatar)

    await this.uploadService.deleteFile(publicId)

    user.avatar = this.configService.defaultAvatarUrl

    await user.save()

    return {
      message: 'Avatar successfully deleted',
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
      },
    }
  }

  // async moveAvatar(fileName: string): Promise<string> {
  //   const tempFilePath = path.join(this.configService.tempFolderPath, fileName)
  //   const finalFilePath = path.join(
  //     this.configService.uploadAvatarPath,
  //     fileName,
  //   )

  //   if (!fs.existsSync(tempFilePath))
  //     throw new NotFoundException('File not found in temporary storage')

  //   fs.renameSync(tempFilePath, finalFilePath)

  //   return finalFilePath
  // }

  async updateUser({
    userId,
    updateUserDto,
  }: IUpdateUser): Promise<IUserResponse> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec()

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    return {
      message: 'Update successful',
      user: {
        id: updatedUser.id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        // subscription: updatedUser.subscription,
        // role: updatedUser.roles[0],
      },
    }
  }

  async deleteUser(user: UserModel): Promise<IUserResponse> {
    const result = await this.userModel.findByIdAndDelete(user._id).exec()
    if (!result) {
      throw new NotFoundException(`User with ID ${user._id} not found`)
    }

    return {
      message: `User ${user.email} deleted successfully`,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        // subscription: user.subscription,
        // role: user.roles[0],
      },
    }
  }

  // * Internal methods
  async createUser(newUser: ICreateUser): Promise<UserModel> {
    const user = await this.userModel.create(newUser)

    return user
  }

  async findAll(): Promise<UserModel[]> {
    return await this.userModel.find().exec()
  }

  async findOneById(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async findOneByEmail(email: string): Promise<UserModel | null> {
    return await this.userModel.findOne({ email }).exec()
  }

  async findOneByEmailAndUpdate(
    email: string,
    updateFields: any,
  ): Promise<any> {
    const user = await this.userModel
      .findOneAndUpdate({ email }, updateFields)
      .exec()

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`)
    }

    return user
  }

  async findOneByIdAndUpdate(id: string, updateFields: any): Promise<any> {
    const user = await this.userModel.findByIdAndUpdate(id, updateFields).exec()

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`)
    }

    return user
  }
}
