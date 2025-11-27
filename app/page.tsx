import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center  font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-center">
        <div className="flex flex-col justify-center items-center">
          <Image
            className="dark:invert"
            src="/nada-logo.png"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />

          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            nada.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            social media so bad it's actually kinda good.
          </p>
        </div>
      </main>
    </div>
  );
}
