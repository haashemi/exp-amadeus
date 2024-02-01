"use server";

import { amadeus } from "./amadeus";

export async function flightOffersSearch(data: { org: string; dst: string; date: string }) {
  const resp = await amadeus.shopping.flightOffersSearch.get({
    originLocationCode: data.org,
    destinationLocationCode: data.dst,
    departureDate: data.date,
    adults: "1",
  });

  return resp.data;
}
