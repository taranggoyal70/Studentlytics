import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { getSessionReport, SessionReport } from '../services/insightsService'

function formatSeconds(seconds: number | null): string {
  if (seconds == null) return '—'
  const total = Math.max(0, Math.round(seconds))
  return `${String(Math.floor(total / 3600)).padStart(2, '0')}:${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export default function AttendanceTrackingPage() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const [report, setReport] = useState<SessionReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) return
    getSessionReport(sessionId)
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load session report'))
      .finally(() => setLoading(false))
  }, [sessionId])

  const decisions = report?.decisions ?? []
  const attended = decisions.filter((d) => d.status !== 'absent' && d.status !== 'unknown')

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/sessions')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to sessions
        </Button>

        <h1 className="text-4xl font-bold mb-2">{report?.session.title ?? 'Session attendance'}</h1>
        <p className="text-xl text-muted-foreground mb-10">
          Attendance decisions and presence evidence for this session.
        </p>

        {loading && <p className="text-muted-foreground">Loading report…</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && decisions.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-muted-foreground">
              No attendance decisions yet. The analysis job for this session may still be queued or processing.
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
                    <p className="text-2xl font-bold">{decisions.filter((d) => d.returned_after_leave).length}</p>
                    <p className="text-sm text-muted-foreground">Re-entered</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Participants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {decisions.map((d) => (
                  <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{d.participant_name}</p>
                      <p className="text-xs text-muted-foreground">{d.external_id}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{d.status.replace(/_/g, ' ')}</span>
                      <span>in {formatSeconds(d.check_in_seconds)}</span>
                      <span>out {formatSeconds(d.check_out_seconds)}</span>
                      <span>{d.presence_windows.length} window{d.presence_windows.length === 1 ? '' : 's'}</span>
                      <span>engagement {d.engagement_score ?? '—'}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </motion.div>
    </div>
  )
}
