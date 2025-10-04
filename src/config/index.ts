export const credentials = [
  {
    username: "user",
    password: "password",
    coins: 30,
  },
  {
    username: "test123",
    password: "test123",
    coins: 30,
  },
  {
    username: process.env.NEXT_PUBLIC_ADMIN_USERNAME!,
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD!,
    secure: true,
    coins: 1000,
  },
];

export const defaultCardSetDataList = [
  {
    front: {
      term: "",
      src: "",
      alt: "",
    },
    back: {
      definition: "",
      src: "",
      alt: "",
    },
    hint: "",
    theme: "",
    category: "",
  },
  {
    front: {
      term: "",
      src: "",
      alt: "",
    },
    back: {
      definition: "",
      src: "",
      alt: "",
    },
    hint: "",
    theme: "",
    category: "",
  },
];
