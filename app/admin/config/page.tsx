import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function ConfigPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">System Configuration</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Supabase Configuration</CardTitle>
          <CardDescription>
            Check if Supabase is properly configured for authentication and data storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mt-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <h3 className="font-semibold mb-2">How to fix "Invalid API key" error:</h3>
              <p className="mb-2">This error occurs when your Supabase API key is incorrect or improperly formatted.</p>

              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Go to your Supabase dashboard</strong> at{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    https://supabase.com/dashboard
                  </a>
                </li>
                <li>
                  <strong>Select your project</strong> from the list
                </li>
                <li>
                  <strong>Navigate to Project Settings</strong> → API
                </li>
                <li>
                  <strong>Copy the "anon" public key</strong> (it should start with "ey" and be a long string)
                </li>
                <li>
                  <strong>Add this key</strong> to your environment variables as{" "}
                  <code className="bg-gray-800 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                </li>
                <li>
                  <strong>Make sure the key value doesn't include</strong> the variable name
                  (NEXT_PUBLIC_SUPABASE_ANON_KEY=)
                </li>
                <li>
                  <strong>Restart your application</strong> for the changes to take effect
                </li>
              </ol>

              <div className="mt-4 p-3 bg-gray-800 rounded-md">
                <p className="font-mono text-sm mb-2">
                  # Incorrect format in .env.local file
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                </p>
                <p className="font-mono text-sm">
                  # Correct format in .env.local file
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <Alert className="mt-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <h3 className="font-semibold mb-2">How to fix "Supabase URL contains the variable name" error:</h3>
              <p className="mb-2">
                This error occurs when your environment variable includes both the variable name and value. The correct
                format should only include the value.
              </p>

              <div className="mt-2 p-3 bg-gray-800 rounded-md">
                <p className="font-mono text-sm mb-2">
                  # Incorrect format in .env.local file
                  <br />
                  NEXT_PUBLIC_SUPABASE_URL=NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
                </p>
                <p className="font-mono text-sm">
                  # Correct format in .env.local file
                  <br />
                  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
                </p>
              </div>

              <ol className="list-decimal pl-5 space-y-2 mt-4">
                <li>
                  <strong>Edit your environment variables</strong> (in .env.local or your hosting platform)
                </li>
                <li>
                  <strong>Remove the duplicate variable name</strong> from the value
                </li>
                <li>
                  <strong>Restart your application</strong> for the changes to take effect
                </li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="mt-6 text-sm">
            <h3 className="font-semibold mb-2">Configuration Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL must be a valid URL starting with https://</li>
              <li>NEXT_PUBLIC_SUPABASE_URL should be in the format: https://your-project.supabase.co</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid JWT token starting with "ey"</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY must be at least 30 characters long</li>
              <li>Supabase project must have phone authentication enabled</li>
              <li>Database must have the required tables (sender_profiles, etc.)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Check if all required environment variables are set</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Supabase Variables</h3>
              <ul className="list-disc pl-5 mt-2">
                <li className="flex items-center">
                  <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"}`}
                  >
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing"}
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"}`}
                  >
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
