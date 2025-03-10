import { Metadata } from 'next'
import Dashboard from './dashboard'

export const metadata: Metadata = {
  title: 'QOINN - Quantitative Investment Model',
  description: 'QOINN is an innovative quantitative investment model delivering superior returns through advanced algorithms and data science.',
}

export default function Page() {
  return (
    <Dashboard/>
  )
}

