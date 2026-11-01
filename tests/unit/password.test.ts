import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import {
  hashPassword,
  verifyPassword,
  verifyDummyPassword,
  isScryptHash,
  isBcryptHash,
} from "@/lib/password";

describe("Password Hashing & Non-Blocking Verification (crypto.scrypt)", () => {
  it("generates a versioned scrypt hash with calibrated parameters", async () => {
    const password = "SuperSecretPassword123!";
    const hash = await hashPassword(password);

    expect(isScryptHash(hash)).toBe(true);
    expect(isBcryptHash(hash)).toBe(false);

    const parts = hash.split("$");
    expect(parts[0]).toBe("scrypt");
    expect(parts[1]).toBe("16384"); // N
    expect(parts[2]).toBe("8"); // r
    expect(parts[3]).toBe("1"); // p
    expect(parts[4]).toHaveLength(32); // 16 bytes salt in hex
    expect(parts[5]).toHaveLength(128); // 64 bytes derived key in hex
  });

  it("verifies correct password and rejects invalid password with scrypt", async () => {
    const password = "ValidPassword456!";
    const hash = await hashPassword(password);

    const matchResult = await verifyPassword(password, hash);
    expect(matchResult.valid).toBe(true);
    expect(matchResult.needsUpgrade).toBe(false);

    const wrongResult = await verifyPassword("WrongPassword123!", hash);
    expect(wrongResult.valid).toBe(false);
    expect(wrongResult.needsUpgrade).toBe(false);
  });

  it("transparently verifies legacy bcrypt hashes and flags needsUpgrade: true", async () => {
    const password = "LegacyBcryptPassword789!";
    const legacyBcryptHash = await bcrypt.hash(password, 10);

    expect(isBcryptHash(legacyBcryptHash)).toBe(true);
    expect(isScryptHash(legacyBcryptHash)).toBe(false);

    const result = await verifyPassword(password, legacyBcryptHash);
    expect(result.valid).toBe(true);
    expect(result.needsUpgrade).toBe(true);

    const wrongResult = await verifyPassword(
      "WrongPassword!",
      legacyBcryptHash
    );
    expect(wrongResult.valid).toBe(false);
    expect(wrongResult.needsUpgrade).toBe(false);
  });

  it("handles dummy password verification safely without crashing", async () => {
    await expect(
      verifyDummyPassword("RandomNonExistentPassword")
    ).resolves.toBeUndefined();
  });

  it("does not block the JavaScript event loop during concurrent hashing", async () => {
    // Track event loop ticks while running 5 parallel scrypt hashes
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;
    }, 5);

    const hashes = await Promise.all([
      hashPassword("Password1A!"),
      hashPassword("Password2B!"),
      hashPassword("Password3C!"),
      hashPassword("Password4D!"),
      hashPassword("Password5E!"),
    ]);

    clearInterval(interval);

    expect(hashes).toHaveLength(5);
    // While scrypt runs on libuv thread pool, Node event loop timer should have fired multiple times
    expect(tickCount).toBeGreaterThanOrEqual(2);
  });
});
