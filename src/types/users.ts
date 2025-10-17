import { IconType } from "react-icons/lib";

export interface Items {
  specialId: string;
  srcs: string[];
  title: string;
  description: string;
  price: number;
  badge: string;
  theme: string;
  icon: IconType;
  requiredSignalLevel: number;
}

export interface User {
  username: string;
  currentSignalGauge: number;
  requiredSignalGauge: number;
  currentSignalLevel: number;
  lastSignalAt: Date;
  nexoins: number;
  ownedItems: {
    [specialId: string]: number;
  };
}
