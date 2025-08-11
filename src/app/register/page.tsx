import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pakistan-50 to-pakistan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-8 w-8 text-pakistan-600" />
            <span className="text-3xl font-bold text-pakistan-700">UCAS Pakistan</span>
          </div>
          <h1 className="text-2xl font-bold text-pakistan-900">Create your account</h1>
          <p className="text-gray-600">Start your Pakistani university application journey</p>
        </div>

        <Card className="border-pakistan-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-pakistan-800">Register</CardTitle>
            <CardDescription>Create a new UCAS Pakistan account to begin your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="Ahmed" className="border-pakistan-200 focus:ring-pakistan-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Khan" className="border-pakistan-200 focus:ring-pakistan-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ahmed.khan@example.com"
                className="border-pakistan-200 focus:ring-pakistan-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input id="dateOfBirth" type="date" className="border-pakistan-200 focus:ring-pakistan-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Select>
                <SelectTrigger className="border-pakistan-200 focus:ring-pakistan-500">
                  <SelectValue placeholder="Select your nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pakistani">Pakistani</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" className="border-pakistan-200 focus:ring-pakistan-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" className="border-pakistan-200 focus:ring-pakistan-500" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-pakistan-600 hover:underline">
                  terms and conditions
                </Link>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="marketing" />
              <Label htmlFor="marketing" className="text-sm">
                I would like to receive updates about courses and universities
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-pakistan-600 hover:bg-pakistan-700">Create account</Button>
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-pakistan-600 hover:underline">
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
