// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import path from "node:path";
import { GrowthContent } from "./GrowthContent";
import { STARTER_PLAN_URL, STARTER_PDF_URL } from "./StarterPlanPromo";

const root = path.resolve(import.meta.dirname, "../../..");
const pageSource = readFileSync(
  path.join(root, "client/public/7-day-starter.html"),
  "utf8"
);

function publicPage() {
  return new DOMParser().parseFromString(pageSource, "text/html");
}

describe("BTB seven-day starter launch", () => {
  it.each(["home", "start"] as const)(
    "offers the real starter page and ungated PDF on %s",
    page => {
      const html = renderToStaticMarkup(createElement(GrowthContent, { page }));
      const doc = new DOMParser().parseFromString(html, "text/html");
      expect(doc.querySelector(`a[href='${STARTER_PLAN_URL}']`)).not.toBeNull();
      expect(
        doc
          .querySelector(`a[href='${STARTER_PDF_URL}']`)
          ?.getAttribute("download")
      ).toBe("BTB-7-Day-Starter-Plan.pdf");
      expect(doc.body.textContent).toContain(
        "No account or email signup needed"
      );
      expect(doc.body.textContent).toContain("Build your first");
    }
  );

  it("serves the complete readable plan without an application shell or email gate", () => {
    const doc = publicPage();
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelectorAll("input[type=checkbox]")).toHaveLength(7);
    expect(doc.querySelectorAll("form, script, iframe")).toHaveLength(0);
    const content = doc.querySelector("#read-plan")!.textContent!;
    for (let day = 1; day <= 7; day++)
      expect(content).toContain(`Day ${day} —`);
    for (const text of [
      "Starter Strength Session",
      "equipment-light home route",
      "6–10",
      "60–90",
      "3–4 days",
      "165°F",
      "chest pain",
      "separate tools",
    ]) {
      expect(content.toLowerCase()).toContain(text.toLowerCase());
    }
    for (const anchor of Array.from(
      doc.querySelectorAll<HTMLAnchorElement>(".contents nav a")
    )) {
      expect(doc.querySelector(anchor.getAttribute("href")!)).not.toBeNull();
    }
    expect(doc.querySelectorAll(".references li")).toHaveLength(4);
    expect(
      doc.querySelectorAll(`a[href='${STARTER_PDF_URL}'][download]`)
    ).toHaveLength(2);
  });

  it("provides route-specific initial metadata and a real PDF binary", () => {
    const doc = publicPage();
    const canonical = "https://www.btbfitnessandhealth.com/7-day-starter";
    expect(doc.querySelector("link[rel=canonical]")?.getAttribute("href")).toBe(
      canonical
    );
    expect(
      doc.querySelector("meta[property='og:url']")?.getAttribute("content")
    ).toBe(canonical);
    expect(doc.title).toContain("Free BTB 7-Day Starter Plan");
    expect(
      doc.querySelector("meta[name='twitter:card']")?.getAttribute("content")
    ).toBe("summary_large_image");
    const pdf = readFileSync(
      path.join(root, "client/public/downloads/btb-7-day-starter-plan.pdf")
    );
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(10000);
  });
});
