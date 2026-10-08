import { TouristAttraction, AccommodationOption, TravelPlan, TravelPurpose } from './types';
import { getCountryByIso2 } from './countryRegistry';

export const SAMPLE_ATTRACTIONS: TouristAttraction[] = [
  // United Kingdom
  { id: 'att-uk-1', countryIso2: 'GB', cityName: 'London', name: 'Big Ben & Houses of Parliament', category: 'HISTORICAL', description: 'Iconic neo-Gothic clock tower and seat of the UK Parliament on the River Thames.', ticketPriceUsd: 0, visitDurationHours: 2, bestSeason: 'May - September', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
  { id: 'att-uk-2', countryIso2: 'GB', cityName: 'London', name: 'The British Museum', category: 'CULTURE', description: 'World-famous museum dedicated to human history, art, and culture containing the Rosetta Stone.', ticketPriceUsd: 0, visitDurationHours: 4, bestSeason: 'All Year', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800' },
  { id: 'att-uk-3', countryIso2: 'GB', cityName: 'Edinburgh', name: 'Edinburgh Castle', category: 'HISTORICAL', description: 'Historic fortress dominating the skyline of the city of Edinburgh from Castle Rock.', ticketPriceUsd: 25, visitDurationHours: 3, bestSeason: 'June - August', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800' },
  
  // UAE
  { id: 'att-ae-1', countryIso2: 'AE', cityName: 'Dubai', name: 'Burj Khalifa Observation Deck', category: 'CITY', description: 'The tallest building in the world offering 360-degree panoramic views over Dubai.', ticketPriceUsd: 48, visitDurationHours: 2, bestSeason: 'November - March', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
  { id: 'att-ae-2', countryIso2: 'AE', cityName: 'Abu Dhabi', name: 'Sheikh Zayed Grand Mosque', category: 'CULTURE', description: 'Magnificent white marble architectural masterpiece accommodating over 40,000 worshippers.', ticketPriceUsd: 0, visitDurationHours: 3, bestSeason: 'November - March', rating: 5.0, imageUrl: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=800' },

  // Turkey
  { id: 'att-tr-1', countryIso2: 'TR', cityName: 'Istanbul', name: 'Hagia Sophia & Blue Mosque', category: 'HISTORICAL', description: 'Historic Byzantine cathedral turned imperial Ottoman mosque in the heart of Sultanahmet.', ticketPriceUsd: 28, visitDurationHours: 3, bestSeason: 'April - May & Sept - Oct', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800' },
  { id: 'att-tr-2', countryIso2: 'TR', cityName: 'Cappadocia', name: 'Hot Air Balloon Ride over Fairy Chimneys', category: 'NATURE', description: 'Sunrise hot air balloon flight over unique volcanic rock formations and cave dwellings.', ticketPriceUsd: 180, visitDurationHours: 4, bestSeason: 'April - October', rating: 5.0, imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' }
];

export const SAMPLE_ACCOMMODATIONS: AccommodationOption[] = [
  { id: 'acc-uk-1', countryIso2: 'GB', cityName: 'London', name: 'CitizenM London Bankside', type: 'HOTEL', pricePerNightUsd: 165, monthlyRentUsd: 2800, rating: 4.7, address: '20 Lavington St, London SE1 0NZ', bookingUrl: 'https://booking.com' },
  { id: 'acc-ae-1', countryIso2: 'AE', cityName: 'Dubai', name: 'Rove Downtown Dubai', type: 'HOTEL', pricePerNightUsd: 110, monthlyRentUsd: 1900, rating: 4.8, address: 'Financial Centre Road, Downtown Dubai', bookingUrl: 'https://booking.com' },
  { id: 'acc-tr-1', countryIso2: 'TR', cityName: 'Istanbul', name: 'Sultanahmet Boutique Hotel', type: 'HOTEL', pricePerNightUsd: 65, monthlyRentUsd: 950, rating: 4.6, address: 'Sultanahmet, Fatih, Istanbul', bookingUrl: 'https://booking.com' }
];

export function getAttractionsForCountry(countryIso2: string): TouristAttraction[] {
  return SAMPLE_ATTRACTIONS.filter((a) => a.countryIso2.toUpperCase() === countryIso2.toUpperCase());
}

export function getAccommodationsForCountry(countryIso2: string): AccommodationOption[] {
  return SAMPLE_ACCOMMODATIONS.filter((a) => a.countryIso2.toUpperCase() === countryIso2.toUpperCase());
}

/**
 * Generate complete Travel Plan & Trip Cost Estimate
 */
export function generateTravelPlan(
  nationalityIso2: string,
  destinationIso2: string,
  purpose: TravelPurpose = 'TOURISM',
  durationDays: number = 7,
  budgetUsd: number = 1500,
  travelersCount: number = 1
): TravelPlan {
  const destCountry = getCountryByIso2(destinationIso2);
  const attractions = getAttractionsForCountry(destinationIso2);
  const hotel = getAccommodationsForCountry(destinationIso2)[0];

  const estimatedHotelDaily = hotel ? hotel.pricePerNightUsd : 90;
  const estimatedFoodDaily = 35;
  const estimatedTransportDaily = 15;
  const dailyTotal = (estimatedHotelDaily + estimatedFoodDaily + estimatedTransportDaily) * travelersCount;

  const itinerary: TravelPlan['dailyItinerary'] = [];
  for (let d = 1; d <= Math.min(durationDays, 14); d++) {
    const dayAttractions = attractions.slice((d - 1) % attractions.length, (d % attractions.length) + 1).map(a => a.name);
    itinerary.push({
      day: d,
      title: d === 1 ? `Arrival in ${destCountry?.capital || 'Capital'} & Check-in` : `Day ${d}: ${destCountry?.commonName} Exploration`,
      attractions: dayAttractions.length ? dayAttractions : ['City Center & Local Heritage Walk'],
      estimatedCostUsd: Math.round(dailyTotal),
    });
  }

  const totalCost = Math.round(dailyTotal * durationDays + 250);

  return {
    id: `plan-${Date.now()}`,
    nationalityIso2,
    destinationIso2,
    purpose,
    durationDays,
    budgetUsd,
    travelersCount,
    dailyItinerary: itinerary,
    totalEstimatedCostUsd: totalCost,
  };
}

export function getHotelsForCountry(countryIso2: string): any[] {
  const accs = getAccommodationsForCountry(countryIso2);
  if (accs.length > 0) {
    return accs.map(a => ({
      id: a.id,
      name: a.name,
      city: a.cityName,
      rating: a.rating,
      pricePerNightUsd: a.pricePerNightUsd,
      amenities: ['Free WiFi', 'Air Conditioning', 'Breakfast Included'],
      bookingUrl: a.bookingUrl
    }));
  }
  return [
    {
      id: `hotel-${countryIso2}-1`,
      name: `Grand Central Hotel (${countryIso2})`,
      city: 'Capital City',
      rating: 4.7,
      pricePerNightUsd: 85,
      amenities: ['Free WiFi', 'City View', 'Breakfast Included'],
      bookingUrl: 'https://booking.com'
    }
  ];
}

export function generateItinerary(countryIso2: string, durationDays: number): any[] {
  const plan = generateTravelPlan('PK', countryIso2, 'TOURISM', durationDays);
  return plan.dailyItinerary.map(item => ({
    day: item.day,
    title: item.title,
    activities: item.attractions,
    estimatedCostUsd: item.estimatedCostUsd
  }));
}
