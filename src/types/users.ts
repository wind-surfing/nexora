export interface Items {
  specialId: number;
  srcs: string[];
  title: string;
  description: string;
  price: number;
  badge: string;
  theme: string;
  requiredSignalGauge: number;
}

export interface User {
  username: string;
  currentSignalGauge: number;
  requiredSignalGauge: number;
  currentSignalLevel: number;
  lastSignalAt: Date;
  nexoins: number;
  ownedItems: {
    specialId: number;
    count: number;
  } | null;
}
