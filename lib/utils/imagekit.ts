import { imageService, TransformOptions } from "./image-service";

export type IKTransformation = TransformOptions;

/**
 * @deprecated Use imageService.getImageUrl() instead
 */
export function buildImageKitUrl(src: string, transformations?: IKTransformation): string {
  return imageService.getImageUrl(src, transformations);
}
