
export interface ImageState {
  original: string | null;
  edited: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface EditRequest {
  image: string; // Base64
  prompt: string;
  mimeType: string;
}
