/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Override the default webpack configuration
    turbopack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },
};

if (process.env.NODE_ENV === 'development') {  
    nextConfig.experimental = {  
        serverActions: {  
            allowedOrigins: ['localhost:3000'],  
        },  
    };  
}

module.exports = nextConfig
