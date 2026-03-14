'use server'

export async function fetchTrainsBetweenStations(fromCode: string, toCode: string, date: string) {
  // We use dateOfJourney which is standard for this specific RapidAPI
  const url = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${fromCode}&toStationCode=${toCode}&dateOfJourney=${date}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'irctc1.p.rapidapi.com',
        'x-rapidapi-key': 'f6198b796cmshc331cee2a4c851ap1ba569jsn9fef332e0cf4'
      },
      cache: 'no-store'
    });

    const result = await response.json();
    console.log("IRCTC API RAW RESPONSE:", result); // This helps us debug in Vercel logs

    // If the API returns success and an array of trains
    if (result && result.data && Array.isArray(result.data)) {
      return { success: true, trains: result.data, debug: null };
    }
    
    // If it returns a different format but still an array
    if (Array.isArray(result)) {
      return { success: true, trains: result, debug: null };
    }

    // If it failed, return the exact error message so we can fix it!
    return { success: false, trains: [], debug: JSON.stringify(result) };

  } catch (error: any) {
    console.error("Train API Error:", error);
    return { success: false, trains: [], debug: error.message };
  }
}