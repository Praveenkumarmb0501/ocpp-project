'use client';

import usePlacesAutocomplete from 'use-places-autocomplete';
import { Input } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form';
import type { ControllerRenderProps } from 'react-hook-form';
import { useEffect } from 'react';

interface LocationInputProps {
  field: ControllerRenderProps<any, string>;
  placeholder: string;
}

export function LocationInput({ field, placeholder }: LocationInputProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  // When the form is reset, we need to sync the Places Autocomplete's internal state
  useEffect(() => {
    if (field.value !== value) {
      setValue(field.value);
    }
  }, [field.value, setValue, value]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    field.onChange(e.target.value);
  };

  const handleSelect = (suggestion: google.maps.places.AutocompletePrediction) => () => {
    setValue(suggestion.description, false);
    clearSuggestions();
    field.onChange(suggestion.description);
  };

  const renderSuggestions = () => {
    return (
      <ul className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
        {data.map((suggestion) => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
          } = suggestion;

          return (
            <li
              key={place_id}
              onClick={handleSelect(suggestion)}
              className="p-2 hover:bg-accent cursor-pointer"
            >
              <strong>{main_text}</strong> <small className="text-muted-foreground ml-1">{secondary_text}</small>
            </li>
          );
        })}
      </ul>
    );
  }


  return (
    <div className="relative">
      <FormControl>
        <Input
          {...field}
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder={placeholder}
          autoComplete="off"
        />
      </FormControl>
      {status === 'OK' && renderSuggestions()}
    </div>
  );
}
