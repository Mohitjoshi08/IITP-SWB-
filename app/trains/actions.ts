'use server'

export async function fetchLiveTrains(stationCode: string) {
  // We ask the API for trains arriving in the next 4 hours
  const url = `https://irctc1.p.rapidapi.com/api/v3/getLiveStation?stationCode=${stationCode}&hours=4`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'irctc1.p.rapidapi.com',
        // Note: For now we put your key here so it works instantly. 
        // Later, we can move this to an environment variable for extra security!
        'x-rapidapi-key': 'f6198b796cmshc331cee2a4c851ap1ba569jsn9fef332e0cf4'
      },
      cache: 'no-store' // Never cache this! We want LIVE data every time.
    });

    const result = await response.json();

    // The API usually wraps the train list inside a "data" array
    if (result && result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  } catch (error) {
    console.error("Train API Error:", error);
    return null; // Return null if the API completely fails
  }
}