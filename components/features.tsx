import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, Shield, Zap } from 'lucide-react'

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Our advanced algorithms analyze market trends and predict optimal investment strategies.",
    icon: Brain,
  },
  {
    title: "Superior Returns",
    description: "QOINN consistently outperforms traditional index funds and human-managed portfolios.",
    icon: TrendingUp,
  },
  {
    title: "Risk Management",
    description: "Sophisticated risk assessment tools protect your investments in volatile markets.",
    icon: Shield,
  },
  {
    title: "Real-Time Adjustments",
    description: "Our model adapts to market changes instantly, optimizing your portfolio 24/7.",
    icon: Zap,
  },
]

export function Features() {
  return (
    <section id="features" className="py-12 bg-secondary/10">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose QOINN</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <feature.icon className="h-6 w-6 mr-2" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

