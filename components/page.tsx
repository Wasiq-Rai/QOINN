import HomePage from "./home_page/page";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="h-screen text-[#ff4e4e]">
      <HomePage/> 
      <UserButton/>
    </main>
  );
}
