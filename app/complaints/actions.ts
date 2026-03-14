'use server'
import { appendSheetData } from '../../lib/google-sheets';

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