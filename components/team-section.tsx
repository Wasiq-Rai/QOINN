import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@mui/material"
import Image from "next/image"

const team = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    bio: "John has over 15 years of experience in quantitative finance and machine learning.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Jane Smith",
    role: "Lead Developer",
    bio: "Jane is an expert in algorithmic trading and high-frequency systems.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Mike Johnson",
    role: "Data Scientist",
    bio: "Mike specializes in predictive modeling and statistical analysis for financial markets.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "Sarah Lee",
    role: "Marketing Director",
    bio: "Sarah has a proven track record in growth marketing for fintech startups.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
  },
]

export function TeamSection() {
  return (
    <>
    
    <Typography variant="h4" textAlign={"center"} my={4} color="#2d2b2a" gutterBottom className='font-kigelia'>
        Our Team
      </Typography>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {team.map((member) => (
        <Card key={member.name}>
          <CardContent className="p-4">
            <Image
              src={member.image}
              alt={member.name}
              width={400}
              height={400}
              className="rounded-lg object-cover aspect-square mb-4"
            />
            <h3 className="font-bold text-lg">{member.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{member.role}</p>
            <p className="text-sm">{member.bio}</p>
          </CardContent>
        </Card>
      ))}
    </div>
    </>
  )
}

