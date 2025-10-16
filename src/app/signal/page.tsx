"use client";

import React from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import Button from "@/components/shared/Button";

function Page() {
  const {
    user: { currentSignalLevel, currentSignalGauge, requiredSignalGauge },
    updateUser,
  } = useUser();

  console.log(currentSignalGauge, requiredSignalGauge);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full relative overflow-hidden">
      <div className="relative flex flex-col items-center justify-end w-40 h-[400px] rounded-b-3xl border-2 border-primary bg-gradient-to-t from-[#001233] via-[#003366] to-[#0055ff] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a33] via-transparent to-transparent opacity-60">
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: `${(currentSignalGauge / requiredSignalGauge) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 80 }}
            className={cn(
              "absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0099ff] via-[#00ccff] to-[#66ffff]",
              currentSignalGauge >= requiredSignalGauge
                ? "rounded-none animate-pulse"
                : "rounded-t-full"
            )}
          ></motion.div>
          <div className="absolute bottom-0 left-0 w-full h-full flex flex-col justify-end">
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: [-10, -60, -10] }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute bottom-0 left-1/2 w-[2px] h-[40px] bg-primary rounded-full blur-sm"
                style={{
                  left: `${20 + index * 10}%`,
                  height: `calc(${
                    (currentSignalGauge / requiredSignalGauge) * 100
                  }% - 10%)`,
                }}
              ></motion.div>
            ))}
          </div>

          <div className="absolute inset-0 flex justify-center">
            <div className="w-[2px] bg-gradient-to-t from-blue-200 via-blue-500 to-transparent blur-[1px]"></div>
          </div>

          {currentSignalGauge / requiredSignalGauge >= 0.3 ? (
            <motion.div
              className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-start z-10 text-white"
              initial={{ height: 0 }}
              animate={{
                height: `calc(${
                  (currentSignalGauge / requiredSignalGauge) * 100
                }% - 10%)`,
              }}
              transition={{ type: "spring", stiffness: 80, delay: 0.5 }}
            >
              <h1 className="text-5xl font-black tracking-wider">
                {currentSignalGauge.toFixed(0)}
              </h1>
              <h1 className="text-xl tracking-wider">
                /{requiredSignalGauge.toFixed(0)}
              </h1>
            </motion.div>
          ) : (
            <motion.div
              className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center z-10 text-white"
              initial={{ height: 0 }}
              animate={{ height: `100%` }}
              transition={{ type: "spring", stiffness: 80, delay: 0.5 }}
            >
              <h1 className="text-5xl font-black tracking-wider">
                {currentSignalGauge.toFixed(0)}
              </h1>
              <h1 className="text-xl tracking-wider">
                /{requiredSignalGauge.toFixed(0)}
              </h1>
            </motion.div>
          )}

          {currentSignalGauge >= requiredSignalGauge && (
            <motion.div
              className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center z-10 text-white"
              initial={{ height: 0 }}
              animate={{
                height: `100%`,
              }}
              transition={{ type: "spring", stiffness: 80, delay: 0.5 }}
            >
              <Button
                onClick={() => {
                  updateUser({
                    currentSignalLevel: currentSignalLevel + 1,
                    currentSignalGauge: 0,
                    requiredSignalGauge: +Math.floor(
                      10 * Math.pow(currentSignalLevel, 1.5)
                    ).toFixed(2),
                  });
                }}
                containerClass="bg-transparent text-white"
                title="Level Up"
              ></Button>
            </motion.div>
          )}
        </div>
      </div>
      <div className="mt-6 text-3xl font-bold text-primary drop-shadow-[0_0_10px_#FFD700] tracking-wider">
        LEVEL {currentSignalLevel}
      </div>
    </div>
  );
}

export default Page;
