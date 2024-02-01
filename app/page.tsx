"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useState } from "react";
import { flightOffersSearch } from "./actions";

export default function Home() {
  // form fields
  const [org, setOrg] = useState("SYD");
  const [dst, setDst] = useState("BKK");
  const [date, setDate] = useState<Date | undefined>(new Date());

  // action's response data
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);

  // formatted form field
  const formattedDate = format(date || new Date(), "yyyy-MM-dd");

  return (
    <main className="flex min-h-screen flex-col gap-10 items-center p-24">
      <div>
        <p>{"This webpage is an experimental Next.js app to see how Amadeus' API actually works."}</p>
        <p>{"It's using self-service API on test host. so don't expect much from it."}</p>
        <p>{"Origin and destination must be IATA codes."}</p>
        <p>{"Some examples:"}</p>
        <p>{"Tehran (Mehrabad): THR; Tehran (Imam Khomeini): IKA; Bushehr: BUZ; Istanbul: SAW, ISL, IST; Kish: KIH"}</p>
        <p>
          {
            "NOTE: as it's using the self-service API on test host, most (or maybe all) of the low-cost flights are now showing in the search result. which means you won't be able to see the Iran's internal flights."
          }
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);

          const resp = await flightOffersSearch({ org, dst, date: formattedDate });
          setData(resp);
          setLoading(false);
        }}
      >
        <fieldset disabled={loading} className="flex font-sans gap-2 items-end justify-center">
          <Label>
            <p className="mb-2">Origin | مبداء:</p>
            <Input id="org" name="org" value={org} onChange={(e) => setOrg(e.target.value)} />
          </Label>

          <Label>
            <p className="mb-2">Destination | مقصد:</p>
            <Input id="dst" name="dst" value={dst} onChange={(e) => setDst(e.target.value)} />
          </Label>

          <Label className="flex flex-col">
            <p className="mb-2">Date | زمان سفر:</p>
            <input readOnly id="date" name="date" className="hidden" value={formattedDate} />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(v) => setDate(v)} initialFocus />
              </PopoverContent>
            </Popover>
          </Label>

          <Button type="submit">Check</Button>
        </fieldset>

        <p className="text-center mt-3">
          DEBUG: {org} {"->"} {dst} - {formattedDate}
        </p>
      </form>

      <div className="w-full gap-2 flex flex-col">
        {data ? (
          <>
            <h3 className="font-semibold italic">Raw JSON Response:</h3>
            <div className="flex flex-col gap-2 overflow-hidden">
              {(data as any[]).map((v, idx) => (
                <div key={v.id}>
                  <h4>{idx + 1}</h4>
                  <p className="font-mono">{JSON.stringify(v)}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center">Please submit the form above to fetch the data</p>
        )}
      </div>
    </main>
  );
}
