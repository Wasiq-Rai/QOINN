import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Individual Investor",
    content: "QOINN has transformed my investment strategy. The returns I've seen are incredible!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Sarah Lee",
    role: "Financial Advisor",
    content: "I recommend QOINN to all my clients. It's a game-changer in quantitative investing.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "Michael Chen",
    role: "Hedge Fund Manager",
    content: "The depth of analysis and accuracy of QOINN's predictions are unmatched in the industry.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
]

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={item.avatar} alt={item.name} />
                <AvatarFallback>{item.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.role}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">"{item.content}"</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

