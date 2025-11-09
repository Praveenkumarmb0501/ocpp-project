'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const profileFormSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  chargerNickname: z.string().max(30).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  phone: '123-456-7890',
  chargerNickname: 'My Garage Charger',
};

export default function ProfilePage() {
  const { toast } = useToast();
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Management</h1>
        <p className="text-muted-foreground">Update your personal and charger information.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6 mb-8">
            <Avatar className="h-24 w-24">
              {userAvatar && <AvatarImage src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} />}
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">User Name</h2>
              <p className="text-muted-foreground">Joined July 2024</p>
              <Button variant="outline" size="sm" className="mt-2">Change Photo</Button>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormDescription>Used for authentication and notifications.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chargerNickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Charger Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Home Charger" {...field} />
                    </FormControl>
                    <FormDescription>Give your paired charger a friendly name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Update Profile</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
