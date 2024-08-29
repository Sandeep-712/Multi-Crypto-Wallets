/** @type {import('next').NextConfig} */


const nextConfig = {
    webpack: (config, { isServer }) => {
        config.experiments = {
            asyncWebAssembly: true,
            // syncWebAssembly: true,
            layers: true
        };

        return config;
    },
};

export default nextConfig;
