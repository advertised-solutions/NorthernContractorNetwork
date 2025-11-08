import { ref, uploadBytesResumable, getDownloadURL, deleteObject, UploadTask, FirebaseStorage } from 'firebase/storage';
import { storage } from './firebase';

// Ensure we're on client-side
const getStorageInstance = (): FirebaseStorage => {
  if (typeof window === 'undefined' || !storage) {
    throw new Error('Firebase Storage is only available on the client-side');
  }
  return storage;
};

export type UploadProgress = (progress: number) => void;

/**
 * Upload a file to Firebase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., 'users/userId/profile.jpg')
 * @param onProgress - Optional progress callback
 * @returns Promise with download URL
 */
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: UploadProgress
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageInstance = getStorageInstance();
    const storageRef = ref(storageInstance, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Upload multiple files
 * @param files - Array of files to upload
 * @param basePath - Base storage path
 * @param onProgress - Optional progress callback for overall progress
 * @returns Promise with array of download URLs
 */
export const uploadMultipleFiles = async (
  files: File[],
  basePath: string,
  onProgress?: UploadProgress
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${index}.${fileExtension}`;
    const path = `${basePath}/${fileName}`;
    return uploadFile(file, path);
  });

  // Track overall progress
  if (onProgress) {
    let completed = 0;
    uploadPromises.forEach((promise) => {
      promise.then(() => {
        completed++;
        onProgress((completed / files.length) * 100);
      });
    });
  }

  return Promise.all(uploadPromises);
};

/**
 * Delete a file from Firebase Storage
 * @param path - Storage path to delete
 */
export const deleteFile = async (path: string): Promise<void> => {
  const storageInstance = getStorageInstance();
  const storageRef = ref(storageInstance, path);
  await deleteObject(storageRef);
};

/**
 * Delete multiple files
 * @param paths - Array of storage paths to delete
 */
export const deleteMultipleFiles = async (paths: string[]): Promise<void> => {
  await Promise.all(paths.map((path) => deleteFile(path)));
};

/**
 * Get storage path for user profile image
 */
export const getUserProfileImagePath = (userId: string, filename: string): string => {
  return `users/${userId}/profile/${filename}`;
};

/**
 * Get storage path for listing images
 */
export const getListingImagePath = (listingId: string, filename: string): string => {
  return `listings/${listingId}/images/${filename}`;
};

/**
 * Get storage path for listing gallery
 */
export const getListingGalleryPath = (listingId: string, filename: string): string => {
  return `listings/${listingId}/gallery/${filename}`;
};

