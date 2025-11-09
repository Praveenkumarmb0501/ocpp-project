'use client';

import { SuggestionClient } from '@/components/suggestions/suggestion-client';

export default function SuggestionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Charging Suggestions</h1>
        <p className="text-muted-foreground">
          Get smart recommendations to save money and improve battery health.
        </p>
      </div>
      <SuggestionClient />
    </div>
  );
}
