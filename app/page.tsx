import Bot from "@/components/bot/bot";

import { initialProfile } from "@/lib/initial-profile";

export default async function Home() {

  const intialProfile = await initialProfile();

  return(
    <Bot/>
  );
}
