import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex flex-col lg:flex-row bg-black">
        {/* Left Section - Hero Content */}
        <div className="w-full lg:w-1/2 flex flex-col px-4 sm:px-6 lg:px-16 pb-12 lg:pb-24 bg-black text-white relative z-10">
          {/* Header */}
          <div className="w-full py-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/softdrop-logo-wht-Thy79HraEvi6hbvpZjIg31TAWOvlCA.png"
                alt="SoftDrop Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold">SoftDrop</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#" className="text-sm font-medium hover:text-gray-300">
                Sender Academy
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-gray-300">
                Why SoftDrop
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-gray-300">
                FAQ
              </Link>
            </div>
            {/* Login/Signup for mobile */}
            <div className="flex lg:hidden items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium bg-white text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                Signup
              </Link>
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start lg:ml-20 mt-8 lg:mt-auto">
            <h1 className="text-5xl mt-10 lg:text-6xl font-bold leading-tight mb-6 text-center lg:text-left">
              Making every
              <br />
              move count
            </h1>
            <p className="text-sm font-medium text-gray-300 mb-12 text-center lg:text-left max-w-md">
              Send and Deliver items on the go. Intra-cities,
              <br /> Inter-States and International. Super easy, SoftDrop!
            </p>

            <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="flex-1">
                <Button className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://softdrop.tech" className="flex-1">
                <Button className="w-full py-6 bg-transparent hover:bg-white/10 text-white border-2 border-white rounded-xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:block lg:w-1/2 h-screen">
          {/* Login/Signup for desktop */}
          <div className="absolute top-6 right-16 z-20 flex items-center gap-4">
            <Link
              href="/login"
              className="px-8 py-2 text-sm font-medium border border-black backdrop-blur-sm rounded-full transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-white hover:bg-gray-100 rounded-full transition-colors"
            >
              Signup
            </Link>
          </div>
          <div className="relative w-full h-full">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/softdrop-hero-RJ5bUqluMhdcXOEJQ4THFjlyFlsn4A.png"
              alt="Person using the SoftDrop app while standing on a roadside"
              fill
              sizes="50vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </div>
        </div>
      </div>

      {/* New Section - Same Day Delivery */}
      <section className="bg-[#006400] py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Same Day Delivery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fast Pickup",
                description: "Our carriers are always nearby, ensuring quick item pickup from your location.",
                image: "/images/fast-pickup.jpeg",
              },
              {
                title: "Secure Transport",
                description: "Your items are handled with care and transported securely to their destination.",
                image: "/images/secure-transport.jpeg",
              },
              {
                title: "Timely Delivery",
                description: "We guarantee same-day delivery, so your items reach their destination quickly.",
                image: "/images/timely-delivery.jpeg",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
