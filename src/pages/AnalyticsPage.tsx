import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Calendar, Award, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getOverview, getLeaderboard, AnalyticsOverview, LeaderboardEntry } from '../services/insightsService'

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getOverview(), getLeaderboard()])
      .then(([o, l]) => {
        setOverview(o)
        setEntries(l)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const analyzed = entries.filter((e) => e.avg_engagement != null)
  const engagementChart = analyzed.slice(0, 12).map((e) => ({
    name: e.name.split(' ')[0],
    engagement: e.avg_engagement,
    attendance: e.attendance_rate,
  }))

  const statCards = [
    { label: 'Participants', value: overview?.participants ?? '—', icon: Users },
    { label: 'Sessions', value: overview?.sessions ?? '—', icon: Calendar },
    {
      label: 'Attendance rate',
      value: overview?.attendance_rate != null ? `${overview.attendance_rate}%` : 'No data',
      icon: TrendingUp,
    },
    {
      label: 'Avg engagement',
      value: overview?.average_engagement != null ? overview.average_engagement : 'No data',
      icon: Award,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-xl text-muted-foreground mb-10">
          Attendance and engagement evidence from analyzed session recordings.
        </p>

        {loading && <p className="text-muted-foreground">Loading analytics…</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid gap-4 md:grid-cols-4 mb-10">
              {statCards.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {analyzed.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-muted-foreground">
                  No analysis results yet. Upload a session recording from the Sessions page — attendance decisions,
                  presence windows, and engagement evidence will appear here once the analysis job completes.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Engagement by participant
                  </CardTitle>
                  <CardDescription>Average engagement score and attendance rate across analyzed sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={engagementChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="engagement" name="Engagement" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="attendance" name="Attendance %" fill="#64748b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
