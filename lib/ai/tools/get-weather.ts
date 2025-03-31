import { tool } from 'ai';
import { z } from 'zod';

// Define the structure of geocoding API response
const GeocodingResponseSchema = z.array(
  z.object({
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
    country: z.string(),
    state: z.string().optional(),
  }),
);

type GeocodingResponse = z.infer<typeof GeocodingResponseSchema>;

/**
 * Convert a location string to latitude and longitude using OpenWeatherMap geocoding API
 */
async function geocodeLocation(location: string): Promise<{
  latitude: number;
  longitude: number;
  name: string;
  state?: string;
  country: string;
}> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    throw new Error('OPENWEATHERMAP_API_KEY environment variable is not set');
  }

  const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;

  const response = await fetch(geocodingUrl);

  if (!response.ok) {
    throw new Error(
      `Geocoding API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  // Validate the response
  const parsedData = GeocodingResponseSchema.safeParse(data);

  if (!parsedData.success || parsedData.data.length === 0) {
    throw new Error(`Location "${location}" not found`);
  }

  const { lat, lon, name, country, state } = parsedData.data[0];
  console.log('Parsed geocoding data:', parsedData.data);

  // Return individual components instead of formatted string
  return {
    latitude: lat,
    longitude: lon,
    name,
    state: state || undefined, // Ensure state is undefined rather than null or empty string
    country,
  };
}

export const getWeather = tool({
  description: 'Get the current weather and forecast for a location',
  parameters: z.object({
    location: z
      .string()
      .describe('The location to get weather for (city name, address, etc.)'),
  }),
  execute: async ({ location }) => {
    try {
      // Step 1: Convert location to coordinates
      const { latitude, longitude, name, state, country } =
        await geocodeLocation(location);

      // Format location name - ensure we only include state if it exists and isn't empty
      const locationName =
        state && state.trim() !== ''
          ? `${name}, ${state}, ${country}`
          : `${name}, ${country}`;

      // Step 2: Fetch weather data using the coordinates
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
      );

      if (!response.ok) {
        throw new Error(
          `Weather API error: ${response.status} ${response.statusText}`,
        );
      }

      const weatherData = await response.json();

      // Add location information to weather data - only include state if it exists
      const weatherWithLocation = {
        ...weatherData,
        locationName,
        locationDetails: {
          name,
          ...(state && state.trim() !== '' ? { state } : {}),
          country,
        },
      };

      console.log('Weather data:', weatherWithLocation);
      return weatherWithLocation;
    } catch (error) {
      console.error('Weather tool error:', error);
      throw new Error(
        `Failed to get weather: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
});
