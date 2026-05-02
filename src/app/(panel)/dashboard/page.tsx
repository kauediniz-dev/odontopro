import getSession from "@/app/lib/getSession";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const session = getSession(); // Placeholder for session management

  if (!session) {
    redirect("/"); // Redirect to home page if not authenticated
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="w-full h-[600px] bg-gray-200 mb-10"></div>
      <div className="w-full h-[600px] bg-gray-500 mb-10"></div>
      <div className="w-full h-[600px] bg-gray-200 mb-10"></div>
    </div>
  );
}
