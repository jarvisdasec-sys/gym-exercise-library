import { expect, it } from "vitest";
import { growthLinkTarget } from "./trafficLink";

it("classifies the beginner funnel without collecting arbitrary URLs", () => {
  expect(growthLinkTarget("/7-day-starter")).toBe("starter_plan");
  expect(growthLinkTarget("/downloads/btb-7-day-starter-plan.pdf")).toBe("starter_pdf");
  expect(growthLinkTarget("/e/barbell-bent-over-row")).toBe("exercise_guide");
  expect(growthLinkTarget("/account?email=private")).toBeNull();
  expect(growthLinkTarget("https://other.example/")).toBeNull();
  expect(growthLinkTarget("/e/private%40example.com")).toBeNull();
});