import { Express } from 'express'
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse

export interface ISaveFileProps {
  file: Express.Multer.File | string
  userId?: string
  publicId?: string
  folder: string
}
