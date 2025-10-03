import Button from "@/components/shared/Button";
import InputField from "@/components/shared/InputField";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LockIcon, Mail, UserIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

function page() {
  return (
    <>
      <main className="flex flex-row items-center justify-between w-full h-[calc(100vh-76px)]">
        <section className="flex flex-col items-center justify-center w-1/2 h-full gap-6">
          <article className="w-3/4 flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl text-center">
              Please use the dummy credentials to login
            </h1>
            <Separator />
            <ol>
              <li className="flex flex-col items-start justify-center">
                <span>
                  <span className="text-primary">Username: </span>
                  <span>user</span>
                </span>
                <span>
                  <span className="text-primary">Password: </span>
                  <span>password</span>
                </span>
              </li>
            </ol>
          </article>
        </section>
        <section className="flex flex-col items-center justify-center w-1/2 h-full gap-6">
          <form
            action=""
            className="w-3/4 flex flex-col items-center justify-center gap-4"
          >
            <h1 className="text-4xl text-center">Login</h1>
            <div className="flex flex-col items-center justify-center w-full">
              <InputField
                icon={<UserIcon />}
                name="name"
                type="text"
                placeholder="Name"
                className="w-full"
              />
              <InputField
                icon={<LockIcon />}
                name="password"
                type="password"
                placeholder="Password"
                className="w-full"
              />
              <Button
                title="Login"
                type="submit"
                containerClass="w-full"
              ></Button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
export default page;
