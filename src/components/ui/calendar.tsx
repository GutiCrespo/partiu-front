'use client'

import DatePicker from 'react-datepicker'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

interface TravelCalendarProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
}

export default function TravelCalendar({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: TravelCalendarProps) {
  return (
    <div className="w-full flex flex-col gap-4"> {/* Removido o p-6 bg-white e shadow-md daqui */}
      {/* Input para Data de Início */}
      <div>
        <label htmlFor="startDate" className="block text-normal-gray text-sm font-medium mb-1">
          Data de Início:
        </label>
        <DatePicker
          id="startDate"
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          placeholderText="Selecione a data de início"
          dateFormat="dd/MM/yyyy"
          className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
          dayClassName={(date) =>
            clsx(
              "rounded-full w-8 h-8 flex items-center justify-center",
              {
                "bg-[#866969] text-white":
                  startDate && endDate && date >= startDate && date <= endDate,
                "bg-light-gray": startDate && date.toDateString() === startDate.toDateString(),
                "hover:bg-gray-100": !startDate || date.toDateString() !== startDate.toDateString(),
                "text-gray-900": true,
              }
            )
          }
          popperPlacement="bottom-start"
          calendarClassName="border border-gray-300 rounded-lg shadow-lg"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex justify-between items-center px-2 py-2 bg-light-gray rounded-t-lg">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
              </button>
              <span className="text-gray-900 font-medium">
                {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Input para Data de Fim */}
      <div>
        <label htmlFor="endDate" className="block text-normal-gray text-sm font-medium mb-1">
          Data de Fim:
        </label>
        <DatePicker
          id="endDate"
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || new Date()} 
          placeholderText="Selecione a data de fim"
          dateFormat="dd/MM/yyyy"
          className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
          dayClassName={(date) =>
            clsx(
              "rounded-full w-8 h-8 flex items-center justify-center",
              {
                "bg-[#866969] text-white":
                  startDate && endDate && date >= startDate && date <= endDate,
                "bg-light-gray": endDate && date.toDateString() === endDate.toDateString(),
                "hover:bg-gray-100": !endDate || date.toDateString() !== endDate.toDateString(),
                "text-gray-900": true,
              }
            )
          }
          popperPlacement="bottom-start"
          calendarClassName="border border-gray-300 rounded-lg shadow-lg"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex justify-between items-center px-2 py-2 bg-light-gray rounded-t-lg">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
              </button>
              <span className="text-gray-900 font-medium">
                {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          )}
        />
      </div>

      {startDate && endDate && (
        <p className="mt-4 text-center text-gray-700">
          Sua viagem será de{' '}
          <span className="bold text-[#866969]">
            {startDate.toLocaleDateString('pt-BR')}
          </span>{' '}
          até{' '}
          <span className="bold text-[#866969]">
            {endDate.toLocaleDateString('pt-BR')}
          </span>
          .
        </p>
      )}
    </div>
  );
}