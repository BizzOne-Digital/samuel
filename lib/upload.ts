import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { generateUniqueFilename, sanitizeFilename } from './utils';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function ensureUploadDir(subfolder?: string): Promise<void> {
  const targetDir = subfolder ? path.join(UPLOAD_DIR, subfolder) : UPLOAD_DIR;
  
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }
}

export async function uploadImage(
  file: File,
  subfolder: string = 'general'
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`,
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Ensure upload directory exists
    await ensureUploadDir(subfolder);

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const filepath = path.join(UPLOAD_DIR, subfolder, filename);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file
    await writeFile(filepath, buffer);

    // Return relative URL
    const url = `/uploads/${subfolder}/${filename}`;

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'Failed to upload file',
    };
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    if (!url || !url.startsWith('/uploads/')) {
      return false;
    }

    const filepath = path.join(process.cwd(), 'public', url);
    
    if (existsSync(filepath)) {
      await unlink(filepath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: JPG, PNG, WebP, AVIF`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}
