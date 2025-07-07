'use client';

import { Button } from "@/components/ui/button/index";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import { useState, forwardRef } from 'react';
import { useRouter } from "next/navigation";
import Autocomplete from "../../../../components/ui/autocomplete-places";
import { useAuthContext } from "@/contexts/auth"; 
import { getCookie } from "@/helpers/cookies";

type CreateTripFormData = {
  tripName: string;
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  latitude?: number;
  longitude?: number;
  placeId?: string;
};

interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  labelText: string;
  hasCalendarOpen: boolean;
}

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, labelText, hasCalendarOpen }, ref) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="cursor-pointer flex-col items-center selection:bg-light-gray text-gray text-base border-input flex h-fit w-full min-w-0 rounded-md border bg-transparent pr-3 py-1 shadow-xs transition-[color,box-shadow]"
    >
      <div className="flex justify-between w-full items-center">
        <Input
          labelText={labelText}
          className="border-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
          value={value}
          readOnly
          onClick={onClick}
          onFocus={(e) => e.target.blur()}
          ref={ref}
        />

        <svg
          className={clsx("transition-transform duration-300", {
            "rotate-270": hasCalendarOpen,
            "rotate-90": !hasCalendarOpen,
          })}
          width="20px"
          height="20px"
          viewBox="-19.04 0 75.804 75.804"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
            <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#000000"/>
          </g>
        </svg>
      </div>
    </div>
  )
);

CustomDateInput.displayName = 'CustomDateInput';

export const CreateTripForm = () => {
  const { userInfo } = useAuthContext(); 
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { register, handleSubmit, control, setValue } = useForm<CreateTripFormData>({
    defaultValues: {
      startDate: null,
      endDate: null,
      latitude: undefined, 
      longitude: undefined, 
      placeId: undefined, 
    },
  });

  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  const handleCoordinates = (address: string, lat: number, lng: number, placeID: string) => {
    setValue('destination', address); 
    setValue('latitude', lat);     
    setValue('longitude', lng);   
    setValue('placeId', placeID);   
    console.log("Dados recebidos do Autocomplete:", { address, lat, lng, placeID });
  };
  
  async function onSubmit(data: CreateTripFormData) {
    console.log("Dados do formulário:", data);

    if (!data.placeId){
      console.log("Place ID não encontrado");
      return;
    }
    const token = getCookie("authToken"); 
    
    if (!token) {
      console.error("Token de autenticação não encontrado. Redirecionando para login.");
      router.push('/login');
      return;
    }

    try {
      console.log(`Chamando o método "Post" em: ${apiUrl}/trips`);
      const res = await fetch(`${apiUrl}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: data.tripName,
          destination: data.placeId,
          startDate: data.startDate?.toISOString(),
          endDate: data.endDate?.toISOString(),
        })
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(`Erro na resposta da API: ${JSON.stringify(result)}`); 
        console.error(`Status HTTP: ${res.status}`);
        console.log(`Owner ID (from context for debug): ${userInfo?.id}`); 
        return;
      }

      console.log(`Viagem registrada com sucesso:`, result);
      router.push('/trips'); 
    } catch (error) {
      console.error(`Erro ao chamar o método "Post" em: ${apiUrl}/trips`, error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
      <div className="input-data flex flex-col gap-2 w-full">
        <Input
          {...register("tripName", { required: true })}
          labelText="Nome da Viagem"
          type="text"
          name="tripName"
          required
          placeholder="Ex.: Férias em Balneário"
        />

        <Autocomplete label="Destino:" placeholder="Insira seu destino:" handleCoordinates={handleCoordinates}/>

        <div className="DatePicker">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="startDate"
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                selectsStart
                startDate={field.value}
                endDate={control._formValues.endDate}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                wrapperClassName="w-full"
                customInput={
                  <CustomDateInput
                    labelText="Data de início"
                    hasCalendarOpen={isStartDatePickerOpen}
                  />
                }
                onCalendarOpen={() => setIsStartDatePickerOpen(true)}
                onCalendarClose={() => setIsStartDatePickerOpen(false)}
                popperPlacement="bottom-start"
                calendarClassName="border border-gray-300 rounded-lg shadow-lg"
                dayClassName={(date) =>
                  clsx(
                    "rounded-full w-8 h-8 flex items-center justify-center",
                    {
                      "bg-[#866969] text-white":
                        field.value && control._formValues.endDate && date >= field.value && date <= control._formValues.endDate,
                      "bg-light-gray": field.value && date.toDateString() === field.value.toDateString(),
                      "hover:bg-gray-100": !field.value || date.toDateString() !== field.value.toDateString(),
                      "text-gray-900": true,
                    }
                  )
                }
                renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                  <div className="flex justify-between items-center px-2 py-2 bg-light-gray rounded-t-lg">
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
                      <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <span className="text-gray-900 font-medium">
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
                      <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                )}
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="endDate"
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                selectsEnd
                startDate={control._formValues.startDate}
                endDate={field.value}
                minDate={control._formValues.startDate || new Date()}
                dateFormat="dd/MM/yyyy"
                wrapperClassName="w-full"
                customInput={
                  <CustomDateInput
                    labelText="Selecione a data de fim"
                    hasCalendarOpen={isEndDatePickerOpen}
                  />
                }
                onCalendarOpen={() => setIsEndDatePickerOpen(true)}
                onCalendarClose={() => setIsEndDatePickerOpen(false)}
                popperPlacement="bottom-start"
                calendarClassName="border border-gray-300 rounded-lg shadow-lg"
                dayClassName={(date) =>
                  clsx(
                    "rounded-full w-8 h-8 flex items-center justify-center",
                    {
                      "bg-[#866969] text-white":
                        control._formValues.startDate && field.value && date >= control._formValues.startDate && date <= field.value,
                      "bg-light-gray": field.value && date.toDateString() === field.value.toDateString(),
                      "hover:bg-gray-100": !field.value || date.toDateString() !== field.value.toDateString(),
                      "text-gray-900": true,
                    }
                  )
                }
                renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                  <div className="flex justify-between items-center px-2 py-2 bg-light-gray rounded-t-lg">
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
                      <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <span className="text-gray-900 font-medium">
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50">
                      <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                )}
              />
            )}
          />
        </div>

        {control._formValues.startDate && control._formValues.endDate && (
          <p className="mt-4 text-center text-gray-700">
            Sua viagem será de{' '}
            <span className="bold text-[#866969]">
              {control._formValues.startDate.toLocaleDateString('pt-BR')}
            </span>{' '}
            até{' '}
            <span className="bold text-[#866969]">
              {control._formValues.endDate.toLocaleDateString('pt-BR')}
            </span>
            .
          </p>
        )}
      </div>
      <Button variant="default" type="submit">Criar Roteiro</Button>
    </form>
  );
};