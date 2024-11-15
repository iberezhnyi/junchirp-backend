interface IGetCloudinaryOptionsParams {
  publicId: string
  folder: string
}

export const getCloudinaryOptions = ({
  publicId,
  folder,
}: IGetCloudinaryOptionsParams) => ({
  folder,
  public_id: publicId,
  use_filename: true,
  unique_filename: false,
  overwrite: true,
})
