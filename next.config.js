/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Override the default webpack configuration
    webpack: (config) => {
        // See https://webpack.js.org/configuration/resolve/#resolvealias
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
