import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-6 md:py-10 md:px-12 lg:px-20">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Company and Products */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
            {/* Company */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold leading-none mb-1">Our Company</h3>
              <ul className="space-y-0.5">
                <li>
                  <Link href="/about" className="text-sm hover:text-gray-300 leading-tight">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="text-sm hover:text-gray-300 leading-tight">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link href="/feature" className="text-sm hover:text-gray-300 leading-tight">
                    Feature
                  </Link>
                </li>
                <li>
                  <Link href="/investors" className="text-sm hover:text-gray-300 leading-tight">
                    Investors
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm hover:text-gray-300 leading-tight">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold leading-none mb-1">Our Products</h3>
              <ul className="space-y-0.5">
                <li>
                  <Link href="/softdrop" className="text-sm hover:text-gray-300 leading-tight">
                    SoftDrop
                  </Link>
                </li>
                <li>
                  <Link href="/softpay" className="text-sm hover:text-gray-300 leading-tight">
                    SoftPay
                  </Link>
                </li>
                <li>
                  <Link href="/softlift" className="text-sm hover:text-gray-300 leading-tight">
                    SoftLift
                  </Link>
                </li>
                <li>
                  <Link href="/softchat" className="text-sm hover:text-gray-300 leading-tight">
                    SoftChat
                  </Link>
                </li>
                <li>
                  <Link href="/enterprise" className="text-sm hover:text-gray-300 leading-tight">
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Partners, Support, and Media */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Partners */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold leading-none mb-1">Our Partners</h3>
              <ul className="space-y-0.5">
                <li>
                  <Link href="/partners/cornerstone" className="text-sm hover:text-gray-300 leading-tight">
                    CornerStone PLC
                  </Link>
                </li>
                <li>
                  <Link href="/partners/providus" className="text-sm hover:text-gray-300 leading-tight">
                    Providus Bank
                  </Link>
                </li>
                <li>
                  <Link href="/partners/join" className="text-sm hover:text-gray-300 leading-tight">
                    Join us
                  </Link>
                </li>
                <li>
                  <Link href="/login/carrier" className="text-sm hover:text-gray-300 leading-tight">
                    Carrier Login
                  </Link>
                </li>
                <li>
                  <Link href="/partners/super" className="text-sm hover:text-gray-300 leading-tight">
                    Super
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold leading-none mb-1">Support</h3>
              <ul className="space-y-0.5">
                <li>
                  <Link href="/support/call-center" className="text-sm hover:text-gray-300 leading-tight">
                    Call Center
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="text-sm hover:text-gray-300 leading-tight">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-sm hover:text-gray-300 leading-tight opacity-30 hover:opacity-70">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Media - Full width */}
            <div className="col-span-2 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold leading-none mb-2">Media</h3>
                  <div className="flex space-x-4">
                    <Link href="https://twitter.com" className="hover:text-gray-300">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                    <Link href="https://linkedin.com" className="hover:text-gray-300">
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link href="https://instagram.com" className="hover:text-gray-300">
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="https://facebook.com" className="hover:text-gray-300">
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 leading-tight mb-1">Download App</p>
                  <div className="flex flex-col gap-1">
                    <Link href="#" className="block w-32">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20%281%29-j8MKe8PZLATMtY9RMtMZqj8COmXQ13.png"
                        alt="Download on the App Store"
                        width={120}
                        height={40}
                        className="w-full h-auto"
                      />
                    </Link>
                    <Link href="#" className="block w-32">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20%281%29-j8MKe8PZLATMtY9RMtMZqj8COmXQ13.png"
                        alt="Get it on Google Play"
                        width={120}
                        height={40}
                        className="w-full h-auto"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-5 md:gap-4">
          {/* Company */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none mb-1">Our Company</h3>
            <ul className="space-y-0.5">
              <li>
                <Link href="/about" className="text-base hover:text-gray-300 leading-tight">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-base hover:text-gray-300 leading-tight">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/feature" className="text-base hover:text-gray-300 leading-tight">
                  Feature
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-base hover:text-gray-300 leading-tight">
                  Investors
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-base hover:text-gray-300 leading-tight">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none mb-1">Our Products</h3>
            <ul className="space-y-0.5">
              <li>
                <Link href="/softdrop" className="text-base hover:text-gray-300 leading-tight">
                  SoftDrop
                </Link>
              </li>
              <li>
                <Link href="/softpay" className="text-base hover:text-gray-300 leading-tight">
                  SoftPay
                </Link>
              </li>
              <li>
                <Link href="/softlift" className="text-base hover:text-gray-300 leading-tight">
                  SoftLift
                </Link>
              </li>
              <li>
                <Link href="/softchat" className="text-base hover:text-gray-300 leading-tight">
                  SoftChat
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-base hover:text-gray-300 leading-tight">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none mb-1">Our Partners</h3>
            <ul className="space-y-0.5">
              <li>
                <Link href="/partners/cornerstone" className="text-base hover:text-gray-300 leading-tight">
                  CornerStone PLC
                </Link>
              </li>
              <li>
                <Link href="/partners/providus" className="text-base hover:text-gray-300 leading-tight">
                  Providus Bank
                </Link>
              </li>
              <li>
                <Link href="/partners/join" className="text-base hover:text-gray-300 leading-tight">
                  Join us
                </Link>
              </li>
              <li>
                <Link href="/login/carrier" className="text-base hover:text-gray-300 leading-tight">
                  Carrier Login
                </Link>
              </li>
              <li>
                <Link href="/partners/super" className="text-base hover:text-gray-300 leading-tight">
                  Super
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none mb-1">Support</h3>
            <ul className="space-y-0.5">
              <li>
                <Link href="/support/call-center" className="text-base hover:text-gray-300 leading-tight">
                  Call Center
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-base hover:text-gray-300 leading-tight">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-base hover:text-gray-300 leading-tight opacity-30 hover:opacity-70">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Media */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-none mb-2">Media</h3>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="hover:text-gray-300">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com" className="hover:text-gray-300">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://instagram.com" className="hover:text-gray-300">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com" className="hover:text-gray-300">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
            <p className="text-sm text-gray-400 leading-tight">Coming soon</p>
            <div className="flex flex-wrap gap-2">
              <Link href="#" className="block w-36">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20%281%29-j8MKe8PZLATMtY9RMtMZqj8COmXQ13.png"
                  alt="Download on the App Store"
                  width={140}
                  height={42}
                  className="w-full h-auto"
                />
              </Link>
              <Link href="#" className="block w-36">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20%281%29-j8MKe8PZLATMtY9RMtMZqj8COmXQ13.png"
                  alt="Get it on Google Play"
                  width={140}
                  height={42}
                  className="w-full h-auto"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 flex flex-col items-center justify-between border-t border-gray-800 pt-4 md:flex-row">
          <p className="text-xs md:text-sm text-gray-400 text-center md:text-left leading-tight">
            All right reserved © Tecwurld Limited 2025
          </p>
          <div className="mt-2 flex space-x-4 md:mt-0">
            <Link href="/privacy" className="text-xs md:text-sm text-gray-400 hover:text-gray-300 leading-tight">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs md:text-sm text-gray-400 hover:text-gray-300 leading-tight">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
