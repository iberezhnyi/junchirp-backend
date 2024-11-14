export const getCloudinaryOptions = ({
  publicId,
  folder,
}: {
  publicId: string
  folder: string
}) => ({
  folder,
  public_id: publicId,
  use_filename: true,
  unique_filename: false,
  overwrite: true,
})
