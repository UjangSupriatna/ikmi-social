'use client'

import { motion } from 'framer-motion'
import { Users, FileText, Award, Briefcase } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProfileStatsProps {
  friendsCount: number
  postsCount: number
  achievementsCount?: number
  experiencesCount?: number
  className?: string
}

export function ProfileStats({
  friendsCount,
  postsCount,
  achievementsCount = 0,
  experiencesCount = 0,
  className,
}: ProfileStatsProps) {
  const stats = [
    {
      label: 'Teman',
      value: friendsCount,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Posts',
      value: postsCount,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Pengalaman',
      value: experiencesCount,
      icon: Briefcase,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Pencapaian',
      value: achievementsCount,
      icon: Award,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className={cn('grid grid-cols-4 gap-1.5 sm:gap-3', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-2 sm:p-3">
              <div className="flex flex-col items-center gap-0.5 sm:gap-1.5 text-center">
                <div className={cn('p-1.5 sm:p-2 rounded-lg', stat.bgColor)}>
                  <stat.icon className={cn('size-4 sm:size-5', stat.color)} />
                </div>
                <div>
                  <p className="text-sm sm:text-xl font-bold">{stat.value}</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
