import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  FileVideo,
  ShieldCheck,
  TimerReset,
  Upload,
  Users,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { getApiEndpoint } from '../config/api'
import { getOverview, AnalyticsOverview } from '../services/insightsService'

const reportPreview = [
  { label: 'Attendance decisions', value: 'Present, absent, late, left early' },
  { label: 'Presence windows', value: 'First seen, last seen, re-entry intervals' },
  { label: 'Engagement evidence', value: 'Participation, interaction, consistency' },
  { label: 'Review controls', value: 'Manual override and audit trail' },
]

export default function DashboardPage() {
  const apiConnected = Boolean(getApiEndpoint())
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [overviewError, setOverviewError] = useState<string | null>(null)

  useEffect(() => {
    getOverview()
      .then(setOverview)
      .catch((error) => setOverviewError(error instanceof Error ? error.message : 'Failed to load overview'))
  }, [])

  const stats = [
    { label: 'Participants', value: overview ? String(overview.participants) : '—' },
    { label: 'Sessions', value: overview ? String(overview.sessions) : '—' },
    { label: 'Analyses completed', value: overview ? String(overview.analyses_completed) : '—' },
    { label: 'Attendance rate', value: overview?.attendance_rate != null ? `${overview.attendance_rate}%` : 'No data yet' },
    { label: 'Average engagement', value: overview?.average_engagement != null ? `${overview.average_engagement}` : 'No data yet' },
  ]

  return (
    <div className="min-h-screen bg-[#f4f5f1] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Operations</p>
              <h1 className="mt-3 text-4xl font-bold tracking-normal md:text-5xl">Command Center</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                The workspace for session intake, participant evidence, attendance timelines, and engagement reports.
              </p>
            </div>
            <div className={`border px-4 py-3 text-sm font-semibold ${
              apiConnected
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}>
              {apiConnected ? 'Production API connected' : 'Production API not connected'}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-slate-200 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                Organization overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overviewError && <p className="text-sm text-destructive">{overviewError}</p>}
              {stats.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 border border-slate-200 p-4">
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-slate-600">{item.value}</p>
                </div>
              ))}
              {overview && overview.sessions === 0 && (
                <p className="text-sm text-slate-500">
                  No sessions yet — upload a recording from the Sessions page to produce your first attendance report.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white shadow-none">
            <CardContent className="p-6">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Primary workflow</p>
                  <h2 className="mt-3 text-3xl font-bold">Process recordings into evidence.</h2>
                </div>
                <FileVideo className="h-8 w-8 text-slate-400" />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { step: '01', title: 'Upload', body: 'Add a meeting or room recording.' },
                  { step: '02', title: 'Analyze', body: 'Run face, audio, and timeline extraction.' },
                  { step: '03', title: 'Review', body: 'Approve decisions and export reports.' },
                ].map((item) => (
                  <div key={item.step} className="border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-semibold text-emerald-300">{item.step}</p>
                    <p className="mt-4 font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/sessions">
                  <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                    <Upload className="mr-2 h-4 w-4" />
                    Open sessions
                  </Button>
                </Link>
                <Link to="/integrations">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                    Configure intake
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Card className="border-slate-200 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TimerReset className="h-5 w-5 text-slate-700" />
                Report evidence model
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {reportPreview.map((item) => (
                <div key={item.label} className="border-l-2 border-slate-950 pl-4">
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-slate-700" />
                Product boundaries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
              <p>
                Core language is participant-first, not student-only. A class, webinar, event track, or training program is a space.
              </p>
              <p>
                Engagement scores must show evidence and confidence. They should guide review, not become a hidden judgment.
              </p>
              <p>
                Live Zoom and Meet support stays on the roadmap until the recordings workflow is dependable end to end.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
