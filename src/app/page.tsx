import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function LandingPage() {

  return (
    <div className="min-h-screen ff-bg-gradient">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-[var(--ff-accent-1)] via-[var(--ff-accent-2)] to-[var(--ff-accent-3)] shadow-[0_18px_40px_rgba(124,58,237,0.18)]" />
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  FormFlow <span className="ff-gradient-text">AI</span>
                </div>
                <div className="text-xs text-[var(--ff-muted)]">
                  Forms, surveys, insights
                </div>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-[var(--ff-muted)] sm:flex">
              <a className="hover:text-[var(--ff-fg)]" href="#features">
                Features
              </a>
              <a className="hover:text-[var(--ff-fg)]" href="#preview">
                Preview
              </a>
              <a className="hover:text-[var(--ff-fg)]" href="#testimonials">
                Testimonials
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <ButtonLink variant="secondary" href="/dashboard">
                Dashboard
              </ButtonLink>
              <ButtonLink href="/dashboard">Create Your Form</ButtonLink>
            </div>
          </div>
        </Container>
      </header>

      <main>
        <section className="pt-16 sm:pt-24">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-4 py-2 text-xs text-[var(--ff-muted)] shadow-[0_10px_25px_rgba(10,14,28,0.06)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--ff-accent-2)]" />
                  AI summaries, themes, and recommendations
                </div>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-tight text-[var(--ff-fg)] sm:text-5xl">
                  Create Smart Forms & Surveys in Minutes with{" "}
                  <span className="ff-gradient-text">AI</span>
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-[var(--ff-muted)] sm:text-lg">
                  Build beautiful, minimal forms that feel effortless to answer.
                  Collect responses, track analytics, and generate instant AI
                  insights to spot key themes and improve faster.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ButtonLink href="/dashboard" size="lg">
                    Create Your Form
                  </ButtonLink>
                  <ButtonLink href="#preview" variant="secondary" size="lg">
                    See a Preview
                  </ButtonLink>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--ff-muted)]">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ff-accent-1)]" />
                    Shareable links
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ff-accent-2)]" />
                    Drag & drop builder
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ff-accent-3)]" />
                    AI insights
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-br from-[rgba(124,58,237,0.18)] via-[rgba(37,99,235,0.14)] to-[rgba(236,72,153,0.16)] blur-2xl" />
                <Card className="p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold tracking-tight">
                        Product Feedback Survey
                      </div>
                      <div className="mt-1 text-xs text-[var(--ff-muted)]">
                        6 questions · ~2 minutes
                      </div>
                    </div>
                    <div className="rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-[var(--ff-muted)]">
                      Preview
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-black/5 bg-white/70 p-4 transition hover:bg-white">
                      <div className="text-sm font-medium">
                        How satisfied are you with FormFlow AI?
                      </div>
                      <div className="mt-3 flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-9 w-9 rounded-xl border border-black/10 bg-white/80 text-center text-sm leading-9 text-[var(--ff-muted)]"
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-black/5 bg-white/70 p-4 transition hover:bg-white">
                      <div className="text-sm font-medium">
                        What should we improve next?
                      </div>
                      <div className="mt-3 h-20 rounded-2xl border border-black/10 bg-white/80 p-3 text-sm text-[var(--ff-muted)]">
                        Type your answer…
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[var(--ff-muted)]">
                        Press Enter to continue
                      </div>
                      <div className="flex gap-2">
                        <div className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm">
                          Next
                        </div>
                        <div className="rounded-full bg-[var(--ff-fg)] px-4 py-2 text-sm text-white">
                          Submit
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        <section id="features" className="pt-16 sm:pt-20">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Everything you need to launch smarter surveys
                </h2>
                <p className="mt-2 max-w-2xl text-[var(--ff-muted)]">
                  Minimal, modern, and fast. Create forms that look premium and
                  convert better—then let AI summarize the results.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Typeform-like experience",
                  desc: "Clean, card-based questions that feel effortless.",
                  color: "from-[rgba(124,58,237,0.18)] to-transparent",
                },
                {
                  title: "Drag & drop builder",
                  desc: "Reorder questions and refine flow in seconds.",
                  color: "from-[rgba(37,99,235,0.18)] to-transparent",
                },
                {
                  title: "AI insights in one click",
                  desc: "Themes, sentiment, and recommendations—instantly.",
                  color: "from-[rgba(236,72,153,0.18)] to-transparent",
                },
                {
                  title: "Shareable links",
                  desc: "Send a public link and start collecting responses.",
                  color: "from-[rgba(124,58,237,0.16)] to-transparent",
                },
                {
                  title: "Responses table",
                  desc: "View submissions in a simple, searchable layout.",
                  color: "from-[rgba(37,99,235,0.16)] to-transparent",
                },
                {
                  title: "Lightweight analytics",
                  desc: "Track totals and see what’s trending at a glance.",
                  color: "from-[rgba(236,72,153,0.16)] to-transparent",
                },
              ].map((f) => (
                <Card
                  key={f.title}
                  className="group p-5 transition hover:-translate-y-0.5 hover:shadow-[0_25px_70px_rgba(10,14,28,0.12)]"
                >
                  <div
                    className={[
                      "h-10 w-10 rounded-2xl border border-black/5 bg-gradient-to-br",
                      f.color,
                    ].join(" ")}
                  />
                  <div className="mt-4 text-base font-semibold tracking-tight">
                    {f.title}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-[var(--ff-muted)]">
                    {f.desc}
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section id="preview" className="pt-16 sm:pt-20">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  A beautiful experience for respondents
                </h2>
                <p className="mt-2 max-w-xl text-[var(--ff-muted)]">
                  Keep attention on the question. Smooth interactions, clean
                  spacing, and a modern look—mobile-first.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm text-[var(--ff-muted)]">
                    Short & long text
                  </span>
                  <span className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm text-[var(--ff-muted)]">
                    Multiple choice
                  </span>
                  <span className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm text-[var(--ff-muted)]">
                    Checkboxes
                  </span>
                  <span className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm text-[var(--ff-muted)]">
                    Rating scale
                  </span>
                  <span className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm text-[var(--ff-muted)]">
                    Email field
                  </span>
                </div>
              </div>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold tracking-tight">
                    Live preview
                  </div>
                  <div className="text-xs text-[var(--ff-muted)]">
                    1 / 6
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-black/5 bg-white/70 p-5">
                  <div className="text-xs font-medium text-[var(--ff-muted)]">
                    Question
                  </div>
                  <div className="mt-2 text-lg font-semibold tracking-tight">
                    What’s one word to describe your experience?
                  </div>
                  <div className="mt-4 rounded-2xl border border-black/10 bg-white/80 p-3 text-sm text-[var(--ff-muted)]">
                    Type your answer…
                  </div>
                  <div className="mt-5 flex justify-end gap-2">
                    <div className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm">
                      Next
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        <section id="testimonials" className="pt-16 sm:pt-20">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Loved by teams who ship fast
                </h2>
                <p className="mt-2 max-w-2xl text-[var(--ff-muted)]">
                  A premium survey experience with AI insights, without the
                  complexity.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {[
                {
                  quote:
                    "We replaced three tools with FormFlow AI. The insights button alone saves hours every week.",
                  name: "Priya S.",
                  role: "Product Manager",
                },
                {
                  quote:
                    "The builder is ridiculously clean. Our forms look like a real SaaS product—because they are.",
                  name: "Daniel K.",
                  role: "Founder",
                },
                {
                  quote:
                    "Response review is painless. I love the minimal UI and how fast everything loads.",
                  name: "Ayesha M.",
                  role: "UX Researcher",
                },
              ].map((t) => (
                <Card key={t.name} className="p-6">
                  <div className="text-sm leading-6 text-[var(--ff-fg)]">
                    “{t.quote}”
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[rgba(124,58,237,0.18)] via-[rgba(37,99,235,0.14)] to-[rgba(236,72,153,0.16)]" />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-[var(--ff-muted)]">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-20">
          <Container>
            <Card className="p-8 sm:p-10">
              <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="text-sm font-semibold tracking-tight">
                    Ready to build your next survey?
                  </div>
                  <div className="mt-2 text-[var(--ff-muted)]">
                    Create your first form in minutes and generate insights when
                    responses come in.
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <ButtonLink href="/dashboard" size="lg">
                    Create Your Form
                  </ButtonLink>
                  <ButtonLink href="/dashboard" variant="secondary" size="lg">
                    Open Dashboard
                  </ButtonLink>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white/60 py-10 backdrop-blur">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--ff-muted)]">
              © {new Date().getFullYear()} FormFlow AI. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--ff-muted)]">
              <a className="hover:text-[var(--ff-fg)]" href="#features">
                Features
              </a>
              <a className="hover:text-[var(--ff-fg)]" href="#preview">
                Preview
              </a>
              <a className="hover:text-[var(--ff-fg)]" href="#testimonials">
                Testimonials
              </a>
              <a className="hover:text-[var(--ff-fg)]" href="/dashboard">
                Dashboard
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}