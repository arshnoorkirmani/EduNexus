/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

export enum MediaProvider {
  IMAGEKIT = "imagekit",
}

export enum MediaType {
  IMAGE = "image",
  PDF = "pdf",
  OTHER = "other",
}

export enum MediaStatus {
  TEMPORARY = "temporary", // uploaded but not yet attached to any entity
  UPLOADED = "uploaded", // confirmed & linked
  REPLACED = "replaced", // superseded by a newer file
  DELETED = "deleted", // removed from storage
}

export enum MediaVisibility {
  INSTITUTE = "institute",
  STUDENT = "student",
  TEACHER = "teacher",
  USER = "user",
  PUBLIC = "public",
  ADMIN = "admin",
}

export enum OwnerEntity {
  STUDENT = "student",
  TEACHER = "teacher",
  INSTITUTE = "institute",
}

/* -------------------------------------------------------------------------- */
/* Interfaces                                                                 */
/* -------------------------------------------------------------------------- */

export interface MediaOwner {
  entity: OwnerEntity | string;
  entityId: string;
  field: string;
}

export interface IMedia {
  _id: string;
  provider: MediaProvider;
  providerFileId: string;
  url: string;
  thumbnailUrl?: string;
  name: string;
  mimeType: string;
  size: number;
  type: MediaType;
  owner: MediaOwner;
  visibility: MediaVisibility;
  status: MediaStatus;
  uploadedBy?: {
    institute_name?: string;
    institute_code?: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Payload Types                                                              */
/* -------------------------------------------------------------------------- */

export interface CreateMediaPayload {
  provider: MediaProvider | "imagekit";
  providerFileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  size: number;
  type: MediaType | "image" | "pdf" | "other";
  owner: {
    entity: OwnerEntity | string;
    entityId: string;
    field: string;
  };
  visibility?:
    | MediaVisibility
    | "institute"
    | "student"
    | "teacher"
    | "user"
    | "public"
    | "admin";
  status?: MediaStatus | "temporary" | "uploaded";
  uploadedBy?: {
    institute_name: string;
    institute_code?: string;
    name: string;
    email: string;
  };
}

export interface UpdateMediaPayload {
  providerFileId: string;
  owner?: Partial<MediaOwner>;
  visibility?: MediaVisibility;
  status?: MediaStatus;
}
