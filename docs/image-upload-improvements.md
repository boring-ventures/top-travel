# Image Upload Improvements

## Overview

This document outlines the improvements made to the image upload functionality in the CMS to ensure images are only uploaded when forms are submitted, not when selected.

## Problem

Previously, images were uploaded immediately when selected in forms, which could lead to:

- Orphaned images in storage if users didn't complete form submission
- Unnecessary storage costs
- Poor user experience if uploads failed

## Solution

### 1. Deferred Upload Implementation

Modified the `ImageUpload` component to support deferred uploads:

```typescript
interface ImageUploadProps {
  // ... existing props
  onUpload?: (file: File) => Promise<string>; // Made optional
  onFileSelect?: (file: File) => void; // New prop for deferred uploads
  deferred?: boolean; // New prop to enable deferred uploads
}
```

### 2. Updated Forms

All CMS forms with image uploads have been updated to use deferred uploads:

#### Forms Updated:

- ✅ **Packages** (`src/components/admin/forms/package-form.tsx`)
- ✅ **Destinations** (`src/components/admin/forms/destination-form.tsx`)
- ✅ **Events** (`src/components/admin/forms/event-form.tsx`)
- ✅ **Offers** (`src/components/admin/forms/offer-form.tsx`)
- ✅ **Fixed Departures** (`src/components/admin/forms/fixed-departure-form.tsx`)
- ✅ **Departments** (`src/components/admin/forms/department-form.tsx`)

#### Forms Without Image Upload:

- ❌ **Testimonials** - No image upload functionality
- ❌ **Pages** - No image upload functionality
- ❌ **Tags** - No image upload functionality
- ❌ **WhatsApp Templates** - No image upload functionality

### 3. Form Submission Flow

The new flow works as follows:

1. **User selects image**: File is stored temporarily, preview is shown
2. **User fills form**: Image remains in memory, not uploaded
3. **User submits form**:
   - Image is uploaded to storage
   - Form data is sent to API with image URL
   - Temporary file is cleared

### 4. Cleanup Utilities

Added utilities to clean up orphaned images:

#### API Endpoints:

- `DELETE /api/upload-image` - Delete specific image
- `POST /api/cleanup-images` - Clean up all orphaned images

#### Storage Functions:

- `deleteImageFromStorage()` - Delete specific image
- `cleanupOrphanedImages()` - Find and delete orphaned images

#### Admin Interface:

- `/admin/cleanup` - Web interface to trigger cleanup

## Implementation Details

### ImageUpload Component Changes

```typescript
// Before: Immediate upload
<ImageUpload
  onUpload={async (file) => uploadImage(file)}
  // ...
/>

// After: Deferred upload
<ImageUpload
  onFileSelect={(file) => setSelectedImageFile(file)}
  deferred={true}
  // ...
/>
```

### Form Submission Changes

```typescript
const handleSubmit = form.handleSubmit(async (values) => {
  let finalImageUrl = values.imageUrl;

  // Upload image if a new file was selected
  if (selectedImageFile) {
    finalImageUrl = await uploadImage(selectedImageFile, identifier);
  }

  // Send form data with final image URL
  const apiData = { ...values, imageUrl: finalImageUrl };
  // ... rest of submission logic
});
```

## Benefits

1. **No Orphaned Images**: Images are only uploaded when forms are successfully submitted
2. **Better User Experience**: Users can see image previews without waiting for uploads
3. **Reduced Storage Costs**: Eliminates unnecessary storage usage
4. **Cleanup Tools**: Admin can easily clean up any remaining orphaned images

## Usage

### For Developers

To use deferred uploads in new forms:

```typescript
const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

<ImageUpload
  value={form.watch("imageUrl")}
  onChange={(url) => form.setValue("imageUrl", url)}
  onFileSelect={(file) => setSelectedImageFile(file)}
  deferred={true}
  placeholder="Upload image"
/>
```

### For Administrators

To clean up orphaned images:

1. Navigate to `/admin/cleanup`
2. Click "Clean Up Orphaned Images"
3. Review results and any errors

## Migration Notes

- Existing forms continue to work with immediate uploads (backward compatibility)
- New forms should use deferred uploads
- Cleanup can be run periodically to remove old orphaned images

## Future Improvements

1. **Automatic Cleanup**: Schedule periodic cleanup of orphaned images
2. **Image Optimization**: Add more image processing options
3. **Batch Operations**: Support for multiple image uploads
4. **Progress Tracking**: Show upload progress for large images
