'use server'

export async function fetchTrainsBetweenStations(fromCode: string, toCode: string, date: string) {
  // date format must be YYYY-MM-DD
  const url = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${fromCode}&toStationCode=${toCode}&date=${date}`;
  
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

    if (result && result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  } catch (error) {
    console.error("Train API Error:", error);
    return null;
  }
}