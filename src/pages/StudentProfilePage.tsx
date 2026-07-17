import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, GraduationCap, Users } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { getStudent } from '../services/api'
import { getLeaderboard, LeaderboardEntry } from '../services/insightsService'

interface ParticipantRecord {
  record_id: string
  student_id: string
  student_name: string
  student_email: string
  major: string | null
  department: string | null
  cohort: string | null
  photo_url: string | null
  face_enrolled: boolean
}

export default function StudentProfilePage() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [participant, setParticipant] = useState<ParticipantRecord | null>(null)
  const [stats, setStats] = useState<LeaderboardEntry | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    Promise.all([getStudent(studentId), getLeaderboard()])
      .then(([record, leaderboard]) => {
        setParticipant(record)
        setStats(leaderboard.find((e) => e.external_id === record.student_id) ?? null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load participant'))
      .finally(() => setLoading(false))
  }, [studentId])

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/cohort')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to cohort
        </Button>

        {loading && <p className="text-muted-foreground">Loading participant…</p>}
        {error && <p className="text-destructive">{error}</p>}

        {participant && (
          <>
            <div className="mb-10 flex flex-wrap items-center gap-6">
              {participant.photo_url ? (
                <img
                  src={participant.photo_url}
                  alt={participant.student_name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-bold">
                  {participant.student_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{participant.student_name}</h1>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {participant.student_id}
                  </span>
                  {participant.student_email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" /> {participant.student_email}
                    </span>
                  )}
                  {participant.major && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" /> {participant.major}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Face enrollment: {participant.face_enrolled ? 'enrolled' : participant.photo_url ? 'photo uploaded — enrolls with next analysis' : 'no photo yet'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-6">
                <p className="text-3xl font-bold">{stats?.attendance_rate != null ? `${stats.attendance_rate}%` : '—'}</p>
                <p className="mt-1 text-sm text-muted-foreground">Attendance rate</p>
              </Card>
              <Card className="p-6">
                <p className="text-3xl font-bold">{stats?.avg_engagement ?? '—'}</p>
                <p className="mt-1 text-sm text-muted-foreground">Avg engagement</p>
              </Card>
              <Card className="p-6">
                <p className="text-3xl font-bold">{stats?.sessions_attended ?? 0}/{stats?.sessions_analyzed ?? 0}</p>
                <p className="mt-1 text-sm text-muted-foreground">Sessions attended</p>
              </Card>
              <Card className="p-6">
                <p className="text-3xl font-bold">{stats?.total_questions ?? 0}</p>
                <p className="mt-1 text-sm text-muted-foreground">Questions asked</p>
              </Card>
            </div>

            {(!stats || stats.sessions_analyzed === 0) && (
              <p className="mt-6 text-sm text-muted-foreground">
                No analyzed sessions for this participant yet. Stats appear after a session recording that includes them
                is processed.
              </p>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
