import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const newsItems = [
  {
    title: "QOINN Outperforms S&P 500 for Third Consecutive Quarter",
    description: "Our AI-driven strategy continues to deliver exceptional results for investors.",
    date: "2023-09-30",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    title: "New Machine Learning Algorithm Enhances QOINN's Predictive Capabilities",
    description: "Cutting-edge technology improves our ability to identify market trends.",
    date: "2023-10-15",
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    title: "QOINN Expands into European Markets",
    description: "Our successful quantitative model now available for European stocks.",
    date: "2023-11-01",
    image: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
]

export function NewsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {newsItems.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

