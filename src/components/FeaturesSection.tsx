import { motion } from 'framer-motion'
import { Clock, BarChart3, Brain, LayoutDashboard, TrendingUp, Bell, LogOut, Video } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const features = [
  {
    icon: Clock,
    title: 'Automatic Attendance',
    description: 'Identify enrolled participants from recordings and mark who attended without roll call, QR scans, or manual spreadsheets.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: LogOut,
    title: 'Check-In and Check-Out',
    description: 'Capture when each person first appears, when they leave, how long they stayed, and whether they left early and never returned.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Engagement Scoring',
    description: 'Score focus and participation from visual presence, speaking activity, questions, consistency, and camera-off participation.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Video,
    title: 'Classroom, Webinar, Conference',
    description: 'Use the same workflow for university classes, corporate training, workshops, meetups, and recorded online sessions.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Ask which participants were absent, who disengaged, who arrived late, and which sessions need follow-up.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Multi-Role Dashboards',
    description: 'Dedicated views for professors, trainers, organizers, administrators, and participants with permissioned data access.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Cohort and Event Trends',
    description: 'Track attendance, engagement, and drop-off patterns across courses, events, departments, or company programs.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Bell,
    title: 'Early Risk Alerts',
    description: 'Flag repeat absences, late arrivals, early departures, and low-engagement participants before problems become invisible.',
    gradient: 'from-yellow-500 to-orange-500',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for Any Learning or Event Room
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automatic attendance, engagement, and session timelines for universities, companies, webinars, and conferences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-2 hover:border-transparent relative overflow-hidden">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
                <div className="absolute inset-[2px] bg-background rounded-lg z-0" />
                
                <CardHeader className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
