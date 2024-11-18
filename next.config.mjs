// đảm bảo Next.js có thể xử lý và tối ưu hóa hình ảnh được lưu trữ trên Cloudinary.
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: "res.cloudinary.com",
        },
      ],
    },
  };
  
  export default nextConfig;
  