import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold md:text-3xl">
          User Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account and accessibility settings.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Current User" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="user@email.com" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Settings</CardTitle>
          <CardDescription>
            Tailor the application to your needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="disability-type">Primary Disability Type</Label>
            <Select defaultValue="none">
              <SelectTrigger id="disability-type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="visual">Visual Impairment</SelectItem>
                <SelectItem value="hearing">Hearing Impairment</SelectItem>
                <SelectItem value="cognitive">Cognitive Disability</SelectItem>
                <SelectItem value="motor">Motor Disability</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language">Preferred Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="isl">Indian Sign Language (ISL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
