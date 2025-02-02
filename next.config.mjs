/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Warning: This allows production builds to successfully complete even if there are ESLint errors
		ignoreDuringBuilds: true,
	  },
	images: {
		remotePatterns: [
		  {
			protocol: "https",
			hostname: "cdn.sanity.io",
			pathname: '/images/**',
		  }
		]
	  },
};

export default nextConfig;
