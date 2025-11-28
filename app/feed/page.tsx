"use client";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Feed() {
  const { isSignedIn, user } = useUser();

  console.log(user?.emailAddresses[0].emailAddress);

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1>sign in to access.</h1>
        <h1>or dont. probably better for you anyway.</h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1>this is your feed.</h1>
        <h1>boring? that's what we want.</h1>
        <div>
          <div className="p-4 m-4 border-2 border-zinc-700">
            <h3 className="font-bold">user</h3>
            <p>most days aren't interesting</p>
          </div>
        </div>
        <Button className="absolute bottom-10 right-10" variant="outline">
          post
        </Button>
      </div>
    </>
  );
}
