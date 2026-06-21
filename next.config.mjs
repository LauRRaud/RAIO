import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 92]
  },
  typedRoutes: true
};

export default withPayload(nextConfig);
