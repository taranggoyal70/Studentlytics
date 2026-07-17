import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/react'
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileVideo,
  Gauge,
  LockKeyhole,
  Radio,
  ScanFace,
  ShieldCheck,
  TimerReset,
  Upload,
  Users,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { getClerkRole, getDisplayName } from '../auth/clerk'
import { getApiEndpoint } from '../config/api'

const productSignals = [
  { label: 'First seen', value: '09:03:12' },
  { label: 'Last seen', value: '10:41:08' },
  { label: 'Visible time', value: '88 min' },
  { label: 'Questions', value: '3' },
]

const workflow = [
  {
    title: 'Upload a recording',
    body: 'Use a classroom, webinar, Zoom, Meet, training, or conference export.',
    icon: FileVideo,
  },
  {
    title: 'Match the roster',
    body: 'Compare consented participant profiles against video and audio evidence.',
    icon: ScanFace,
  },
  {
    title: 'Review evidence',
    body: 'See attendance decisions, presence windows, early leaves, and engagement signals.',
    icon: ClipboardCheck,
  },
]

const previewRows = [
  { name: 'Participant A', decision: 'Present', time: '09:03-10:41', signal: 'Engaged', tone: 'emerald' },
  { name: 'Participant B', decision: 'Left early', time: '09:02-09:37', signal: 'Needs review', tone: 'amber' },
  { name: 'Participant C', decision: 'Camera-off present', time: '09:11-10:46', signal: 'Spoke 420 words', tone: 'blue' },
]

function StatusPill({ active, children }: { active: boolean; children: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
      active
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-amber-200 bg-amber-50 text-amber-800'
    }`}>
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {children}
    </span>
  )
}

function PublicHome() {
  return (
    <div className="bg-[#f7f8f4] text-slate-950">
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src="/classroom-hero.png"
          alt="Classroom session being reviewed for attendance and engagement"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/62 to-slate-950/12" />
        <div className="relative z-10 flex min-h-[88vh] items-center">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl text-white"
            >
              <div className="mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold backdrop-blur">
                <Radio className="h-4 w-4 text-emerald-300" />
                Recordings first. Live adapters next.
              </div>
              <h1 className="max-w-2xl text-5xl font-bold leading-[0.98] tracking-normal md:text-7xl">
                Presence evidence for every room and call.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Studentlytics turns recordings into attendance decisions, check-in/out timelines, early-leave flags, and explainable engagement signals for universities, companies, webinars, and events.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login?role=teacher">
                  <Button size="lg" className="h-12 bg-emerald-400 px-6 text-slate-950 hover:bg-emerald-300">
                    Open organizer console
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login?role=student">
                  <Button size="lg" variant="outline" className="h-12 border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white">
                    Participant portal
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container mx-auto grid gap-0 px-4 py-8 md:grid-cols-4">
          {productSignals.map((signal) => (
            <div key={signal.label} className="border-slate-200 py-4 md:border-r md:px-6 last:border-r-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{signal.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{signal.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">The actual workflow</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-normal">From recording to evidence-backed report.</h2>
          </div>
          <p className="max-w-md text-slate-600">
            The product is not a course catalog. It is an evidence layer for attendance, presence, and participation.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {workflow.map((step) => (
            <Card key={step.title} className="border-slate-200 bg-white shadow-none">
              <CardHeader>
                <div className="mb-4 flex h-11 w-11 items-center justify-center border border-slate-200 bg-[#f7f8f4] text-slate-900">
                  <step.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function OperatorHome() {
  const { user } = useUser()
  const role = getClerkRole(user)
  const displayName = getDisplayName(user)
  const apiEndpoint = getApiEndpoint()
  const apiConnected = Boolean(apiEndpoint)
  const isStaff = role === 'teacher' || role === 'admin'

  return (
    <div className="min-h-screen bg-[#f4f5f1] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {isStaff ? 'Organizer workspace' : 'Participant workspace'}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-normal md:text-5xl">
                {isStaff ? 'Command center' : 'My presence record'}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Welcome, {displayName}. This workspace is now shaped around sessions, people, evidence, and reports.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill active>Clerk auth connected</StatusPill>
              <StatusPill active={apiConnected}>{apiConnected ? 'API connected' : 'API endpoint missing'}</StatusPill>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white shadow-none">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Next setup step</p>
                  <h2 className="mt-4 text-3xl font-bold leading-tight">
                    Connect the backend API before treating reports as live.
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    The interface is ready for real data, but production still needs the deployed API endpoint, database, and customer-controlled processing runtime.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link to="/integrations">
                      <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                        Review integrations
                      </Button>
                    </Link>
                    <Link to="/sessions">
                      <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                        Open sessions
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { label: 'Authentication', value: 'Connected', icon: LockKeyhole, good: true },
                      { label: 'Backend API', value: apiConnected ? 'Connected' : 'Needs VITE_API_ENDPOINT', icon: Activity, good: apiConnected },
                      { label: 'Roster source', value: 'Needs database', icon: Users, good: false },
                      { label: 'Reports', value: 'Waiting on processed recordings', icon: Gauge, good: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between border border-white/10 bg-white/[0.04] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-slate-300" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <span className={item.good ? 'text-sm text-emerald-300' : 'text-sm text-amber-300'}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TimerReset className="h-5 w-5 text-emerald-700" />
                Presence preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {previewRows.map((row) => (
                <div key={row.name} className="grid grid-cols-[1fr_auto] gap-3 border border-slate-200 p-3">
                  <div>
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-sm text-slate-500">{row.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{row.decision}</p>
                    <p className={`text-xs ${
                      row.tone === 'emerald' ? 'text-emerald-700' : row.tone === 'amber' ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                      {row.signal}
                    </p>
                  </div>
                </div>
              ))}
              <p className="text-xs leading-5 text-slate-500">
                Preview only until the production API and database are connected.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-4">
          {[
            { label: 'Sessions', value: 'Recordings and live rooms', icon: CalendarClock, href: '/sessions' },
            { label: 'People', value: 'Roster and face enrollment', icon: Users, href: '/students' },
            { label: 'Attendance', value: 'Check-in/out timelines', icon: CheckCircle2, href: '/attendance' },
            { label: 'Reports', value: 'Engagement and evidence', icon: ShieldCheck, href: '/analytics' },
          ].map((item) => (
            <Link key={item.label} to={item.href}>
              <Card className="h-full border-slate-200 bg-white shadow-none transition-colors hover:border-slate-400">
                <CardContent className="p-5">
                  <item.icon className="mb-5 h-5 w-5 text-slate-700" />
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-5 border-slate-200 bg-white shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">Operational workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {workflow.map((step) => (
                <div key={step.title} className="border-l-2 border-slate-900 pl-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center bg-[#f4f5f1] text-slate-900">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{step.body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {isStaff && (
          <div className="mt-5">
            <Link to="/sessions">
              <Button className="h-12 bg-slate-950 px-6 text-white hover:bg-slate-800">
                <Upload className="mr-2 h-4 w-4" />
                Start with a recording
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default function HomePage() {
  const { isSignedIn } = useAuth()

  return isSignedIn ? <OperatorHome /> : <PublicHome />
}
