import { NextApiRequest, NextApiResponse } from 'next';
import { currentProfile } from '../../../lib/current-user'; // Import the server-side function
import { NextResponse } from 'next/server';


export async function GET(){
  try {
    const profile = await currentProfile();
    console.log(profile);

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    
  }
}
