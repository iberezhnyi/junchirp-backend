export const UPLOAD = {
  PROVIDERS: {
    CLOUDINARY: 'CLOUDINARY',
  },

  DEFAULT_AVATAR_FOLDER: 'avatars/default_avatars/',
  DEFAULT_AVATAR_NAME: 'default_user_avatar.png',

  AVATAR_UPLOAD_FOLDER: 'avatars/users/',
  AVATAR_MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  AVATAR_ALLOWED_FORMATS: [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp',
  ],
}
