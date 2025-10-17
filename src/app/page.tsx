"use client";

import Button from "@/components/shared/Button";
import Loader from "@/components/shared/Loader";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  if (user.currentSignalLevel) {
    router.push("/home");
    return <Loader />;
  }

  return (
    <>
      <main className="flex flex-row items-center justify-between w-full h-[calc(100vh-76px)] px-4">
        <section className="flex flex-col items-center justify-center w-1/2 h-full gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-8xl font-black text-primary">
              Nex
              <span className="bg-gradient-to-br from-primary to-destructive bg-clip-text text-transparent">
                ora
              </span>
            </h1>
            <h2 className="text-4xl font-semibold text-center">
              <span className="font-light">The</span>{" "}
              <span className="bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent font-extrabold">
                Gateway
              </span>{" "}
              <span className="font-light">to make your</span>{" "}
              <span className="bg-gradient-to-br from-primary to-destructive/80 bg-clip-text text-transparent font-extrabold">
                studies
              </span>{" "}
              <span className="font-normal">easy.</span>
            </h2>
          </div>
          <Button href="/login" title="Get Started"></Button>
        </section>
        <figure className="w-1/2 h-full">
          <Image
            src="/nexora.svg"
            width={500}
            height={500}
            alt="Nexora"
            className="object-cover w-full h-full"
          />
        </figure>
      </main>
    </>
  );
}
