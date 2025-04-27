'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/context/ThemeContext"
import { Typography } from "@mui/material"
import Image from "next/image"
import { useUser } from '@clerk/nextjs';
import { getUploadedImages, updateTeamMemberImage } from '@/utils/api';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export function TeamSection() {
  const { user } = useUser();
  const { theme } = useTheme();

  const isAdmin = user?.publicMetadata?.role === 'admin';
  const [team, setTeam] = useState<TeamMember[]>([]);
  useEffect(()=>{
    setTeam([{
      name: theme.strings.teamMember1Name,
      role: theme.strings.teamMember1Designation,
      bio: theme.strings.teamMember1Description,
      image: "/img/team/team-member-1.jpg",
    },
    {
      name: theme.strings.teamMember2Name,
      role: theme.strings.teamMember2Designation,
      bio: theme.strings.teamMember2Description,
      image: "/img/team/team-member-2.jpeg",
    }])
  },[theme])
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUploadedImages();
    }
  }, [isAdmin]);

  const fetchUploadedImages = async () => {
    try {
      const images = await getUploadedImages();
      setUploadedImages(images);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleImageSelect = async (memberIndex: number, imageUrl: string) => {
    try {
      // Update in backend
      await updateTeamMemberImage(team[memberIndex].name, imageUrl);
      
      // Update local state
      setTeam(prev => prev.map((member, index) => 
        index === memberIndex ? { ...member, image: imageUrl } : member
      ));
      
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  return (
    <>
      <Typography variant="h4" textAlign={"center"} my={4} color="#2d2b2a" gutterBottom className='font-kigelia'>
        {theme.strings.ourTeam}
      </Typography>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {team.map((member, index) => (
          <Card key={member.name} className="justify-center relative">
            <CardContent className="p-4 text-center">
              <div className="relative group">
                <Image
                  src={member.image}
                  alt={member.name}
                  priority={true}
                  width={400}
                  height={400}
                  className="rounded-lg object-cover aspect-square mb-4 inline"
                />
                
                {isAdmin && (
                  <button
                    onClick={() => setSelectedMember(selectedMember === index ? null : index)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
              </div>
              
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{member.role}</p>
              <p className="text-sm">{member.bio}</p>
              <p className="text-sm">{member.bio}</p>
            </CardContent>

            {isAdmin && selectedMember === index && (
              <div className="absolute top-full left-0 right-0 bg-white p-4 rounded-b-lg shadow-lg z-10">
                <h4 className="font-semibold mb-2">Select Image</h4>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {uploadedImages.map((imageUrl) => (
                    <button
                      key={imageUrl}
                      onClick={() => handleImageSelect(index, imageUrl)}
                      className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}