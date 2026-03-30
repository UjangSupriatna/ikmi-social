import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ikmi-social.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/?view=messages',
          '/?view=settings',
          '/?view=notifications',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
