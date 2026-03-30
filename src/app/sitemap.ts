import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ikmi-social.vercel.app'

  // Get all public data for sitemap
  const [users, groups, events] = await Promise.all([
    // Get all users
    db.user.findMany({
      select: {
        id: true,
        username: true,
        updatedAt: true,
      },
    }),
    // Get all public groups
    db.group.findMany({
      where: {
        privacy: 'public',
      },
      select: {
        id: true,
        updatedAt: true,
      },
    }),
    // Get all upcoming/public events
    db.event.findMany({
      where: {
        status: { in: ['upcoming', 'ongoing'] },
      },
      select: {
        id: true,
        updatedAt: true,
      },
    }),
  ])

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/?view=about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/?view=help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/?view=privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/?view=terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // User profile pages
  const userPages: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${baseUrl}/?view=profile&userId=${user.id}`,
    lastModified: user.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Group pages
  const groupPages: MetadataRoute.Sitemap = groups.map((group) => ({
    url: `${baseUrl}/?view=groups&groupId=${group.id}`,
    lastModified: group.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Event pages
  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/?view=events&eventId=${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...userPages, ...groupPages, ...eventPages]
}
