"use client";

import React from "react";
import { motion } from "framer-motion";

function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full relative overflow-hidden">
      <div className="relative flex flex-col items-center justify-end w-40 h-[400px] rounded-b-3xl border-2 border-primary bg-gradient-to-t from-[#001233] via-[#003366] to-[#0055ff] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a33] via-transparent to-transparent opacity-60">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `50%` }}
            transition={{ type: "spring", stiffness: 80 }}
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0099ff] via-[#00ccff] to-[#66ffff] rounded-t-full"
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
                  height: `calc(50% - 10%)`,
                }}
              ></motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
