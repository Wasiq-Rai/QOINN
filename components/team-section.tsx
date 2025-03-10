'use client'
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/context/ThemeContext"
import { Typography } from "@mui/material"
import Image from "next/image"

export function TeamSection() {
  const { theme } = useTheme(); 
  const team = [
    {
      name: theme.strings.teamMember1Name      ,
      role: theme.strings.teamMember1Designation,
      bio: theme.strings.teamMember1Description,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    {
      name: theme.strings.teamMember2Name      ,
      role: theme.strings.teamMember2Designation,
      bio: theme.strings.teamMember2Description,
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    }
  ]
  
  return (
    <>
    
    <Typography variant="h4" textAlign={"center"} my={4} color="#2d2b2a" gutterBottom className='font-kigelia'>
        {theme.strings.ourTeam}
      </Typography>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {team.map((member) => (
        <Card key={member.name} className="justify-center">
          <CardContent className="p-4 text-center">
            <Image
              src={member.image}
              alt={member.name}
              width={400}
              height={400}
              className="rounded-lg object-cover aspect-square mb-4 inline"
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

