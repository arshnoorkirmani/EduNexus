/**
 * Production-Ready ImageKit Service Class
 * Handles optimized image generation, transformation deduplication, and responsive configurations.
 */

// Base Config
const BASE_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

export type TransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "jpg" | "png" | "avif";
  crop?: "maintain_ratio" | "force" | "at_max" | "at_least" | "extract";
  focus?: "auto" | "face" | "center" | "top" | "left" | "right" | "bottom";
  radius?: number | "max";
  blur?: number;
  grayscale?: boolean;
};

export type ResponsiveImageSet = {
  small: string;
  medium: string;
  large: string;
};

class ImageService {
  private static instance: ImageService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = BASE_URL;
  }

  public static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  /* -------------------------------------------------------------------------- */
  /* Utility Methods                                                            */
  /* -------------------------------------------------------------------------- */

  /**
   * Checks if an incoming string is already a fully qualified ImageKit URL.
   */
  public isFullUrl(src: string): boolean {
    if (!src) return false;
    return src.startsWith("http://") || src.startsWith("https://");
  }

  /**
   * Checks if a URL string already explicitly contains ImageKit transition parameters ('tr=')
   */
  public hasTransformation(src: string): boolean {
    if (!src) return false;
    try {
      const url = new URL(src);
      return url.searchParams.has("tr") || src.includes("/tr:");
    } catch {
      return src.includes("tr=") || src.includes("/tr:");
    }
  }

  /**
   * Ensures the path safely binds against the configured base endpoint.
   */
  public normalizePath(src: string): string {
    if (!src) return "";
    if (this.isFullUrl(src)) return src;
    
    // Join safely removing double slashes
    return `${this.baseUrl.replace(/\/$/, "")}/${src.replace(/^\//, "")}`;
  }

  /**
   * Maps typed configuration options into a raw ImageKit string.
   */
  public buildTransformationString(options?: TransformOptions): string {
    if (!options) return "";

    const trStr: string[] = [];

    if (options.width) trStr.push(`w-${options.width}`);
    if (options.height) trStr.push(`h-${options.height}`);
    if (options.quality) trStr.push(`q-${options.quality}`);
    if (options.format) trStr.push(`f-${options.format}`);
    if (options.blur) trStr.push(`bl-${options.blur}`);
    if (options.grayscale) trStr.push(`e-grayscale`);

    if (options.radius !== undefined) {
      trStr.push(options.radius === "max" ? "r-max" : `r-${options.radius}`);
    }

    if (options.crop) {
      const cmMap: Record<string, string> = {
        maintain_ratio: "c-maintain_ratio",
        force: "c-force",
        at_max: "c-at_max",
        at_least: "c-at_least",
        extract: "cm-extract",
      };
      if (cmMap[options.crop]) trStr.push(cmMap[options.crop]);
    }

    if (options.focus) {
      trStr.push(`fo-${options.focus}`);
    }

    return trStr.join(",");
  }

  /* -------------------------------------------------------------------------- */
  /* Core Universal Resolver                                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Single source of truth. Validates the incoming path, strips duplicates, 
   * and mounts the new transformation configurations cleanly.
   */
  public getImageUrl(src: string | null | undefined, options?: TransformOptions): string {
    if (!src) return this.getDefaultProfileImage();

    const normalizedUrlStr = this.normalizePath(src);
    const trString = this.buildTransformationString(options);

    // If there's no transformation string to apply, we return the normalized source.
    if (!trString) return normalizedUrlStr;

    // Handle Fully Qualified URLs (ImageKit SDK convention uses either path (/tr:w-300/) or query params (?tr=w-300))
    try {
      const urlObj = new URL(normalizedUrlStr);

      // Only attempt to mutate parameters on authorized endpoints to avoid disrupting external domains
      if (this.baseUrl && !urlObj.origin.includes(new URL(this.baseUrl).origin)) {
          return normalizedUrlStr;
      }

      // If the URL already manually possessed a transformation, we overwrite it.
      urlObj.searchParams.set("tr", trString);
      return urlObj.toString();
    } catch {
      // Fallback for paths without origins
      return `${this.baseUrl}/tr:${trString}/${src.replace(/^\//, "")}`;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Presentation Helpers                                                       */
  /* -------------------------------------------------------------------------- */

  /** Default optimized wrapper */
  public getOptimizedImage(src: string): string {
    return this.getImageUrl(src, { format: "auto", quality: 80 });
  }

  /** Small tables, lists (~150px) */
  public getThumbnail(src: string): string {
    return this.getImageUrl(src, { width: 150, quality: 80, format: "auto" });
  }

  /** Medium UI cards (~400px) */
  public getCardImage(src: string): string {
    return this.getImageUrl(src, { width: 400, quality: 85, format: "auto" });
  }

  /** Large preview / modals (~1200px) */
  public getFullImage(src: string): string {
    return this.getImageUrl(src, { width: 1200, quality: 90, format: "auto" });
  }

  /** Precise 1:1 Avatar cropping targeting the subject's face */
  public getAvatar(src: string, size: number = 200): string {
    return this.getImageUrl(src, {
      width: size,
      height: size,
      quality: 85,
      crop: "extract",
      focus: "face",
      format: "auto",
    });
  }

  /** Automatically returns default fallback if null, else Avatar crop */
  public getProfileImage(src?: string | null, size: number = 200): string {
    if (!src) return this.getDefaultProfileImage();
    return this.getAvatar(src, size);
  }

  /** Standard fallback */
  public getDefaultProfileImage(): string {
    // Return a beautiful low-poly placeholder or initials generator
    // Often services like ui-avatars provide immediate fallback value.
    // For now we could return a 1x1 transparent dot or a local placeholder route
    return "/avatar-placeholder.png"; 
  }

  /** Tiny heavily-blurred representation */
  public getBlurImage(src: string): string {
    return this.getImageUrl(src, { quality: 20, blur: 10, format: "auto" });
  }

  /** Dynamic multiple viewport fetching */
  public getResponsiveImage(src: string): ResponsiveImageSet {
    return {
      small: this.getImageUrl(src, { width: 300, quality: 80, format: "auto" }),
      medium: this.getImageUrl(src, { width: 800, quality: 85, format: "auto" }),
      large: this.getImageUrl(src, { width: 1600, quality: 90, format: "auto" }),
    };
  }

  /** Naked unmodified original bytes */
  public getDownloadUrl(src: string): string {
    const raw = this.normalizePath(src);
    try {
      const urlObj = new URL(raw);
      urlObj.searchParams.delete("tr");
      return urlObj.toString();
    } catch {
      return raw.replace(/\/tr:([^/]+)\//, "/"); // regex strip path-based parameters
    }
  }

  /** Direct injection utility passing raw SDK options directly */
  public getTransformationUrl(src: string, customOptions: TransformOptions): string {
    return this.getImageUrl(src, customOptions);
  }
}

// Export singleton instance natively
export const imageService = ImageService.getInstance();
