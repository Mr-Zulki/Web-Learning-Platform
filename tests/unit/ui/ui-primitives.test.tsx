import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React, { useState } from "react";
import {
  Button,
  IconButton,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Label,
  FieldError,
  Tabs,
  ProgressBar,
  ProgressRing,
  Skeleton,
  Toast,
  Modal,
  Kbd,
  SectionHeading,
} from "@/components/ui";

describe("UI Primitives Unit Tests", () => {
  describe("Button & IconButton", () => {
    it("renders button with correct text and handles click", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const btn = screen.getByRole("button", { name: "Click Me" });
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disables button and displays spinner when isLoading is true", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Submit
        </Button>
      );
      const btn = screen.getByRole("button", { name: /Submit/i });
      expect(btn).toBeDisabled();
      expect(screen.getByRole("status")).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("renders IconButton with accessible name", () => {
      const handleClick = vi.fn();
      render(
        <IconButton aria-label="Settings" onClick={handleClick}>
          <span>⚙</span>
        </IconButton>
      );
      const btn = screen.getByRole("button", { name: "Settings" });
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Card", () => {
    it("renders card with header, title, content, and footer", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>Card body content</CardContent>
          <CardFooter>Card footer action</CardFooter>
        </Card>
      );
      expect(
        screen.getByRole("heading", { name: "Test Card" })
      ).toBeInTheDocument();
      expect(screen.getByText("Card body content")).toBeInTheDocument();
      expect(screen.getByText("Card footer action")).toBeInTheDocument();
    });
  });

  describe("Badge", () => {
    it("renders with variant and dot", () => {
      render(
        <Badge variant="success" dot>
          Active
        </Badge>
      );
      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });

  describe("Form Controls (Input, Label, FieldError)", () => {
    it("renders label with required indicator", () => {
      render(
        <Label htmlFor="test-input" required>
          Email Address
        </Label>
      );
      expect(screen.getByText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders input with error state and aria-invalid", () => {
      render(<Input id="test-input" error placeholder="Enter email" />);
      const input = screen.getByPlaceholderText("Enter email");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("renders FieldError with alert role when error is present", () => {
      render(<FieldError error="Invalid email address" />);
      const errorMsg = screen.getByRole("alert");
      expect(errorMsg).toHaveTextContent("Invalid email address");
    });
  });

  describe("Tabs", () => {
    function TabsWrapper() {
      const [active, setActive] = useState("tab1");
      return (
        <Tabs
          tabs={[
            { id: "tab1", label: "Tab One" },
            { id: "tab2", label: "Tab Two" },
            { id: "tab3", label: "Tab Three" },
          ]}
          activeTab={active}
          onChange={setActive}
        />
      );
    }

    it("renders tablist with correct roles and supports keyboard navigation", () => {
      render(<TabsWrapper />);
      const tablist = screen.getByRole("tablist");
      expect(tablist).toBeInTheDocument();

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");

      // Press ArrowRight to move to next tab
      fireEvent.keyDown(tabs[0]!, { key: "ArrowRight" });
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");

      // Press ArrowLeft to return
      fireEvent.keyDown(tabs[1]!, { key: "ArrowLeft" });
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");

      // Press End to jump to last
      fireEvent.keyDown(tabs[0]!, { key: "End" });
      expect(tabs[2]).toHaveAttribute("aria-selected", "true");

      // Press Home to jump to first
      fireEvent.keyDown(tabs[2]!, { key: "Home" });
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("ProgressBar and ProgressRing", () => {
    it("renders ProgressBar with accessible attributes", () => {
      render(<ProgressBar value={40} max={100} showLabel />);
      const progress = screen.getByRole("progressbar");
      expect(progress).toHaveAttribute("aria-valuenow", "40");
      expect(progress).toHaveAttribute("aria-valuemax", "100");
      expect(screen.getByText("40%")).toBeInTheDocument();
    });

    it("renders ProgressRing with accessible attributes", () => {
      render(<ProgressRing value={75} max={100} />);
      const ring = screen.getByRole("progressbar");
      expect(ring).toHaveAttribute("aria-valuenow", "75");
      expect(screen.getByText("75%")).toBeInTheDocument();
    });
  });

  describe("Skeleton, Toast, Modal, Kbd, SectionHeading", () => {
    it("renders Skeleton with aria-hidden", () => {
      const { container } = render(<Skeleton className="h-4 w-20" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    it("renders Toast with status role and polite announcement", () => {
      render(
        <Toast type="success" title="Success!" message="Operation completed" />
      );
      const toast = screen.getByRole("status");
      expect(toast).toHaveAttribute("aria-live", "polite");
      expect(screen.getByText("Success!")).toBeInTheDocument();
    });

    it("renders Modal when open and handles escape key", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <p>Modal Content</p>
        </Modal>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Modal Content")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("renders Kbd and SectionHeading", () => {
      render(
        <div>
          <SectionHeading
            badge="Learn"
            title="My Section"
            description="Section desc"
          />
          <Kbd>Ctrl</Kbd>
        </div>
      );
      expect(screen.getByText("Learn")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "My Section" })
      ).toBeInTheDocument();
      expect(screen.getByText("Ctrl")).toBeInTheDocument();
    });
  });
});
