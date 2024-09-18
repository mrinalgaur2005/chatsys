import Bot from "@/components/bot/bot";
import { currentProfile } from "@/lib/current-user";
import { initialProfile } from "@/lib/initial-profile";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {

  const intialProfile = await initialProfile();

  return(
    <Bot/>
  );
}
