import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const cropAndResizeImage = async (inputPath, outputPath) => {
  try {
    // Target ratio: 450x350 (approximately 1.286:1)
    const targetWidth = 450;
    const targetHeight = 350;

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;

    // Calculate crop dimensions to maintain aspect ratio
    const aspectRatio = targetWidth / targetHeight;
    let cropWidth = width;
    let cropHeight = height;
    let left = 0;
    let top = 0;

    if (width / height > aspectRatio) {
      // Image is wider than target ratio
      cropWidth = Math.round(height * aspectRatio);
      left = Math.round((width - cropWidth) / 2);
    } else {
      // Image is taller than target ratio
      cropHeight = Math.round(width / aspectRatio);
      top = Math.round((height - cropHeight) / 2);
    }

    // Crop and resize image
    await sharp(inputPath)
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(inputPath);

    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

