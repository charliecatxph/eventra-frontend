import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    devIndicators: false,
};

export default nextConfig;
