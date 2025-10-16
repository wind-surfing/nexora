export interface Items {
  specialId: string;
  srcs: string[];
  title: string;
  description: string;
  price: number;
  badge: string;
  theme: string;
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
