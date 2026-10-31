import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockSignIn = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signOut: vi.fn(),
}));

describe("Authentication Forms Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("RegisterPage", () => {
    it("renders form with accessible labels and attributes", () => {
      render(<RegisterPage />);

      expect(
        screen.getByRole("heading", { name: /create an account/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up/i })
      ).toBeInTheDocument();
    });

    it("displays client-side validation errors for invalid inputs", async () => {
      render(<RegisterPage />);

      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "invalid-email" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "short" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(
          screen.getByText(/please provide a valid email/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe("LoginPage", () => {
    it("renders login form with accessible labels", () => {
      render(<LoginPage />);

      expect(
        screen.getByRole("heading", { name: /welcome back/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /log in/i })
      ).toBeInTheDocument();
    });

    it("displays client-side validation errors on empty submit", async () => {
      render(<LoginPage />);

      fireEvent.click(screen.getByRole("button", { name: /log in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/please provide a valid email/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it("submits credentials and renders generic error on failure", async () => {
      mockSignIn.mockResolvedValueOnce({ error: "CredentialsSignin" });

      render(<LoginPage />);

      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "user@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "secret123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /log in/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/invalid email or password/i)
        ).toBeInTheDocument();
      });
    });
  });
});
