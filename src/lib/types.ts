export type CommentDTO = {
  _id: string;
  viewerId: string;
  name: string;
  text: string;
  createdAt: string;
};

export type PostDTO = {
  _id: string;
  text: string;
  textEnglish?: string;
  textTamil?: string;
  mediaUrl: string;
  mediaType: "none" | "image" | "video" | "document";
  likes: string[];
  comments: CommentDTO[];
  createdAt: string;
};

export type OrganizationDTO = {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  updatedAt: string;
};
