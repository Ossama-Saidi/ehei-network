// const API_URL = 'http://localhost:3002';

// export const getImageUrl = (path: string | null | undefined): string => {
//   console.log('Original path:', path);
  
//   if (!path) {
//     const defaultUrl = `${API_URL}/uploads/banners/banner.png`;
//     console.log('Using default URL:', defaultUrl);
//     return defaultUrl;
//   }

//   // Remove any existing URL prefixes
//   const cleanPath = path.replace(/^(blob:|http:\/\/localhost:\d+)/g, '');
//   console.log('Cleaned path:', cleanPath);
  
//   // Ensure the path starts with a single slash
//   const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
//   console.log('Normalized path:', normalizedPath);
  
//   // Construct final URL
//   const finalUrl = `${API_URL}${normalizedPath}`;
//   console.log('Final URL:', finalUrl);
  
//   return finalUrl;
// };
const API_URL = 'http://localhost:3002';
const DEFAULT_BANNER = '/uploads/banners/banner.png';
// export const getImageUrl = (path: string | null | undefined): string => {
//   console.log('Original path:', path);
  
//   if (!path) {
//     const defaultUrl = `${API_URL}/uploads/banners/banner.png`;
//     console.log('Using default URL:', defaultUrl);
//     return defaultUrl;
//   }

//   // Special case: if the path already contains both backend and frontend URLs
//   if (path.includes('localhost:3002') && path.includes('localhost:3000')) {
//     // Extract just the filename/path part after all the domains
//     const parts = path.split('/');
//     const filename = parts[parts.length - 1];
//     const fixedUrl = `${API_URL}/uploads/banners/${filename}`;
//     console.log('Fixed malformed double-URL:', fixedUrl);
//     return fixedUrl;
//   }

//   // If it's already a complete URL to our backend, use it directly
//   if (path.startsWith(API_URL)) {
//     console.log('Already a complete backend URL:', path);
//     return path;
//   }

//   // Remove any URL prefixes (blob: or http://localhost:xxxx)
//   const cleanPath = path.replace(/^(blob:|https?:\/\/localhost:\d+)/g, '');
//   console.log('Cleaned path:', cleanPath);
  
//   // Handle the path based on what we have
//   if (cleanPath.startsWith('/uploads/')) {
//     // It's already a proper relative path
//     const finalUrl = `${API_URL}${cleanPath}`;
//     console.log('Final URL (uploads path):', finalUrl);
//     return finalUrl;
//   } else if (cleanPath.startsWith('/')) {
//     // It's some other path with a leading slash
//     const finalUrl = `${API_URL}${cleanPath}`;
//     console.log('Final URL (other path):', finalUrl);
//     return finalUrl;
//   } else {
//     // No leading slash, assume it's a filename only
//     const finalUrl = `${API_URL}/uploads/banners/${cleanPath}`;
//     console.log('Final URL (filename only):', finalUrl);
//     return finalUrl;
//   }
// };


export const getImageUrl = (path: string | null | undefined): string => {
  console.log('Original path:', path);
  
  if (!path) {
    return `${API_URL}${DEFAULT_BANNER}`;
  }

  // If it already has the correct API_URL, return as is
  if (path.startsWith(API_URL)) {
    return path;
  }
  
  // If it's a local path that starts with /uploads
  if (path.startsWith('/uploads/')) {
    return `${API_URL}${path}`;
  }
  
  // If it's a double URL with both localhost addresses
  if (path.includes('localhost:3002') && path.includes('localhost:3000')) {
    // Extract the filename
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return `${API_URL}/uploads/banners/${filename}`;
  }
  
  // If it starts with the frontend URL, replace it with the backend URL
  if (path.includes('localhost:3000')) {
    return path.replace('localhost:3000', 'localhost:3002');
  }
  
  // If it's just a simple filename
  if (!path.includes('/')) {
    return `${API_URL}/uploads/banners/${path}`;
  }
  
  // Default case: ensure path starts with a single slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};