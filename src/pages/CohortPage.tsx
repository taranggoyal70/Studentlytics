import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { getLeaderboard, LeaderboardEntry } from '../services/insightsService'

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function CohortPage() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load cohort'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      entries.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.external_id.toLowerCase().includes(search.toLowerCase()) ||
          (p.major ?? '').toLowerCase().includes(search.toLowerCase())
      ),
    [entries, search]
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Cohort</h1>
        <p className="text-xl text-muted-foreground mb-10">
          Every participant on your roster, with attendance and engagement evidence where sessions have been analyzed.
        </p>

        {loading && <p className="text-muted-foreground">Loading cohort…</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-muted-foreground">
              No participants yet. Add participants from the Participants page — they will appear here with their
              attendance history once sessions are analyzed.
            </CardContent>
          </Card>
        )}

        {entries.length > 0 && (
          <>
            <div className="relative mb-8 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or major…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
                >
                  <Card
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => navigate(`/cohort/${p.external_id}`)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-semibold">
                          {initials(p.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{p.name}</p>
                          <p className="truncate text-sm text-muted-foreground">
                            {p.external_id}
                            {p.major ? ` · ${p.major}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="rounded-md bg-muted/60 p-2">
                          <p className="font-semibold">{p.attendance_rate != null ? `${p.attendance_rate}%` : '—'}</p>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                        </div>
                        <div className="rounded-md bg-muted/60 p-2">
                          <p className="font-semibold">{p.avg_engagement ?? '—'}</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                        <div className="rounded-md bg-muted/60 p-2">
                          <p className="font-semibold">{p.sessions_analyzed}</p>
                          <p className="text-xs text-muted-foreground">Sessions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
