export const STARTER_PLAN_URL = "/7-day-starter";
export const STARTER_PDF_URL = "/downloads/btb-7-day-starter-plan.pdf";

export function StarterPlanPromo() {
  return (
    <section className="growth-section" aria-labelledby="btb-starter-title">
      <div className="growth-wrap growth-split">
        <div>
          <p className="growth-kicker">FREE / BTB 7-DAY STARTER PLAN</p>
          <h2 id="btb-starter-title">
            Build your first
            <br />
            <em>consistent week.</em>
          </h2>
          <p className="growth-lead">
            One manageable step each day: simple training, meal prep, recovery,
            and a schedule you can repeat. Includes gym and equipment-light home
            options, a checklist, and spaces to plan your next week.
          </p>
          <div className="growth-actions">
            <a className="growth-action" href={STARTER_PLAN_URL}>
              Open the free 7-day plan <span aria-hidden="true">→</span>
            </a>
            <a
              className="growth-secondary"
              href={STARTER_PDF_URL}
              download="BTB-7-Day-Starter-Plan.pdf"
            >
              Download the PDF <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="growth-fine">
            No account or email signup needed. General education—not a
            personalized medical, training, or dietary prescription.
          </p>
        </div>
        <div className="growth-paper">
          <span className="growth-kicker">START SMALL / REPEAT WHAT WORKS</span>
          <h3>Your week, one step at a time.</h3>
          <ol>
            <li>Day 1 — Make a manageable plan.</li>
            <li>Day 2 — Practice your first strength session.</li>
            <li>Day 3 — Prepare one repeatable meal.</li>
            <li>Day 4 — Recover at your own pace.</li>
            <li>Day 5 — Repeat or appropriately reschedule strength.</li>
            <li>Day 6 — Choose movement you enjoy.</li>
            <li>Day 7 — Review and plan your next week.</li>
          </ol>
          <p>Adapt every activity to your ability and circumstances.</p>
        </div>
      </div>
    </section>
  );
}
