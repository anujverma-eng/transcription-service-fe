// src/features/transcription/s3UploadApi.ts
import axios, { AxiosError } from "axios";

/**
 * Upload a file to S3 using a presigned URL.
 * 
 * @param presignedUrl The full S3 PUT URL returned by your backend
 * @param file The file (Blob) to upload
 * @param mimeType The MIME type (e.g., "audio/mpeg")
 */
export async function uploadFileToS3(
  presignedUrl: string,
  file: File,
  mimeType: string
): Promise<void> {
  try {
    const response = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": mimeType,
      },
    });
    // Typically S3 responds with 200 or 201 if successful.
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`S3 upload failed with status ${response.status}`);
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    // Check if axios error
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const s3Message = axiosError.response.data || axiosError.response.statusText;
      throw new Error(`S3 upload error: ${s3Message}`);
    } else if (axiosError.request) {
      // The request was made but no response was received
      throw new Error("S3 upload error: No response from server. Possibly a CORS issue.");
    } else {
      // Something else triggered an error
      throw new Error(`S3 upload error: ${axiosError.message}`);
    }
  }
}

export async function uploadFileToS3WithProgress(
  presignedUrl: string,
  file: File,
  mimeType: string,
  onProgress: (progress: number) => void
): Promise<void> {
  try {
    const response = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": mimeType,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress);
        }
      },
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`S3 upload failed with status ${response.status}`);
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const s3Message = axiosError.response.data || axiosError.response.statusText;
      throw new Error(`S3 upload error: ${s3Message}`);
    } else if (axiosError.request) {
      throw new Error("S3 upload error: No response from server. Possibly a CORS issue.");
    } else {
      throw new Error(`S3 upload error: ${axiosError.message}`);
    }
  }
}