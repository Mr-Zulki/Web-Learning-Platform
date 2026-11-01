import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export interface PasswordVerificationResult {
  valid: boolean;
  needsUpgrade: boolean;
}

// Scrypt tuning parameters calibrated for 80-150ms execution on this platform
export const SCRYPT_CONFIG = {
  N: 16384, // CPU/memory cost parameter (power of 2)
  r: 8, // Block size parameter
  p: 1, // Parallelization parameter
  keyLength: 64, // Output key length in bytes
  saltLength: 16, // Salt length in bytes
  maxmem: 32 * 1024 * 1024, // 32MB max memory
};

// Pre-generated dummy hash for constant-time evaluation on non-existent users
export const DUMMY_SCRYPT_HASH =
  "scrypt$16384$8$1$6b3f9c0e2a4d7b1a8f5c3e0b9d8a7c6f$9a4b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b";

/**
 * Checks if a string conforms to the versioned scrypt format:
 * scrypt$N$r$p$saltHex$derivedKeyHex
 */
export function isScryptHash(hash: string): boolean {
  if (typeof hash !== "string") return false;
  const parts = hash.split("$");
  return parts.length === 6 && parts[0] === "scrypt";
}

/**
 * Checks if a string conforms to modular bcrypt formatting ($2a$, $2b$, $2y$)
 */
export function isBcryptHash(hash: string): boolean {
  if (typeof hash !== "string") return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash);
}

/**
 * Asynchronously hashes a password using Node.js crypto.scrypt off the main event loop
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SCRYPT_CONFIG.saltLength);

  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      SCRYPT_CONFIG.keyLength,
      {
        N: SCRYPT_CONFIG.N,
        r: SCRYPT_CONFIG.r,
        p: SCRYPT_CONFIG.p,
        maxmem: SCRYPT_CONFIG.maxmem,
      },
      (err, derivedKey) => {
        if (err) return reject(err);
        const hashStr = `scrypt$${SCRYPT_CONFIG.N}$${SCRYPT_CONFIG.r}$${
          SCRYPT_CONFIG.p
        }$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
        resolve(hashStr);
      }
    );
  });
}

/**
 * Verifies a plaintext password against a stored hash (supporting both new scrypt and legacy bcrypt).
 * Returns { valid: boolean, needsUpgrade: boolean }.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<PasswordVerificationResult> {
  if (!storedHash || typeof storedHash !== "string") {
    return { valid: false, needsUpgrade: false };
  }

  // 1. Scrypt verification path
  if (isScryptHash(storedHash)) {
    const parts = storedHash.split("$");
    const N = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    const saltHex = parts[4];
    const expectedHashHex = parts[5];

    if (!saltHex || !expectedHashHex || Number.isNaN(N)) {
      return { valid: false, needsUpgrade: false };
    }

    const salt = Buffer.from(saltHex, "hex");
    const expectedKey = Buffer.from(expectedHashHex, "hex");

    return new Promise((resolve) => {
      crypto.scrypt(
        password,
        salt,
        expectedKey.length,
        { N, r, p, maxmem: SCRYPT_CONFIG.maxmem },
        (err, derivedKey) => {
          if (err) {
            return resolve({ valid: false, needsUpgrade: false });
          }

          if (derivedKey.length !== expectedKey.length) {
            return resolve({ valid: false, needsUpgrade: false });
          }

          const match = crypto.timingSafeEqual(derivedKey, expectedKey);
          resolve({ valid: match, needsUpgrade: false });
        }
      );
    });
  }

  // 2. Legacy bcrypt verification path
  if (isBcryptHash(storedHash)) {
    try {
      const match = await bcrypt.compare(password, storedHash);
      return { valid: match, needsUpgrade: match };
    } catch {
      return { valid: false, needsUpgrade: false };
    }
  }

  return { valid: false, needsUpgrade: false };
}

/**
 * Executes a constant-time dummy scrypt verification to prevent email timing enumeration
 */
export async function verifyDummyPassword(password: string): Promise<void> {
  await verifyPassword(password, DUMMY_SCRYPT_HASH);
}
