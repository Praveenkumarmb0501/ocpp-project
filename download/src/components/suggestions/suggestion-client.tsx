'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  suggestChargingSchedule,
  type ChargingScheduleInput,
  type ChargingScheduleOutput,
} from '@/ai/flows/charging-schedule-suggestions';
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
import { Loader2, Wand2, DollarSign, Battery, MapPin } from 'lucide-react';
import { LocationInput } from './location-input';

const suggestionFormSchema = z.object({
  currentBatteryPercentage: z.coerce.number().min(0).max(100),
  preferredChargeLevel: z.coerce.number().min(1).max(100),
  energyCost: z.string().min(1, { message: 'Energy cost is required.' }),
  startLocation: z.string().optional(),
  endLocation: z.string().optional(),
});

type SuggestionFormValues = z.infer<typeof suggestionFormSchema>;

export function SuggestionClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<ChargingScheduleOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: {
      currentBatteryPercentage: 20,
      preferredChargeLevel: 80,
      energyCost: '12 cents per kWh',
      startLocation: '',
      endLocation: '',
    },
  });

  async function onSubmit(data: SuggestionFormValues) {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    const input: ChargingScheduleInput = {
      ...data,
      startLocation: data.startLocation || '',
      endLocation: data.endLocation || '',
      chargingHistory: `
        - 2024-07-28, 01:00 AM, 30.2 kWh, 4h 15m
        - 2024-07-26, 11:30 PM, 18.0 kWh, 2h 30m
        - 2024-07-24, 02:00 AM, 35.0 kWh, 5h 0m
      `,
    };

    try {
      const result = await suggestChargingSchedule(input);
      setSuggestion(result);
    } catch (e) {
      setError('Failed to generate suggestions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Charging Preferences</CardTitle>
          <CardDescription>Tell us about your needs to get a custom plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentBatteryPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Battery (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredChargeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Charge Level (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 80" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Location</FormLabel>
                    <LocationInput
                      field={field}
                      placeholder="e.g., San Francisco, CA"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Location</FormLabel>
                    <LocationInput
                      field={field}
                      placeholder="e.g., Los Angeles, CA"
                    />
                    <FormDescription>Let the AI calculate charge needed for your trip.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="energyCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy Cost</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 12 cents per kWh" {...field} />
                    </FormControl>
                    <FormDescription>Can be a flat rate or describe peak/off-peak times.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-3 space-y-4">
        {isLoading && (
            <Card className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <CardContent className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg font-semibold">Our AI is thinking...</p>
                    <p className="text-muted-foreground">Analyzing your habits to create the perfect plan.</p>
                </CardContent>
            </Card>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {suggestion ? (
          <div className="space-y-4 animate-in fade-in-50">
            {suggestion.estimatedChargeForTrip && (
                 <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2"><MapPin className="text-[hsl(var(--chart-4))]"/> Trip Estimate</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-lg">{suggestion.estimatedChargeForTrip}</p>
                 </CardContent>
               </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 className="text-primary"/> Suggested Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{suggestion.suggestedSchedule}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="text-[hsl(var(--chart-2))]"/> Estimated Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{suggestion.estimatedCostSavings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Battery className="text-[hsl(var(--chart-1))]"/> Battery Health Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{suggestion.batteryLifeBenefits}</p>
              </CardContent>
            </Card>
          </div>
        ) : !isLoading && (
            <Card className="flex flex-col items-center justify-center h-full min-h-[400px] border-dashed">
                <CardContent className="text-center p-6">
                    <Wand2 className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                    <p className="text-lg font-semibold">Ready for your smart plan?</p>
                    <p className="text-muted-foreground max-w-xs mx-auto">Fill out the form to get your AI-powered charging schedule.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
