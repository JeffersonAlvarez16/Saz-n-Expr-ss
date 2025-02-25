import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'example.com', // Reemplazar con los dominios de tus imágenes
      'images.unsplash.com',
      'picsum.photos'
    ],
  },
};

export default nextConfig;
