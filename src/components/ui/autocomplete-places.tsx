'use client'

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { useEffect, useState, useRef, SetStateAction } from "react"
import { autocomplete } from '@/lib/google'
import { AddressType, PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js"
import usePlacesAutocomplete, {getGeocode, getLatLng,} from "use-places-autocomplete"

interface AutocompleteProps {
  handleCoordinates: (address: string, lat: number, lng: number, placeID: string) => void;
  label?: string;
  placeholder?: string
}

export default function Autocomplete({handleCoordinates, label, placeholder}: AutocompleteProps) {
  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete()
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([])
  const lastActionWasSelection = useRef(false)
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    if (lastActionWasSelection.current){
      lastActionWasSelection.current = false
      return
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (value.trim() === "") {
      setPredictions([]);
      return;
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      const fetchedPredictions = await autocomplete(value)
      setPredictions(fetchedPredictions);
      // 
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [value]);

  async function handleSelect(address: string, placeID: string){
    lastActionWasSelection.current = true
    setValue(address, false)
    setPredictions([])

    const results = await getGeocode({address})
    const {lat, lng} = await getLatLng(results[0])

    // 
    // 

    handleCoordinates(address, lat, lng, placeID)
    clearSuggestions()
  }

  return (
    <Command className="flex-col selection:bg-light-gray text-gray border-input flex h-fit w-full min-w-0 rounded-md border bg-transparent pr-3 py-1 shadow-xs transition-[color,box-shadow]">
      {label ? (
        <p className="font-medium ml-3">{label}</p>
      ):(<></>)
      }
      <CommandInput
        placeholder={placeholder}
        value={value}
        onValueChange={(inputValue) => {
            lastActionWasSelection.current = false;
            setValue(inputValue);
        }}
        className=""
      />
      <CommandList>
        {!lastActionWasSelection.current && predictions.length > 0 && value.trim() !== "" && (
            <CommandGroup>
                {predictions.map((prediction) => (
                    <CommandItem key={prediction.place_id} onSelect={() => handleSelect(prediction.description, prediction.place_id)}>
                        {prediction.description}
                    </CommandItem>
                ))}
            </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}