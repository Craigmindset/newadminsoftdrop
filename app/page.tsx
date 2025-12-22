import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-black">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">SoftDrop Web</CardTitle>
          <CardDescription>Admin Panel Management System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Welcome to your admin dashboard.
          </p>
          <Link href="/admin" className="block w-full">
            <Button className="w-full" size="lg">
              Admin
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
