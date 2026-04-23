'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  StarIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

// Optimize animations for better performance
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null)
  const [birthCharts, setBirthCharts] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Mock user data - in production, this would come from authentication
    setUserData({
      name: 'John Doe',
      email: 'john@example.com',
      memberSince: '2024-01-15',
      totalReadings: 3,
    })

    // Mock birth charts data
    setBirthCharts([
      {
        id: 'chart_1',
        date: '2024-01-15',
        type: 'Basic Analysis',
        status: 'completed',
        title: 'My First Reading',
      },
      {
        id: 'chart_2',
        date: '2024-02-20',
        type: 'Detailed Analysis',
        status: 'completed',
        title: 'Career Guidance Reading',
      },
      {
        id: 'chart_3',
        date: '2024-03-10',
        type: 'Comprehensive Analysis',
        status: 'completed',
        title: 'Life Path Analysis',
      },
    ])
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-cosmic-50 via-white to-purple-50 dark:from-cosmic-950 dark:via-cosmic-900 dark:to-purple-950 pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            {...fadeInUp}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Your Dashboard
              </h1>
              <p className="text-xl text-cosmic-700 dark:text-cosmic-300">
                Welcome back! Here's your astrological journey overview.
              </p>
            </div>

            {/* User Stats */}
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              <motion.div
                {...fadeInUp}
                className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cosmic-200/50 dark:border-cosmic-700/50"
              >
                <div className="flex items-center">
                  <UserIcon className="w-8 h-8 text-cosmic-500 mr-3" />
                  <div>
                    <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Total Readings</p>
                    <p className="text-2xl font-bold text-cosmic-900 dark:text-white">{userData?.totalReadings || 0}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cosmic-200/50 dark:border-cosmic-700/50"
              >
                <div className="flex items-center">
                  <StarIcon className="w-8 h-8 text-cosmic-500 mr-3" />
                  <div>
                    <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Member Since</p>
                    <p className="text-lg font-bold text-cosmic-900 dark:text-white">
                      {userData?.memberSince ? new Date(userData.memberSince).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cosmic-200/50 dark:border-cosmic-700/50"
              >
                <div className="flex items-center">
                  <ChartBarIcon className="w-8 h-8 text-cosmic-500 mr-3" />
                  <div>
                    <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Active Charts</p>
                    <p className="text-2xl font-bold text-cosmic-900 dark:text-white">{birthCharts.length}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-cosmic-200/50 dark:border-cosmic-700/50"
              >
                <div className="flex items-center">
                  <CalendarIcon className="w-8 h-8 text-cosmic-500 mr-3" />
                  <div>
                    <p className="text-sm text-cosmic-600 dark:text-cosmic-400">Last Reading</p>
                    <p className="text-lg font-bold text-cosmic-900 dark:text-white">
                      {birthCharts.length > 0 ? new Date(birthCharts[0].date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50 mb-12"
            >
              <h2 className="text-2xl font-bold text-cosmic-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button
                  onClick={() => router.push('/birth-chart')}
                  className="h-20 bg-gradient-to-r from-cosmic-600 to-purple-600 hover:from-cosmic-700 hover:to-purple-700 text-white text-lg font-semibold"
                >
                  <ChartBarIcon className="w-6 h-6 mr-2" />
                  New Birth Chart
                </Button>
                <Button
                  variant="outline"
                  className="h-20 border-cosmic-300 dark:border-cosmic-600 text-cosmic-700 dark:text-cosmic-300 hover:bg-cosmic-50 dark:hover:bg-cosmic-700 text-lg font-semibold"
                >
                  <DocumentTextIcon className="w-6 h-6 mr-2" />
                  View Reports
                </Button>
                <Button
                  variant="outline"
                  className="h-20 border-cosmic-300 dark:border-cosmic-600 text-cosmic-700 dark:text-cosmic-300 hover:bg-cosmic-50 dark:hover:bg-cosmic-700 text-lg font-semibold"
                >
                  <ClockIcon className="w-6 h-6 mr-2" />
                  Reading History
                </Button>
              </div>
            </motion.div>

            {/* Recent Birth Charts */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 dark:bg-cosmic-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cosmic-200/50 dark:border-cosmic-700/50"
            >
              <h2 className="text-2xl font-bold text-cosmic-900 dark:text-white mb-6">
                Recent Birth Charts
              </h2>
              {birthCharts.length > 0 ? (
                <div className="space-y-4">
                  {birthCharts.map((chart, index) => (
                    <div
                      key={chart.id}
                      className="flex items-center justify-between p-4 bg-cosmic-50 dark:bg-cosmic-700/50 rounded-lg border border-cosmic-200 dark:border-cosmic-600"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cosmic-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <ChartBarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-cosmic-900 dark:text-white">
                            {chart.title}
                          </h3>
                          <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                            {chart.type} • {new Date(chart.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                          {chart.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cosmic-600 dark:text-cosmic-400 hover:text-cosmic-800 dark:hover:text-cosmic-200"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChartBarIcon className="w-16 h-16 text-cosmic-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-cosmic-700 dark:text-cosmic-300 mb-2">
                    No birth charts yet
                  </h3>
                  <p className="text-cosmic-600 dark:text-cosmic-400 mb-6">
                    Create your first birth chart to get started on your astrological journey.
                  </p>
                  <Button
                    onClick={() => router.push('/birth-chart')}
                    className="bg-gradient-to-r from-cosmic-600 to-purple-600 hover:from-cosmic-700 hover:to-purple-700 text-white"
                  >
                    Create Your First Chart
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
