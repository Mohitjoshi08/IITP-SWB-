'use server'
import { appendSheetData, getSheetData } from '../../lib/google-sheets';

// 1. Function to Submit a new complaint
export async function submitComplaint(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string || ''; 
  
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

  const success = await appendSheetData('Complaints!A:E', [
    [timestamp, title, description, imageUrl, 'Pending']
  ]);
  
  return { success };
}

// 2. NEW Function to Read previous complaints
export async function getComplaints() {
  const data = await getSheetData('Complaints!A2:E');
  // Reverse it so the newest complaints show up at the top!
  return data.reverse();
}