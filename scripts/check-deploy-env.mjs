if (process.env.VERCEL === '1') {
  const value = process.env.VITE_API_URL;
  if (!value) {
    console.error('Missing required Vercel environment variable: VITE_API_URL');
    process.exit(1);
  }
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') throw new Error('not HTTPS');
  } catch {
    console.error('VITE_API_URL must be a valid HTTPS URL ending in /api/v1.');
    process.exit(1);
  }
  if (!value.replace(/\/$/, '').endsWith('/api/v1')) {
    console.error('VITE_API_URL must end in /api/v1.');
    process.exit(1);
  }
}
