import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, XCircle, Clock, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  listSessions,
  getSessionReport,
  SessionSummary,
  AttendanceDecision,
} from '../services/insightsService'

function formatSeconds(seconds: number | null): string {
  if (seconds == null) return '—'
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const STATUS_STYLES: Record<string, string> = {
  present: 'bg-green-100 text-green-800',
  camera_off_present: 'bg-emerald-50 text-emerald-700',
  late: 'bg-yellow-100 text-yellow-800',
  left_early: 'bg-amber-100 text-amber-800',
  absent: 'bg-red-100 text-red-800',
  unknown: 'bg-slate-100 text-slate-600',
}

const STATUS_LABELS: Record<string, string> = {
  present: 'Present',
  camera_off_present: 'Present (camera off)',
  late: 'Late',
  left_early: 'Left early',
  absent: 'Absent',
  unknown: 'Unknown',
}

export default function AttendancePage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [decisions, setDecisions] = useState<AttendanceDecision[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [reportLoading, setReportLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listSessions()
      .then((data) => {
        setSessions(data)
        const analyzed = data.find((s) => s.latest_job_status === 'completed')
        if (analyzed) setSelectedId(analyzed.id)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load sessions'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setReportLoading(true)
    getSessionReport(selectedId)
      .then((report) => setDecisions(report.decisions))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load report'))
      .finally(() => setReportLoading(false))
  }, [selectedId])

  const filtered = useMemo(
    () =>
      decisions.filter(
        (d) =>
          d.participant_name.toLowerCase().includes(search.toLowerCase()) ||
          d.external_id.toLowerCase().includes(search.toLowerCase())
      ),
    [decisions, search]
  )

  const attended = decisions.filter((d) => d.status !== 'absent' && d.status !== 'unknown')

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Attendance</h1>
        <p className="text-xl text-muted-foreground mb-10">
          Attendance decisions and presence evidence per session, produced by recording analysis.
        </p>

        {loading && <p className="text-muted-foreground">Loading sessions…</p>}
        {error && <p className="text-destructive mb-6">{error}</p>}

        {!loading && sessions.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-muted-foreground">
              No sessions yet. Upload a session recording to generate attendance decisions.
            </CardContent>
          </Card>
        )}

        {sessions.length > 0 && (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <select
                className="rounded-md border bg-background px-3 py-2 text-sm"
                value={selectedId ?? ''}
                onChange={(e) => setSelectedId(e.target.value || null)}
              >
                <option value="">Select a session…</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                    {s.latest_job_status ? ` (${s.latest_job_status})` : ' (not analyzed)'}
                  </option>
                ))}
              </select>
              <div className="relative ml-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search participants…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>

            {selectedId == null && (
              <Card>
                <CardContent className="pt-6 text-muted-foreground">
                  Select a session to view its attendance report.
                </CardContent>
              </Card>
            )}

            {selectedId != null && !reportLoading && decisions.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-muted-foreground">
                  No attendance decisions for this session yet — the analysis may still be queued or processing.
                </CardContent>
              </Card>
            )}

            {decisions.length > 0 && (
              <>
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                  <Card>
                    <CardContent className="pt-6 flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{attended.length}</p>
                        <p className="text-sm text-muted-foreground">Attended</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="text-2xl font-bold">{decisions.length - attended.length}</p>
                        <p className="text-sm text-muted-foreground">Absent</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 flex items-center gap-3">
                      <Clock className="h-8 w-8 text-amber-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {decisions.filter((d) => d.left_early || d.returned_after_leave).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Left early / re-entered</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance decisions</CardTitle>
                    <CardDescription>
                      Check-in and check-out derive from the first and last presence window; re-entries are preserved.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="py-2 pr-4">Participant</th>
                          <th className="py-2 pr-4">Decision</th>
                          <th className="py-2 pr-4">Check-in</th>
                          <th className="py-2 pr-4">Check-out</th>
                          <th className="py-2 pr-4">Visible time</th>
                          <th className="py-2 pr-4">Presence windows</th>
                          <th className="py-2 pr-4">Words</th>
                          <th className="py-2">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((d) => (
                          <tr key={d.id} className="border-b last:border-0">
                            <td className="py-3 pr-4">
                              <p className="font-medium">{d.participant_name}</p>
                              <p className="text-xs text-muted-foreground">{d.external_id}</p>
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[d.status] ?? STATUS_STYLES.unknown}`}>
                                {STATUS_LABELS[d.status] ?? d.status}
                              </span>
                            </td>
                            <td className="py-3 pr-4">{formatSeconds(d.check_in_seconds)}</td>
                            <td className="py-3 pr-4">{formatSeconds(d.check_out_seconds)}</td>
                            <td className="py-3 pr-4">{formatSeconds(d.duration_present_seconds)}</td>
                            <td className="py-3 pr-4">
                              {d.presence_windows.length}
                              {d.returned_after_leave && (
                                <span className="ml-1 text-xs text-amber-600">(re-entered)</span>
                              )}
                            </td>
                            <td className="py-3 pr-4">{d.word_count}</td>
                            <td className="py-3">{d.engagement_score ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
