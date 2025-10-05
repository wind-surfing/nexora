import { Card } from "@/types/cards";

interface UserCredentials {
  isAuthenticated: boolean;
  username: string;
  password: string;
  nexoins: number;
}

interface CompoundCard {
  id: string;
  idea: string;
  description: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

interface StoredImage {
  id: string;
  name: string;
  data: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

const DB_NAME = "NexoraDB";
const DB_VERSION = 2;
const STORE_NAME = "credentials";
const COMPOUND_CARDS_STORE = "compoundCards";
const IMAGES_STORE = "images";

const hashPassword = async (password: string): Promise<string> => {
  const salt = process.env.NEXT_PUBLIC_SALT || "nexora-secret-salt-2025";
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("username", "username", { unique: false });
      }

      if (!db.objectStoreNames.contains(COMPOUND_CARDS_STORE)) {
        const compoundStore = db.createObjectStore(COMPOUND_CARDS_STORE, {
          keyPath: "id",
        });
        compoundStore.createIndex("idea", "idea", { unique: false });
        compoundStore.createIndex("category", "category", { unique: false });
        compoundStore.createIndex("numberOfCards", "numberOfCards", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        const imageStore = db.createObjectStore(IMAGES_STORE, {
          keyPath: "id",
        });
        imageStore.createIndex("name", "name", { unique: false });
      }
    };
  });
};

export const storeCredentials = async (
  credentials: Omit<UserCredentials, "password"> & { password: string }
): Promise<boolean> => {
  try {
    const db = await initDB();

    const hashedPassword = await hashPassword(credentials.password);

    const credentialsToStore: UserCredentials & { id: string } = {
      id: "user_credentials",
      isAuthenticated: credentials.isAuthenticated,
      username: credentials.username,
      password: hashedPassword,
      nexoins: credentials.nexoins,
    };

    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put(credentialsToStore);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        resolve(true);
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to store credentials"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error storing credentials:", error);
    return false;
  }
};

export const getCredentials = async (): Promise<UserCredentials | null> => {
  try {
    const db = await initDB();

    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("user_credentials");

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        const result = request.result;

        if (result) {
          const credentials = {
            isAuthenticated: result.isAuthenticated,
            username: result.username,
            password: result.password,
            nexoins: result.nexoins,
          };
          resolve(credentials as UserCredentials);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to retrieve credentials"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error retrieving credentials:", error);
    return null;
  }
};

export const clearCredentials = async (): Promise<boolean> => {
  try {
    const db = await initDB();

    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete("user_credentials");

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        resolve(true);
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to clear credentials"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error clearing credentials:", error);
    return false;
  }
};

export const updateCurrentUser = async (
  updatesOrNexoins:
    | number
    | (Partial<Omit<UserCredentials, "password">> & { password?: string })
): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("user_credentials");

    return new Promise((resolve, reject) => {
      request.onsuccess = async () => {
        const existingCredentials = request.result;
        if (!existingCredentials) {
          db.close();
          reject(new Error("No user credentials found to update."));
          return;
        }

        let updatedData: typeof existingCredentials;

        if (typeof updatesOrNexoins === "number") {
          const currentNexoins = existingCredentials.nexoins || 0;
          updatedData = {
            ...existingCredentials,
            nexoins: currentNexoins + updatesOrNexoins,
          };
        } else {
          updatedData = { ...existingCredentials, ...updatesOrNexoins };

          if (updatesOrNexoins.password) {
            updatedData.password = await hashPassword(
              updatesOrNexoins.password
            );
          }
        }

        const putRequest = store.put(updatedData);
        putRequest.onsuccess = () => {
          db.close();
          resolve(true);
        };
        putRequest.onerror = () => {
          db.close();
          reject(new Error("Failed to save updated credentials."));
        };
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to retrieve user for update."));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed during update."));
      };
    });
  } catch (error) {
    console.error("Error updating current user:", error);
    return false;
  }
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const storeCompoundCard = async (
  compoundCardData: Omit<CompoundCard, "id" | "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const db = await initDB();
    const id = generateId();
    const now = new Date();

    const compoundCard: CompoundCard = {
      id,
      ...compoundCardData,
      createdAt: now,
      updatedAt: now,
    };

    const transaction = db.transaction([COMPOUND_CARDS_STORE], "readwrite");
    const store = transaction.objectStore(COMPOUND_CARDS_STORE);
    const request = store.add(compoundCard);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        resolve(id);
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to store compound card"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error storing compound card:", error);
    return null;
  }
};

export const updateCompoundCard = async (
  id: string,
  updates: Partial<Omit<CompoundCard, "id" | "createdAt" | "updatedAt">>
): Promise<boolean> => {
  try {
    const db = await initDB();

    const transaction = db.transaction([COMPOUND_CARDS_STORE], "readwrite");
    const store = transaction.objectStore(COMPOUND_CARDS_STORE);

    const getRequest = store.get(id);

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const existingCard = getRequest.result;

        if (!existingCard) {
          db.close();
          resolve(false);
          return;
        }

        const updatedCard: CompoundCard = {
          ...existingCard,
          ...updates,
          updatedAt: new Date(),
        };

        const putRequest = store.put(updatedCard);

        putRequest.onsuccess = () => {
          db.close();
          resolve(true);
        };

        putRequest.onerror = () => {
          db.close();
          reject(new Error("Failed to update compound card"));
        };
      };

      getRequest.onerror = () => {
        db.close();
        reject(new Error("Failed to get compound card"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error updating compound card:", error);
    return false;
  }
};

export const getCompoundCards = async (criteria?: {
  id?: string;
  idea?: string;
  numberOfRequiredCards?: number;
  category?: string;
}): Promise<CompoundCard[]> => {
  try {
    const db = await initDB();

    const transaction = db.transaction([COMPOUND_CARDS_STORE], "readonly");
    const store = transaction.objectStore(COMPOUND_CARDS_STORE);

    return new Promise((resolve, reject) => {
      if (criteria?.id) {
        const request = store.get(criteria.id);

        request.onsuccess = () => {
          db.close();
          const result = request.result;
          resolve(result ? [result] : []);
        };

        request.onerror = () => {
          db.close();
          reject(new Error("Failed to get compound card by ID"));
        };
        return;
      }

      const request = store.getAll();

      request.onsuccess = () => {
        db.close();
        let results = request.result || [];

        if (criteria?.idea) {
          results = results.filter((card) =>
            card.idea.toLowerCase().includes(criteria.idea!.toLowerCase())
          );
        }

        if (criteria?.category) {
          results = results.filter(
            (card) =>
              card.category.toLowerCase() === criteria.category!.toLowerCase()
          );
        }

        if (criteria?.numberOfRequiredCards !== undefined) {
          results = results.filter(
            (card) => card.cards.length === criteria.numberOfRequiredCards
          );
        }

        resolve(results);
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to get compound cards"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error retrieving compound cards:", error);
    return [];
  }
};

export const deleteCompoundCards = async (criteria: {
  id?: string;
  idea?: string;
  numberOfRequiredCards?: number;
  category?: string;
  all?: boolean;
}): Promise<number> => {
  try {
    const db = await initDB();

    const transaction = db.transaction([COMPOUND_CARDS_STORE], "readwrite");
    const store = transaction.objectStore(COMPOUND_CARDS_STORE);

    return new Promise((resolve, reject) => {
      if (criteria.all) {
        const request = store.clear();

        request.onsuccess = () => {
          db.close();
          resolve(-1);
        };

        request.onerror = () => {
          db.close();
          reject(new Error("Failed to delete all compound cards"));
        };
        return;
      }

      if (criteria.id) {
        const request = store.delete(criteria.id);

        request.onsuccess = () => {
          db.close();
          resolve(1);
        };

        request.onerror = () => {
          db.close();
          reject(new Error("Failed to delete compound card by ID"));
        };
        return;
      }

      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        let toDelete = getAllRequest.result || [];

        if (criteria.idea) {
          toDelete = toDelete.filter((card) =>
            card.idea.toLowerCase().includes(criteria.idea!.toLowerCase())
          );
        }

        if (criteria.category) {
          toDelete = toDelete.filter(
            (card) =>
              card.category.toLowerCase() === criteria.category!.toLowerCase()
          );
        }

        if (criteria.numberOfRequiredCards !== undefined) {
          toDelete = toDelete.filter(
            (card) => card.cards.length === criteria.numberOfRequiredCards
          );
        }

        let deletedCount = 0;
        let completed = 0;
        const totalToDelete = toDelete.length;

        if (totalToDelete === 0) {
          db.close();
          resolve(0);
          return;
        }

        toDelete.forEach((card) => {
          const deleteRequest = store.delete(card.id);

          deleteRequest.onsuccess = () => {
            deletedCount++;
            completed++;

            if (completed === totalToDelete) {
              db.close();
              resolve(deletedCount);
            }
          };

          deleteRequest.onerror = () => {
            completed++;

            if (completed === totalToDelete) {
              db.close();
              resolve(deletedCount);
            }
          };
        });
      };

      getAllRequest.onerror = () => {
        db.close();
        reject(new Error("Failed to get compound cards for deletion"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error deleting compound cards:", error);
    return 0;
  }
};

export const storeImage = async (file: File): Promise<string | null> => {
  try {
    const db = await initDB();

    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

    const id = generateId();
    const storedImage: StoredImage = {
      id,
      name: file.name,
      data: base64Data,
      mimeType: file.type,
      size: file.size,
      createdAt: new Date(),
    };

    const transaction = db.transaction([IMAGES_STORE], "readwrite");
    const store = transaction.objectStore(IMAGES_STORE);
    const request = store.add(storedImage);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        const pathSlug = `/**idb**/${id}`;
        resolve(pathSlug);
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to store image"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error storing image:", error);
    return null;
  }
};

export interface ImageResponse {
  url: string | Blob;
  name: string;
}

export const getImageByPath = async (
  pathSlug: string,
  formatChange?: "blob" | "dataUrl" | "base64" | "path"
): Promise<ImageResponse | null> => {
  try {
    const id = pathSlug.replace("/**idb**/", "");

    const db = await initDB();

    const transaction = db.transaction([IMAGES_STORE], "readonly");
    const store = transaction.objectStore(IMAGES_STORE);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        const result = request.result as StoredImage;

        if (!result) {
          resolve(null);
          return;
        }

        let url: string | Blob;
        switch (formatChange) {
          case "blob":
            const byteCharacters = atob(result.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            url = new Blob([byteArray], { type: result.mimeType });
            break;

          case "dataUrl":
            url = `data:${result.mimeType};base64,${result.data}`;
            break;

          case "path":
            url = `/**idb**/${result.id}`;
            break;

          case "base64":
          default:
            url = result.data;
        }
        resolve({
          url,
          name: result.name,
        });
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to retrieve image"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error retrieving image:", error);
    return null;
  }
};

export const deleteImage = async (pathSlug: string): Promise<boolean> => {
  try {
    const id = pathSlug.replace("/**idb**/", "");

    const db = await initDB();

    const transaction = db.transaction([IMAGES_STORE], "readwrite");
    const store = transaction.objectStore(IMAGES_STORE);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        resolve(true);
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to delete image"));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed"));
      };
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};

export const getAllImages = async (
  count: number = 10,
  format: "blob" | "dataUrl" | "base64" | "path" = "dataUrl"
): Promise<ImageResponse[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([IMAGES_STORE], "readonly");
    const store = transaction.objectStore(IMAGES_STORE);
    const request = store.getAll(null, count === -1 ? undefined : count);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        const results = request.result as StoredImage[];
        if (!results) {
          resolve([]);
          return;
        }

        const formattedImages = results.map((result) => {
          let url: string | Blob;
          switch (format) {
            case "blob":
              const byteCharacters = atob(result.data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              url = new Blob([byteArray], { type: result.mimeType });
              break;
            case "dataUrl":
              url = `data:${result.mimeType};base64,${result.data}`;
              break;
            case "path":
              url = `/**idb**/${result.id}`;
              break;
            case "base64":
            default:
              url = result.data;
          }
          return {
            url,
            name: result.name,
          };
        });
        resolve(formattedImages);
      };

      request.onerror = () => {
        db.close();
        reject(new Error("Failed to retrieve all images."));
      };

      transaction.onerror = () => {
        db.close();
        reject(new Error("Transaction failed while getting all images."));
      };
    });
  } catch (error) {
    console.error("Error retrieving all images:", error);
    return [];
  }
};
