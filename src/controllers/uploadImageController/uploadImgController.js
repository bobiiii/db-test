/* eslint-disable import/no-extraneous-dependencies */
const { google } = require('googleapis');
const stream = require('stream');
const multer = require('multer');
const { ErrorHandler } = require('../../utils/errorHandler');

// Setup multer memory storage with file size limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
    fieldSize: 5 * 1024 * 1024,  // 5 MB for text fields if any
  },
});

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: SCOPES,
});

const drive = google.drive({
  version: 'v3',
  auth,
});

// Function to generate nanoid dynamically
const generateNanoId = async () => {
  const { nanoid } = await import('nanoid');
  return nanoid();
};

// Upload image to drive
const uploadImageToDrive = async (dynamicParameter) => {
  const nanoid = await generateNanoId();

  if (!dynamicParameter.buffer) {
    console.error('Error: Invalid file object');
    return null;
  }

  try {
    const bufferImage = new stream.PassThrough();
    bufferImage.end(dynamicParameter.buffer);

    const { data } = await drive.files.create({
      media: {
        mimeType: dynamicParameter.mimetype,
        body: bufferImage,
      },
      requestBody: {
        name: dynamicParameter.originalname,
        parents: ['1NjYxQczvwAhf4t40G0LNvK4mozeUPEQt'],
      },
      fields: 'id, name',
    });

    return data.id;
  } catch (error) {
    console.error('Error uploading image to Google Drive:', error);
    throw new ErrorHandler('Error uploading image to Google Drive', 500);
  }
};

const updateImageOnDrive = async (fileId, updatedImage) => {
  if (!updatedImage.buffer) {
    console.error('Error: Invalid file object');
    return null;
  }
  try {
    const bufferImage = new stream.PassThrough();
    bufferImage.end(updatedImage.buffer);
    const { data } = await drive.files.update({
      fileId,
      media: {
        mimeType: updatedImage.mimetype,
        body: bufferImage,
      },
      requestBody: {
        name: updatedImage.originalname,
      },
      fields: 'id, name',
    });

    return data.id;
  } catch (error) {
    console.error('Error updating image on Google Drive:', error);
    throw new ErrorHandler('Error updating image on Google Drive', 500);
  }
};

const deleteImage = async (imageRef) => {
  try {
    await drive.files.delete({
      fileId: imageRef,
    });
  } catch (err) {
    throw new ErrorHandler('Error Deleting image on Google Drive', 500);
  }
};

const isImage = (file) => file && file.mimetype.startsWith('image/');

const uploadImageToDriveBlog = async (file, folder) => {
  if (!file?.buffer) {
    console.error('Error: Invalid image');
    throw new ErrorHandler('Error ! Invalid Image', 500);
  }
  try {
    const nanoid = await generateNanoId();
    const uniqueFileName = `${nanoid}-${file.originalname}`;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const { data } = await drive.files.create({
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
      requestBody: {
        name: uniqueFileName,
        parents: [folder],
      },
      fields: 'id',
    });

    return data.id;
  } catch (error) {
    console.error('Error uploading image to Google Drive:', error);
    throw new ErrorHandler('Error uploading image to Google Drive', 500);
  }
};

const updateImageToDriveBlog = async (fileId, file) => {
  if (!file?.buffer) {
    console.error('Error: Invalid image');
    throw new ErrorHandler('Error: Invalid image', 500);
  }

  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    await drive.files.update({
      fileId,
      media: {
        body: bufferStream,
        mimeType: file.mimetype,
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating image on Google Drive:', error);
    throw new ErrorHandler('Error updating image on Google Drive', 500);
  }
};

module.exports = {
  upload,
  uploadImageToDrive,
  updateImageOnDrive,
  deleteImage,
  isImage,
  uploadImageToDriveBlog,
  updateImageToDriveBlog,
};
