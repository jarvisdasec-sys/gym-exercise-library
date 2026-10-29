import { useEffect } from "react";
import { APP_STORE_URL, PLANNER_URL } from "../lib/growth";
import { INSTAGRAM_URL } from "../lib/social";
import { EXERCISES } from "../lib/exercises";
import { HomepageWodPreview } from "./HomepageWodPreview";
import { StarterPlanPromo } from "./StarterPlanPromo";

const FEATURED_PLATES = ["barbell-bench-press", "lat-pulldown", "leg-press", "dumbbell-lateral-raise"]
  .map((slug) => EXERCISES.find((exercise) => exercise.slug === slug))
  .filter((exercise) => exercise !== undefined);

export function GrowthContent({
  page = "home",
  plannerUrl = PLANNER_URL,
}: {
  page?: "home" | "start" | "plus";
  plannerUrl?: string;
}) {
  useEffect(() => {
    if (page !== "start" || !window.location.hash) return;
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page]);

  if (page === "start")
    return (
      <main className="growth-main">
        <section className="growth-section growth-intro">
          <div className="growth-wrap">
            <p className="growth-kicker">YOUR FIRST STEP / NO PAYMENT NEEDED</p>
            <h1>
              Start small.
              <br />
              <em>Make it repeatable.</em>
            </h1>
            <p className="growth-lead">
              You don't need to use every tool today. Pick the next step that
              makes your week easier.
            </p>
            <div className="growth-paths">
              <a href={plannerUrl} className="growth-path">
                <span className="growth-index">01 / PLAN</span>
                <h2>Build a recipe week.</h2>
                <p>
                  Complete meals, ingredients, prep instructions and a grocery
                  list. Try it without an account.
                </p>
                <strong>Open BTB Meal Planner ↗</strong>
              </a>
              <a href="/exercises" className="growth-path">
                <span className="growth-index">02 / TRAIN</span>
                <h2>Learn the movement.</h2>
                <p>
                  Explore 54 exercise blueprints with setup, execution and
                  common-mistake guides.
                </p>
                <strong>Explore exercise guides →</strong>
              </a>
              <a href="/workouts" className="growth-path">
                <span className="growth-index">03 / PRACTICE</span>
                <h2>Choose a training session.</h2>
                <p>
                  Browse the existing BTB workout tools. Adapt activity to your
                  ability and circumstances.
                </p>
                <strong>Explore workouts →</strong>
              </a>
            </div>
          </div>
        </section>
        <StarterPlanPromo />
        <section className="growth-section">
          <div className="growth-wrap growth-split">
            <div>
              <p className="growth-kicker">A PLAN YOU CAN WRITE DOWN</p>
              <h2>
                One week.
                <br />
                <em>One useful worksheet.</em>
              </h2>
              <p className="growth-lead">
                Choose training days, list meals, plan your prep session and
                write the groceries you need. No email gate. No hidden trial.
              </p>
              <a
                className="growth-action"
                href="/downloads/btb-weekly-starter.html"
                target="_blank"
                rel="noreferrer"
              >
                Open printable starter worksheet ↗
              </a>
              <p className="growth-fine">
                Use your browser's Print option to save it as a PDF.
              </p>
            </div>
            <div className="growth-paper">
              <span className="growth-kicker">BTB / WEEKLY STARTER</span>
              <h3>Prepare for your real life.</h3>
              <ol>
                <li>Pick a manageable schedule.</li>
                <li>Choose meals you'll actually make.</li>
                <li>Check your pantry before shopping.</li>
                <li>Plan safe storage and a second prep session.</li>
              </ol>
              <p>
                General education—not a personalized clinical or training
                prescription.
              </p>
            </div>
          </div>
        </section>
        <section id="btb-app" className="growth-section scroll-mt-32">
          <div className="growth-wrap growth-split">
            <div>
              <p className="growth-kicker">ON YOUR PHONE</p>
              <h2>
                The BTB app.
                <br />
                <em>Available now.</em>
              </h2>
              <p className="growth-lead">
                Explore the separate BTB Fitness & Health app on the App Store.
                The browser Meal Planner and app do not currently share an
                account or synchronized records.
              </p>
              <a
                className="growth-action"
                href={APP_STORE_URL}
                target="_blank"
                rel="noreferrer"
              >
                View the exact App Store listing ↗
              </a>
            </div>
            <div>
              <p className="growth-kicker">A QUESTION BEFORE YOU START?</p>
              <h3>Tell BTB what you need.</h3>
              <p>
                Ask about the tools, educational support, or a gym partnership.
                You can prepare an email below without joining a mailing list.
              </p>
              <a href="#btb-inquiry" className="growth-action">
                Prepare an inquiry →
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  if (page === "plus")
    return (
      <main className="growth-main">
        <section className="growth-section growth-intro">
          <div className="growth-wrap">
            <p className="growth-kicker">BTB PLUS / PROPOSED MEMBERSHIP</p>
            <h1>
              A clearer week.
              <br />
              <em>
                Not another subscription
                <br />
                you forget to use.
              </em>
            </h1>
            <p className="growth-lead">
              We're exploring a future BTB membership built around consistent
              training and meal prep. Tell us which help you would actually use.
            </p>
            <div className="growth-notice">
              <strong>Research stage—not a paid offer.</strong>
              <p>
                No subscription is available here. No payment, trial, or
                automatic renewal. Current web tools remain free and the Meal
                Planner remains browser-local.
              </p>
            </div>
            <div className="growth-paths">
              <article className="growth-path">
                <span className="growth-index">AVAILABLE NOW / FREE</span>
                <h2>Put the tools to work.</h2>
                <p>
                  Exercise guides, training education, recipe-week tools, local
                  saved weeks, prep and shopping.
                </p>
                <a className="growth-action" href={plannerUrl}>
                  Try the planner ↗
                </a>
              </article>
              <article className="growth-path">
                <span className="growth-index">PROPOSED / NOT AVAILABLE</span>
                <h2>Continuity across devices.</h2>
                <p>
                  Secure saved plans and shared household coordination are
                  potential future additions—not existing features.
                </p>
              </article>
              <article className="growth-path">
                <span className="growth-index">PROPOSED / NOT AVAILABLE</span>
                <h2>Guided implementation.</h2>
                <p>
                  Fresh program collections and clearly scoped group
                  walkthroughs. Availability and pricing would be confirmed
                  before launch.
                </p>
              </article>
            </div>
            <a className="growth-action" href="#btb-inquiry">
              Tell us what you'd value →
            </a>
          </div>
        </section>
        <section className="growth-section">
          <div className="growth-wrap">
            <p className="growth-kicker">NO PRESSURE TO UPGRADE</p>
            <h2>
              Useful free tools
              <br />
              <em>stay useful.</em>
            </h2>
            <p className="growth-lead">
              Try the existing resources first. A future membership would need
              to earn its place in your routine; there is no promised launch
              date or outcome.
            </p>
            <a className="growth-secondary" href="/start">
              Start with the free tools →
            </a>
          </div>
        </section>
      </main>
    );
  return (
    <main className="growth-main">
      <section className="growth-hero">
        <img
          className="growth-hero-photo"
          src="/images/site/btb-movement-index-hero.webp"
          alt="BTB training illustration in a black and neon-green gym"
          fetchPriority="high"
        />
        <div className="growth-hero-shade" />
        <div className="growth-wrap growth-hero-content">
          <p className="growth-kicker">
            BUILD THE BODY / BUILT FOR YOUR REAL LIFE
          </p>
          <h1>
            Find the movement.
            <br />
            <em>Own the form.</em>
          </h1>
          <p className="growth-lead">
            Clear exercise guidance, workouts, nutrition tools, and fitness
            education to help you build a stronger, more repeatable routine.
          </p>
          <div className="growth-actions">
            <a href="/exercises" className="growth-action">
              Explore the Exercise Library <span>→</span>
            </a>
            <a href="/start" className="growth-secondary">
              Start Here <span>→</span>
            </a>
          </div>
          <p className="growth-fine">
            Free browser tools · No card required · Start at your own pace
          </p>
          <div className="growth-hero-label">
            <span className="growth-kicker">THE BTB APPROACH</span>
            <p>
              Learn the movement.
              <br />
              Plan the meals.
              <br />
              <strong>Repeat what works.</strong>
            </p>
          </div>
        </div>
      </section>
      <div className="growth-strip">
        <div className="growth-wrap">
          <a href="/start" className="text-lime underline decoration-lime/40 underline-offset-4">New to BTB? Start here →</a>
          <span>54 exercise blueprints</span>
          <span>Complete recipe planning</span>
          <span>Prep + shopping tools</span>
          <span>Author-led education</span>
        </div>
      </div>
      <HomepageWodPreview />
      <section id="btb-reading-room" className="growth-section bg-[#0b0b0b]">
        <div className="growth-wrap grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <p className="growth-kicker">BTB READING ROOM / FREE CHAPTER 1</p>
            <h2>Build your fitness foundation.<br /><em>Start with the free chapter.</em></h2>
            <p className="growth-lead">Get a practical introduction to the ideas behind <i>BTB: The Foundation of Fitness and Health</i>—a clear place to begin with training, nutrition, and healthier routines.</p>
            <div className="growth-actions">
              <a className="growth-action" href="/BTB_Chapter_1.pdf" download>Download Free Chapter 1 (PDF) ↓</a>
              <a className="growth-secondary" href="https://www.amazon.com/dp/B0HCMVK5ZN" target="_blank" rel="noopener noreferrer">Explore the full book ↗</a>
            </div>
            <p className="growth-fine">Free PDF · No email gate · Read at your own pace</p>
          </div>
          <img src="/images/books/btb-volume-1.jpg" alt="BTB: The Foundation of Fitness and Health book cover" className="mx-auto w-44 border border-lime/50 shadow-[-10px_12px_0_#8cff00]" loading="lazy" />
        </div>
      </section>
      <section id="exercise-preview" className="growth-section">
        <div className="growth-wrap">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="growth-kicker">EXERCISE LIBRARY / 54 PLATES</p>
              <h2>Learn the movement.<br /><em>Own the form.</em></h2>
            </div>
            <a href="/exercises" className="growth-secondary">View all 54 plates →</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PLATES.map((exercise) => (
              <a key={exercise.slug} href={`/e/${exercise.slug}`} className="group border border-white/12 bg-black transition-colors hover:border-lime">
                <img src={exercise.image} alt={`${exercise.name} exercise guide`} className="aspect-[4/5] w-full object-cover object-top" loading="lazy" />
                <div className="p-3">
                  <p className="growth-kicker">{exercise.category}</p>
                  <h3 className="display mt-1 font-semibold text-white group-hover:text-lime">{exercise.name}</h3>
                  <p className="mt-1 text-xs text-white/50">{exercise.difficulty} · {exercise.equipment}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section id="btb-app" className="growth-section bg-[#0b0b0b]">
        <div className="growth-wrap growth-split">
          <div>
            <p className="growth-kicker">BTB FITNESS &amp; HEALTH / COMPANION APP</p>
            <h2>Bring your training<br /><em>and health tools together.</em></h2>
            <p className="growth-lead">Explore the BTB Fitness &amp; Health app for workout tracking, personalized training plans, nutrition logging, health measurements, and a fitness education library.</p>
            <a className="growth-action" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Open the BTB Fitness & Health App Store listing (opens in a new tab)">View BTB on the App Store ↗</a>
            <p className="growth-fine">The app is a separate product; website planner data is not currently synced with app records.</p>
          </div>
          <div className="border border-lime/40 p-5">
            <p className="growth-kicker">AFTER THE FREE CHAPTER</p>
            <h3>Choose your next step.</h3>
            <div className="mt-4 flex flex-col gap-3">
              <a className="growth-text-link" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">Explore the companion app ↗</a>
              <a className="growth-text-link" href="https://www.amazon.com/dp/B0HCMVK5ZN" target="_blank" rel="noopener noreferrer">Find the full book ↗</a>
              <a className="growth-text-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow BTB on Instagram (opens in a new tab)">Follow BTB on Instagram ↗</a>
            </div>
          </div>
        </div>
      </section>
      <StarterPlanPromo />
      <section className="growth-section">
        <div className="growth-wrap growth-split">
          <div>
            <p className="growth-kicker">NOT MORE TOOLS. A USEFUL NEXT STEP.</p>
            <h2>
              Make the week
              <br />
              <em>work together.</em>
            </h2>
            <p className="growth-lead">
              A workout saved on your phone isn't a routine. A grocery list
              isn't a meal. BTB helps you connect the next practical steps.
            </p>
            <a className="growth-text-link" href="/start">
              Find your starting point →
            </a>
          </div>
          <ol className="growth-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Learn before you load.</h3>
                <p>
                  Explore setup, movement cues and common mistakes in the
                  exercise library.
                </p>
                <a href="/exercises">Open the library →</a>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Plan meals you can cook.</h3>
                <p>
                  Choose complete recipes, check portions and turn ingredients
                  into groceries.
                </p>
                <a href={plannerUrl}>Try the recipe planner ↗</a>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Prep. Review. Repeat.</h3>
                <p>
                  Use a prep checklist, safe-storage guidance and saved weeks
                  that fit your schedule.
                </p>
                <a
                  href="/downloads/btb-weekly-starter.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open the weekly worksheet ↗
                </a>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <section className="growth-section growth-tool-section">
        <div className="growth-wrap growth-split">
          <div>
            <p className="growth-kicker">BTB MEAL PLANNER / FREE WEB TOOL</p>
            <h2>
              A real meal.
              <br />
              <em>A clearer plan.</em>
            </h2>
            <p className="growth-lead">
              Explore ingredients and cooking steps, save a recipe week, and see
              what to shop and prep. Your plan stays in this browser; no cloud
              sync is claimed.
            </p>
            <a href={plannerUrl} className="growth-action">
              Open complete-recipe planning ↗
            </a>
          </div>
          <div className="growth-tool-preview">
            <span className="growth-kicker">
              YOUR NEXT WEEK / EXAMPLE WORKFLOW
            </span>
            <h3>From recipe to routine.</h3>
            <div className="growth-preview-lines">
              <p>
                <span>01 / MEALS</span>Choose complete recipes
              </p>
              <p>
                <span>02 / SHOP</span>Aggregate ingredient quantities
              </p>
              <p>
                <span>03 / PREP</span>Batch, label and store safely
              </p>
            </div>
            <p className="growth-fine">
              Illustrative workflow, not a logged or generated personal plan.
              Nutrition, price and time estimates need your review.
            </p>
          </div>
        </div>
      </section>
      <section className="growth-section">
        <div className="growth-wrap growth-author">
          <img
            src="/images/books/btb-volume-1.jpg"
            alt="BTB Foundations of Health and Nutrition book cover"
            loading="lazy"
          />
          <div>
            <p className="growth-kicker">MEET THE CREATOR / JARVIS DIXON</p>
            <h2>
              From the page
              <br />
              <em>to your practice.</em>
            </h2>
            <p className="growth-lead">
              BTB connects Jarvis Dixon's published fitness and nutrition
              education with practical tools you can put to use outside the gym.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              The BTB method starts with learning sound movement, choosing a realistic training and meal plan, then reviewing what fits your life and repeating the habits that work.
            </p>
            <p>
              Explore the book, browse a form guide, or start a planning week.
              Author status is not a substitute for individual advice from a
              qualified professional.
            </p>
            <div className="growth-actions">
              <a
                className="growth-secondary"
                href="https://www.amazon.com/dp/B0HCMVK5ZN"
                target="_blank"
                rel="noreferrer"
              >
                Explore the book on Amazon ↗
              </a>
              <a className="growth-text-link" href="/learn">
                Read BTB education →
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="growth-section">
        <div className="growth-wrap growth-split">
          <div>
            <p className="growth-kicker">YOUR QUESTIONS / STRAIGHT ANSWERS</p>
            <h2>
              Start informed.
              <br />
              <em>Stay in control.</em>
            </h2>
          </div>
          <div className="growth-faq">
            <details>
              <summary>Do I need to pay to start?</summary>
              <p>
                No. The current website resources and browser Meal Planner are
                free. BTB Plus is a proposed membership, not an active
                subscription.
              </p>
            </details>
            <details>
              <summary>
                Is this personalized medical or nutrition advice?
              </summary>
              <p>
                No. These are educational resources and planning estimates.
                Speak with a qualified professional for individual health,
                injury or clinical dietary needs. Check labels and allergens.
              </p>
            </details>
            <details>
              <summary>
                Will my planner data follow me to another device?
              </summary>
              <p>
                Not currently. The Meal Planner stores records in your browser.
                Export your records for safekeeping and avoid clearing browser
                data without a backup.
              </p>
            </details>
            <details>
              <summary>Where do I get the BTB app?</summary>
              <p>
                <a href={APP_STORE_URL} target="_blank" rel="noreferrer">
                  Open the official BTB Fitness & Health App Store listing ↗
                </a>
                . It is a separate product; shared login or synchronized planner
                records are not included.
              </p>
            </details>
          </div>
        </div>
      </section>
      <section className="growth-section growth-final">
        <div className="growth-wrap">
          <p className="growth-kicker">THE NEXT STEP IS SMALL</p>
          <h2>
            Build a week
            <br />
            <em>you can actually follow.</em>
          </h2>
          <div className="growth-actions">
            <a className="growth-action" href={plannerUrl}>
              Try BTB Meal Planner ↗
            </a>
            <a className="growth-secondary" href="/start#btb-inquiry">
              Ask BTB a question →
            </a>
          </div>
          <p className="growth-fine">
            Curious about future membership?{" "}
            <a href="/plus">Help shape BTB Plus →</a>
          </p>
        </div>
      </section>
    </main>
  );
}
