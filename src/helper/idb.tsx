interface UserCredentials {
  isAuthenticated: boolean;
  username: string;
  password: string;
  nexoins: number;
}

const DB_NAME = "NexoraDB";
const DB_VERSION = 1;
const STORE_NAME = "credentials";

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
