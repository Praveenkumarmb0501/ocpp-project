'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons/logo';
import { useAuth } from '@/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import {
  Loader2,
  Check,
  ChevronsUpDown,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { countries } from '@/lib/countries';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

const phoneFormSchema = z.object({
  phone: z.string().min(8, { message: 'Please enter a valid phone number.' }),
});

const otpFormSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits.' }),
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

type Country = {
  name: string;
  code: string;
  iso: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.iso === 'IN')!
  );
  const [popoverOpen, setPopoverOpen] = useState(false);

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: '' },
  });

  useEffect(() => {
    if (auth && recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
      const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow sign-in
        },
      });
      recaptchaVerifierRef.current = verifier;
    }

    return () => {
      recaptchaVerifierRef.current?.clear();
    };
  }, [auth]);

  const onSendOtp = async ({ phone }: PhoneFormValues) => {
    setIsLoading(true);
    if (!auth || !recaptchaVerifierRef.current) {
      toast({
        variant: 'destructive',
        title: 'Authentication service not ready.',
        description: 'Please wait a moment and try again.',
      });
      setIsLoading(false);
      return;
    }

    const fullPhoneNumber = `${selectedCountry.code}${phone}`;

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        recaptchaVerifierRef.current
      );
      setConfirmationResult(confirmation);
      toast({
        title: 'OTP Sent',
        description: 'Check your phone for a verification code.',
      });
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to send OTP',
        description: error.message || 'Please check the phone number and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async ({ otp }: OtpFormValues) => {
    setIsLoading(true);
    if (!confirmationResult) {
      toast({
        variant: 'destructive',
        title: 'Verification failed.',
        description: 'No OTP request found. Please try again.',
      });
      setIsLoading(false);
      return;
    }
    try {
      await confirmationResult.confirm(otp);
      toast({
        title: 'Login Successful!',
        description: 'You are being redirected to your dashboard.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('OTP Verification Failed:', error);
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'The code you entered is incorrect. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setPopoverOpen(false);
    phoneForm.setValue('phone', ''); // Clear phone input on country change
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Logo className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to WattSync</CardTitle>
          <CardDescription>
            {confirmationResult
              ? 'Enter the OTP sent to your phone.'
              : 'Sign in with your phone number.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!confirmationResult ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <div className="flex items-center gap-2">
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={popoverOpen}
                              className="w-[150px] justify-between"
                            >
                              {selectedCountry
                                ? `(${selectedCountry.iso}) ${selectedCountry.code}`
                                : 'Select country...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] p-0">
                            <Command>
                              <CommandInput placeholder="Search country..." />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {countries.map((country) => (
                                    <CommandItem
                                      key={country.iso}
                                      value={`${country.name} (${country.code})`}
                                      onSelect={() => handleCountrySelect(country)}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          selectedCountry.iso === country.iso
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {country.name} ({country.code})
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Your phone number"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Phone className="mr-2 h-4 w-4" />
                  )}
                  Send OTP
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          maxLength={6}
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  Verify OTP
                </Button>
              </form>
            </Form>
          )}

          <div ref={recaptchaContainerRef} className="mt-4"></div>
        </CardContent>
      </Card>
    </div>
  );
}
