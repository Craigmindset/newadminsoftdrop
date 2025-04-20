import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function SenderAcademy() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to the Sender Academy</h1>
          <p className="text-lg text-muted-foreground">
            Learn everything you need to know about using SoftDrop effectively. Our comprehensive guides and tutorials
            will help you become a logistics expert in no time.
          </p>
          <p className="text-muted-foreground">
            Whether you're sending your first package or managing regular shipments, our academy provides all the
            resources you need to make the most of our platform.
          </p>
          <Button size="lg" className="mt-4">
            How to use SoftDrop
          </Button>
        </div>

        {/* Right Column */}
        <div className="relative h-[400px] rounded-xl overflow-hidden border shadow-md">
          <Image src="/images/sender-academy-hero.jpg" alt="Sender Academy" fill className="object-cover" priority />
          {/* Fallback if image doesn't exist */}
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-muted-foreground text-lg">Sender Academy Resources</p>
          </div>
        </div>
      </div>

      {/* Additional content sections can be added here */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Popular Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resource cards can be added here */}
        </div>
      </div>
    </div>
  )
}
