'use server'
import { appendSheetData, getSheetData } from '../../lib/google-sheets';

export async function submitComplaint(formData: FormData, deviceId: string) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string || ''; 
  
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

  // Notice we changed A:E to A:F to include the hidden deviceId
  const success = await appendSheetData('Complaints!A:F', [
    [timestamp, title, description, imageUrl, 'Pending', deviceId]
  ]);
  
  return { success };
}

export async function getComplaints(deviceId: string) {
  if (!deviceId) return [];
  
  // Read all data up to Column F
  const data = await getSheetData('Complaints!A2:F');
  
  // FILTER: Only keep rows where Column F (index 5) matches the user's Device ID
  const userComplaints = data.filter(row => row[5] === deviceId);
  
  // Reverse so newest is on top
  return userComplaints.reverse();
}