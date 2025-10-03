"use client";

import Button from "@/components/shared/Button";
import InputField from "@/components/shared/InputField";
import { Separator } from "@/components/ui/separator";
import { credentials } from "@/config";
import { storeCredentials } from "@/helper/idb";
import { LockIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";


function Page() {
  const [data, setData] = React.useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });
  const router = useRouter();

  const handleChange = (value: string, field: "username" | "password") => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const credentialInfo = credentials.find(
      (cred) =>
        cred.username === data.username && cred.password === data.password
    );

    if (credentialInfo) {
      await storeCredentials({
        isAuthenticated: true,
        username: credentialInfo?.username,
        password: credentialInfo?.password,
        nexoins: credentialInfo?.coins || 0,
      })
      toast.success("Login successful!");
      router.push("/home");
    } else {
      toast.error("Invalid credentials!");
    }
  };

  return (
    <>
      <main className="flex flex-row items-center justify-between w-full h-[calc(100vh-76px)]">
        <section className="flex flex-col items-center justify-center w-1/2 h-full gap-6">
          <article className="w-3/4 flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl text-center">
              Please use the dummy credentials to login
            </h1>
            <Separator />
            <ol className="flex flex-col w-full gap-2 list-inside list-decimal">
              {credentials.map((cred, index) => {
                if (cred.secure) {
                  return null;
                }
                return (
                  <li
                    key={index}
                    className="flex flex-row items-start justify-between bg-muted p-4 rounded-lg"
                  >
                    <div className="flex flex-col items-start justify-center">
                      <span>
                        <span className="text-primary">Username: </span>
                        <span>{cred.username}</span>
                      </span>
                      <span>
                        <span className="text-primary">Password: </span>
                        <span>{cred.password}</span>
                      </span>
                    </div>
                    <Button
                      onClick={() =>
                        setData({
                          username: cred.username,
                          password: cred.password,
                        })
                      }
                      title="Use This"
                    ></Button>
                  </li>
                );
              })}
            </ol>
          </article>
        </section>
        <section className="flex flex-col items-center justify-center w-1/2 h-full gap-6">
          <form
            onSubmit={handleSubmit}
            className="w-3/4 flex flex-col items-center justify-center gap-4"
          >
            <h1 className="text-4xl text-center">Login</h1>
            <div className="flex flex-col items-center justify-center w-full">
              <InputField
                icon={<UserIcon />}
                name="name"
                type="text"
                placeholder="Name"
                value={data.username}
                onChange={(value) => handleChange(value, "username")}
                className="w-full"
              />
              <InputField
                icon={<LockIcon />}
                name="password"
                type="password"
                closeOption
                placeholder="Password"
                value={data.password}
                onChange={(value) => handleChange(value, "password")}
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
export default Page;
