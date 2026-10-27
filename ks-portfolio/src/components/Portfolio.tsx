"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bom from "@/data/bom.json";

const navigation = [
  { id: "journey", label: "Journey" },
  { id: "software", label: "Software" },
  { id: "credential", label: "Safety" },
  { id: "plates", label: "Plates" },
  { id: "cost", label: "Estimate" },
  { id: "documentation", label: "Documents" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

const plates = [
  {
    number: "01",
    title: "Basic Constructions Techniques",
    date: "September 26, 2023",
    file: "plate-1",
    details: "Base Plate and Boomerang",
  },
  {
    number: "02",
    title: "Basic Editing Techniques",
    date: "September 27, 2023",
    file: "plate-2",
    details: "Gasket and Link",
  },
  {
    number: "03",
    title: "Geometric Construction",
    date: "October 4, 2023",
    file: "plate-3",
    details: "Floor plan",
  },
  {
    number: "04",
    title: "Advanced Dimensioning",
    date: "October 12, 2023",
    file: "plate-4",
    details: "Guide Block and Hub",
  },
];

const software = [
  { name: "AutoCAD", status: "Familiarity area", code: "CAD / 2D" },
  { name: "ETABS", status: "Learning area", code: "STRUCTURES" },
  { name: "Revit", status: "Learning area", code: "BIM" },
  { name: "STAAD", status: "Learning area", code: "ANALYSIS" },
  { name: "PlanSwift", status: "Learning area", code: "TAKEOFF" },
];

const journey = [
  ["01", "Technical drafting", "Drawing sheets, dimensions, and clear technical communication."],
  ["02", "Construction planning", "Organizing project information before quantity and cost work."],
  ["03", "Quantity takeoff", "Reading project documents to identify quantities for estimating."],
  ["04", "Cost estimation", "Working with material, labor, equipment, and other cost components."],
  ["05", "Project documentation", "Keeping drawings and estimate information legible and structured."],
  ["06", "Construction safety", "Continuing to learn about safety in construction."],
];

const processSteps = ["Draft", "Plan", "Measure", "Estimate", "Review", "Document"];
const formatPeso = (value: number | null) => {
  if (value === null) return "Not listed";
  const [whole, fraction] = value.toString().split(".");
  return `₱${Number(whole).toLocaleString("en-PH")}${fraction ? `.${fraction}` : ""}`;
};

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const inquirySubmitting = useRef(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquiryFeedback, setInquiryFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (inquirySubmitting.current) return;

    const formData = new FormData(form);
    const fullName = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!fullName || !email || !subject || !message) {
      setInquiryFeedback({ type: "error", message: "Please complete all fields before sending your inquiry." });
      form.querySelector<HTMLInputElement | HTMLTextAreaElement>(":invalid")?.focus();
      return;
    }

    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !emailInput?.validity.valid) {
      setInquiryFeedback({ type: "error", message: "Please enter a valid email address." });
      emailInput?.focus();
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
    if (!accessKey) {
      setInquiryFeedback({
        type: "error",
        message: "The inquiry form is not configured yet. Please email Kia directly instead.",
      });
      return;
    }

    inquirySubmitting.current = true;
    setIsSubmittingInquiry(true);
    setInquiryFeedback(null);

    try {
      formData.set("access_key", accessKey);
      formData.set("name", fullName);
      formData.set("email", email);
      formData.set("subject", `Kia Sardona Portfolio — ${subject}`);
      formData.set("message", `${message}\n\nPage: ${window.location.href}`);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result: { success?: boolean } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Web3Forms did not accept the inquiry.");
      }

      form.reset();
      setInquiryFeedback({
        type: "success",
        message: "Thank you. Your inquiry has been sent successfully.",
      });
    } catch (error) {
      console.error("Inquiry form submission failed.", error);
      setInquiryFeedback({
        type: "error",
        message: "We couldn’t send your inquiry right now. Please try again or email Kia directly.",
      });
    } finally {
      inquirySubmitting.current = false;
      setIsSubmittingInquiry(false);
    }
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLoading(false);
      return;
    }

    const intro = introRef.current;
    if (!intro) {
      setLoading(false);
      return;
    }

    const name = intro.querySelector<HTMLElement>(".intro-name-text");
    const draftingLine = intro.querySelector<HTMLElement>(".intro-name-scan");
    const underline = intro.querySelector<HTMLElement>(".intro-rule");
    const letters = intro.querySelectorAll<HTMLElement>(".intro-letter");
    const subtitle = intro.querySelector<HTMLElement>(".intro-subtitle");
    if (!name || !draftingLine || !underline || !subtitle || !letters.length) {
      setLoading(false);
      return;
    }

    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      setLoading(false);
    };

    const timeline = gsap.timeline({ onComplete: finish });
    timeline
      .to(name, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power1.inOut" })
      .to(draftingLine, { xPercent: 100, duration: 0.85, ease: "power1.inOut" }, "<")
      .to({}, { duration: 1.25 })
      .to(underline, { scaleX: 1, duration: 0.48, ease: "power2.out" })
      .to(
        letters,
        { autoAlpha: 1, y: 0, stagger: 0.045, duration: 0.24, ease: "power2.out" },
        "+=0.1",
      )
      .to(
        subtitle,
        { clipPath: "inset(0 0% 0 0)", autoAlpha: 1, duration: 0.55, ease: "power2.inOut" },
        "+=0.2",
      )
      .to(intro, { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power2.inOut" }, "+=0.65");

    const fallback = window.setTimeout(() => {
      timeline.progress(1);
      finish();
    }, 12000);
    return () => {
      window.clearTimeout(fallback);
      timeline.kill();
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".reveal:not(.software-row):not(.credential-sheet)").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".section-heading h2, .credential-copy h2, .contact-copy h2").forEach((heading) => {
          gsap.fromTo(
            heading,
            { y: 20, autoAlpha: 0, letterSpacing: "-.095em", filter: "blur(3px)", clipPath: "inset(0 0 12% 0)" },
            {
              y: 0,
              autoAlpha: 1,
              letterSpacing: "-.06em",
              filter: "blur(0px)",
              clipPath: "inset(0 0 0% 0)",
              duration: 0.85,
              ease: "power2.out",
              scrollTrigger: { trigger: heading, start: "top 84%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".text-reveal").forEach((paragraph) => {
          const sentences = paragraph.querySelectorAll<HTMLElement>(".sentence-line");
          const targets: HTMLElement[] = sentences.length ? Array.from(sentences) : [paragraph];
          gsap.fromTo(
            targets,
            { y: 8, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.48,
              stagger: 0.12,
              ease: "power1.out",
              scrollTrigger: { trigger: paragraph, start: "top 88%", once: true },
            },
          );
        });

        gsap.to(".site-blueprint-bg", {
          yPercent: -2,
          scale: 1.025,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });

        gsap.utils.toArray<HTMLElement>(".hero-grid, .journey-linework, .software-drawing").forEach((layer) => {
          gsap.fromTo(
            layer,
            { scale: 1 },
            {
              scale: layer.classList.contains("hero-grid") ? 1.075 : 1.025,
              ease: "none",
              scrollTrigger: {
                trigger: layer.closest("section") ?? layer,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<SVGGeometryElement>(".blueprint-draw").forEach((path) => {
          const length = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: path.closest("[data-blueprint]") ?? path,
                start: "top 85%",
                end: "bottom 45%",
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement | SVGSVGElement>(".parallax").forEach((element) => {
          const fast = element.classList.contains("parallax-fast");
          gsap.to(element, {
            yPercent: fast ? -11 : -5,
            xPercent: fast ? 2 : 0,
            ease: "none",
            scrollTrigger: {
              trigger: element.parentElement ?? element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        gsap.fromTo(
          ".hero-copy h1",
          { y: 18, autoAlpha: 0, letterSpacing: "-.09em", filter: "blur(3px)" },
          {
            y: 0,
            autoAlpha: 1,
            letterSpacing: "-.075em",
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: "#top", start: "top top", once: true },
          },
        );

        gsap.fromTo(
          ".hero-rule i",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: ".hero-copy h1", start: "top 70%", once: true },
          },
        );

        gsap.utils.toArray<HTMLElement>(".key-term").forEach((term) => {
          ScrollTrigger.create({
            trigger: term,
            start: "top 88%",
            once: true,
            onEnter: () => term.classList.add("is-drafted"),
          });
        });

        gsap.utils.toArray<HTMLElement>(".software-row").forEach((row) => {
          gsap.fromTo(
            row,
            { y: 18, scale: 0.985, autoAlpha: 0 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.62,
              ease: "power2.out",
              scrollTrigger: { trigger: row, start: "top 90%", once: true },
            },
          );
        });

        gsap.fromTo(
          ".credential-sheet",
          { y: 24, scale: 0.985, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: ".credential-sheet", start: "top 82%", once: true },
          },
        );

        gsap.fromTo(
          ".credential-image",
          { yPercent: 2 },
          {
            yPercent: -2,
            ease: "none",
            scrollTrigger: {
              trigger: ".credential-sheet",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );

        gsap.utils.toArray<SVGGeometryElement>(".contact-icon-path").forEach((path) => {
          const length = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              duration: 0.55,
              ease: "power1.out",
              scrollTrigger: { trigger: path.closest(".contact-detail"), start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".inquiry-field").forEach((field, index) => {
          gsap.fromTo(
            field,
            { y: 10, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.42,
              delay: index * 0.045,
              ease: "power1.out",
              scrollTrigger: { trigger: ".inquiry-form", start: "top 82%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>(".contact-detail").forEach((detail, index) => {
          gsap.fromTo(
            detail,
            { x: 14, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.45,
              delay: index * 0.06,
              ease: "power1.out",
              scrollTrigger: { trigger: ".contact-card", start: "top 78%", once: true },
            },
          );
        });

        gsap.fromTo(
          ".construction-step",
          { autoAlpha: 0.42, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: {
              trigger: "#process",
              start: "top 72%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          ".estimate-bar",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            stagger: 0.08,
            ease: "power1.out",
            scrollTrigger: { trigger: "#cost", start: "top 68%" },
          },
        );

        gsap.utils.toArray<HTMLElement>(".estimate-table tbody tr, .area-entry, .title-block-total").forEach((entry) => {
          gsap.fromTo(
            entry,
            { y: 12, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power1.out",
              scrollTrigger: { trigger: entry, start: "top 91%", once: true },
            },
          );
        });

        const readingProgressBar = root.current?.querySelector<HTMLElement>("#reading-progress");
        const sectionRailProgress = root.current?.querySelector<HTMLElement>("#rail-progress");
        const costSection = root.current?.querySelector<HTMLElement>("#cost");
        const costRailFill = root.current?.querySelector<HTMLElement>(".cost-progress-rail span");

        ScrollTrigger.create({
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            if (readingProgressBar) readingProgressBar.style.transform = `scaleX(${self.progress})`;
            if (sectionRailProgress) {
              sectionRailProgress.style.transform = `translateX(-50%) scaleY(${self.progress})`;
            }

            if (costSection && costRailFill) {
              const bounds = costSection.getBoundingClientRect();
              const currentScroll = window.scrollY;
              const start = bounds.top + currentScroll - window.innerHeight * 0.65;
              const end = bounds.bottom + currentScroll - window.innerHeight;
              const costProgress = gsap.utils.clamp(
                0,
                1,
                end > start ? (currentScroll - start) / (end - start) : 0,
              );
              costRailFill.style.transform = `scaleX(${costProgress})`;
            }
          },
        });

        ScrollTrigger.create({
          trigger: "#process",
          start: "top 70%",
          end: "bottom 65%",
          onUpdate: (self) => {
            const progress = document.querySelector<HTMLElement>(".process-rail span");
            if (progress) progress.style.transform = `scaleX(${self.progress})`;
          },
        });

        navigation.forEach(({ id }) => {
          ScrollTrigger.create({
            trigger: `#${id}`,
            start: "top 48%",
            end: "bottom 48%",
            onToggle: (self) => {
              if (self.isActive) setActiveSection(id);
            },
          });
        });
      });

      media.add("(min-height: 620px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current?.querySelector<HTMLElement>(".plate-track");
        const section = root.current?.querySelector<HTMLElement>(".plates-section");
        const viewport = root.current?.querySelector<HTMLElement>(".plate-pin");
        if (!track || !section || !viewport) return;

        section.classList.add("is-pinned-gallery");
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const horizontalTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: section,
            scrub: 0.8,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>(".plate-frame").forEach((plate) => {
          gsap.fromTo(
            plate,
            { scale: 0.975, autoAlpha: 0.74 },
            {
              scale: 1,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: plate,
                containerAnimation: horizontalTween,
                start: "left 86%",
                end: "center 55%",
                scrub: true,
              },
            },
          );
        });

        const refreshOnLayoutChange = () => ScrollTrigger.refresh();
        const images = Array.from(section.querySelectorAll("img"));
        images.forEach((image) => {
          if (!image.complete) image.addEventListener("load", refreshOnLayoutChange);
        });
        window.addEventListener("resize", refreshOnLayoutChange);
        window.addEventListener("orientationchange", refreshOnLayoutChange);
        requestAnimationFrame(refreshOnLayoutChange);

        return () => {
          section.classList.remove("is-pinned-gallery");
          images.forEach((image) => image.removeEventListener("load", refreshOnLayoutChange));
          window.removeEventListener("resize", refreshOnLayoutChange);
          window.removeEventListener("orientationchange", refreshOnLayoutChange);
        };
      });
    }, root);

    const onVisibilityChange = () => {
      gsap.globalTimeline.paused(document.hidden);
      root.current?.classList.toggle("tab-hidden", document.hidden);
      if (!document.hidden) ScrollTrigger.refresh();
    };
    root.current?.classList.toggle("tab-hidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      context.revert();
      media.revert();
    };
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) => ((index ?? 0) + 1) % plates.length);
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) => ((index ?? 0) + plates.length - 1) % plates.length);
      }
      if (event.key === "Tab") {
        const controls = Array.from(
          document.querySelectorAll<HTMLButtonElement>("[data-lightbox-control]"),
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [lightboxIndex]);

  const openPlate = (index: number) => setLightboxIndex(index);

  return (
    <div ref={root} className="portfolio-shell">
      <div className="site-blueprint-bg" aria-hidden="true">
      </div>
      {loading && (
        <div
          ref={introRef}
          className="draft-loader intro-blueprint"
          role="status"
          aria-label="Kia Sardona — Engineer in the Making — Civil Engineering Softwares and Cost Estimates"
        >
          <div className="intro-sheet-frame" aria-hidden="true" />
          <svg className="intro-measurements" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d="M82 220v-18m836 18v-18M92 210h816M82 780v18m836-18v18M92 790h816M220 82h-18m18 836h-18M210 92v816M780 82h18m-18 836h18M790 92v816" />
            <path className="intro-measure-short" d="M82 208h10m816 0h-10M208 82v10m584-10v10M82 792h10m816 0h-10M208 918v-10m584 10v-10" />
            <circle cx="82" cy="210" r="3" /><circle cx="918" cy="210" r="3" />
          </svg>
          <div className="intro-sequence">
            <div className="intro-name">
              <span className="intro-name-text">KIA SARDONA</span>
              <span className="intro-name-scan" aria-hidden="true" />
            </div>
            <span className="intro-rule" aria-hidden="true" />
            <p className="intro-phrase" aria-label="ENGINEER IN THE MAKING">
              {"ENGINEER IN THE MAKING".split("").map((letter, index) => (
                <span className="intro-letter" aria-hidden="true" key={`${letter}-${index}`}>
                  {letter === " " ? "\u00a0" : letter}
                </span>
              ))}
            </p>
            <p className="intro-subtitle">Civil Engineering Softwares &amp; Cost Estimates</p>
          </div>
          <div className="intro-coordinates intro-coordinates-left" aria-hidden="true">01 / 04</div>
          <div className="intro-coordinates intro-coordinates-right" aria-hidden="true">KS—CE / 00</div>
          <span className="sr-only">Kia Sardona. Engineer in the Making. Civil Engineering Softwares &amp; Cost Estimates.</span>
        </div>
      )}

      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="reading-progress" aria-hidden="true">
        <span id="reading-progress" />
      </div>

      <aside className="section-rail" aria-label="Page sections">
        <span className="rail-track" aria-hidden="true" />
        <span className="rail-progress" id="rail-progress" aria-hidden="true" />
        {navigation.map(({ id, label }, index) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`Go to ${label}`}
            aria-current={activeSection === id ? "location" : undefined}
            className={activeSection === id ? "rail-node is-active" : "rail-node"}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
          </a>
        ))}
      </aside>

      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Kia Sardona, back to top">
          <Image
            src="/brand/logo.webp"
            alt=""
            width={48}
            height={48}
            loading="eager"
            className="brand-logo"
          />
          <span className="brand-name">KS<span> / </span>CE</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ id, label }) => (
            <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="#contact">Get in touch <span aria-hidden="true">↗</span></a>
      </header>

      <main id="main-content">
        <section id="top" className="hero-section blueprint-surface" data-blueprint>
          <div className="hero-grid parallax parallax-slow" aria-hidden="true" />
          <svg className="hero-bridge-layer parallax parallax-slow" viewBox="0 0 720 300" fill="none" aria-hidden="true">
            <path className="blueprint-draw" d="M20 250h680M80 250V90m140 160V90m140 160V90m140 160V90m140 160V90M80 90h560M80 90l70 160m70-160 70 160m70-160 70 160m70-160 70 160m70-160 70 160M55 70v20m600-20v20M65 78h580" />
            <path className="blueprint-draw" d="M40 265v14m640-14v14M50 274h620" />
            <circle cx="80" cy="250" r="4" /><circle cx="220" cy="250" r="4" /><circle cx="360" cy="250" r="4" /><circle cx="500" cy="250" r="4" /><circle cx="640" cy="250" r="4" />
          </svg>
          <div className="hero-layout page-wrap">
            <div className="hero-copy">
              <p className="eyebrow"><span className="status-dot" /> <span className="key-term">Civil Engineering</span> / Portfolio</p>
              <p className="hero-sheet-code">SHEET 00 <span>·</span> INTRODUCTION</p>
              <h1>Kia G.<br /><span>Sardona</span></h1>
              <div className="hero-rule"><span className="key-term">ENGINEER IN THE MAKING</span><i /></div>
              <p className="hero-description text-reveal">
                <span className="sentence-line">A civil engineering student exploring technical drafting, project estimating,</span>
                <span className="sentence-line">construction documentation, and safety.</span>
              </p>
              <div className="hero-actions">
                <a className="button button-yellow" href="#plates">Explore the plates <span aria-hidden="true">↘</span></a>
                <a className="text-link" href="#journey">Follow the engineering journey <span aria-hidden="true">→</span></a>
              </div>
              <div className="hero-coordinate">
                <span>DRAWING NO.</span><b>KS—00—CE</b>
                <span>STATUS</span><b>IN PROGRESS</b>
              </div>
            </div>

            <div className="hero-art" data-blueprint>
              <div className="hero-art-frame">
                <Image
                  src="/brand/banner.webp"
                  alt="Prepared civil engineering portfolio banner artwork"
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 760px) 100vw, 56vw"
                  className="hero-banner"
                />
                <div className="art-corner art-corner-top" aria-hidden="true" />
                <div className="art-corner art-corner-bottom" aria-hidden="true" />
                <span className="art-tag">FIG. 01 / STUDY IN FORM</span>
                <span className="art-measure art-measure-top">01 — 04 / TECHNICAL PLATES</span>
              </div>
              <svg className="hero-blueprint parallax parallax-fast" viewBox="0 0 680 400" fill="none" aria-hidden="true">
                <path className="blueprint-draw" d="M20 335h640M65 335V110l140 225M205 335V110l140 225M345 335V110l140 225M485 335V110l140 225M65 110h420M65 90h420M50 90v20m450-20v20M65 335h420" />
                <path className="blueprint-draw" d="M42 345v18m455-18v18M52 357h435M85 105v18m400-18v18M95 116h380" />
                <circle cx="65" cy="335" r="5" /><circle cx="205" cy="335" r="5" /><circle cx="345" cy="335" r="5" /><circle cx="485" cy="335" r="5" />
              </svg>
              <p className="floating-note note-one"><span>↗</span> STRUCTURE / STUDY A</p>
              <p className="floating-note note-two"><span>DIM.</span> 01—04</p>
            </div>
          </div>
          <div className="hero-bottom page-wrap">
            <span>TECHNICAL DRAFTING</span><span className="key-term">COST ESTIMATES</span><span>DOCUMENTATION</span>
            <a href="#journey" aria-label="Scroll to engineering journey">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
          </div>
          <span className="edge-coordinate" aria-hidden="true">N 01° / CE</span>
        </section>

        <section id="journey" className="journey-section section-pad" data-blueprint>
          <div className="page-wrap">
            <div className="section-heading reveal">
              <p className="eyebrow"><span className="section-index">01</span> ENGINEERING JOURNEY</p>
              <h2>Learning the language<br /><span>of the build.</span></h2>
              <p className="section-intro text-reveal">
                <span className="sentence-line">An ongoing journey through the connected parts of civil engineering—from a legible drawing</span>
                <span className="sentence-line">to a considered estimate and clear project documentation.</span>
              </p>
            </div>

            <div className="journey-drawing">
              <svg className="journey-linework parallax parallax-slow" viewBox="0 0 1100 390" fill="none" aria-hidden="true">
                <path className="blueprint-draw" d="M64 315V96h972v219H64Zm0-219 972 219m0-219L64 315M64 205h972M550 96v219" />
                <path className="blueprint-draw" d="M84 76v-18m930 18v-18M94 65h910M44 106H26v199h18m1012-199h18v199h-18" />
                <path className="blueprint-draw" d="M160 315V246h120v69m120 0V174h120v141m120 0V126h120v189m120 0V216h120v99" />
                <path className="blueprint-draw journey-timeline-path" d="M64 205h972" />
              </svg>
              <span className="drawing-callout callout-a">FIELD OF STUDY / 01</span>
              <span className="drawing-callout callout-b">CONTINUOUS LEARNING</span>
              <ol className="journey-list">
                {journey.map(([number, title, description]) => (
                  <li key={number} className="journey-item reveal">
                    <span className="journey-number">{number}</span>
                    <div><h3 className="key-term">{title}</h3><p>{description}</p></div>
                    <span className="journey-marker" aria-hidden="true">+</span>
                  </li>
                ))}
              </ol>
              <div className="journey-stamp" aria-hidden="true"><span>CE</span><span>LEARNING<br />BY DESIGN</span></div>
            </div>
          </div>
        </section>

        <section id="software" className="software-section section-pad blueprint-surface" data-blueprint>
          <div className="page-wrap">
            <div className="section-heading section-heading-row reveal">
              <div>
                <p className="eyebrow"><span className="section-index">02</span> SOFTWARE INDEX</p>
                <h2>Tools in the<br /><span>learning set.</span></h2>
              </div>
              <p className="section-intro text-reveal">
                <span className="sentence-line">Learning and familiarity areas only.</span>
                <span className="sentence-line">These tools are not attributed to any specific project shown in this portfolio.</span>
              </p>
            </div>

            <div className="software-drawing parallax parallax-slow">
              <div className="software-ruler" aria-hidden="true"><span>0</span><i /><i /><i /><i /><i /><span>05</span></div>
              <div className="software-list" role="list">
                {software.map(({ name, status, code }, index) => (
                  <article className="software-row reveal" key={name} role="listitem">
                    <span className="software-no">{String(index + 1).padStart(2, "0")}</span>
                    <div className="software-title"><h3 className="key-term">{name}</h3><p>{status}</p></div>
                    <span className="software-code">{code}</span>
                    <svg viewBox="0 0 48 32" aria-hidden="true"><path className="blueprint-draw" d="M2 28 17 4l14 24 15-24" /></svg>
                  </article>
                ))}
              </div>
              <span className="software-side-note">SOFTWARE / LEARNING &amp; FAMILIARITY AREAS</span>
            </div>
          </div>
        </section>

        <section id="credential" className="credential-section section-pad" data-blueprint>
          <div className="page-wrap credential-layout">
            <div className="credential-copy reveal">
              <p className="eyebrow"><span className="section-index">03</span> CONSTRUCTION SAFETY</p>
              <p className="credential-kicker">TRAINING / ANNOUNCEMENT</p>
              <h2>Safety Officer<br /><span>II.</span></h2>
              <p className="credential-description text-reveal">
                <span className="sentence-line">Construction safety training is part of an evolving engineering practice.</span>
                <span className="sentence-line">The prepared announcement graphic is shown here as provided.</span>
              </p>
              <dl className="credential-facts">
                <div><dt>NAME</dt><dd>Kia G. Sardona, SO2</dd></div>
                <div><dt>TRAINING</dt><dd>40 HRS Construction Occupational Safety and Health with 2 HRS Training of Trainers</dd></div>
                <div><dt>DATES</dt><dd>August 8, 9, 15 &amp; 16, 2026</dd></div>
              </dl>
              <p className="credential-disclaimer">Credential Announcement — not an official certificate.</p>
            </div>
            <figure className="credential-sheet reveal">
              <svg className="credential-frame-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path className="blueprint-draw" d="M2 14V2h12m70 0h14v12m0 72v12H86m-70 0H2V86" />
                <path className="blueprint-draw" d="M2 22v56m96-56v56" />
              </svg>
              <span className="sheet-stamp">INSERT / 01</span>
              <Image
                src="/credential/credential-announcement.webp"
                alt="Credential Announcement graphic for Kia G. Sardona, Safety Officer II"
                width={1080}
                height={1080}
                sizes="(max-width: 760px) 92vw, 48vw"
                className="credential-image"
              />
              <figcaption><span>FIG. 03</span> CREDENTIAL ANNOUNCEMENT <span>— UNCROPPED</span></figcaption>
            </figure>
          </div>
        </section>

        <section id="plates" className="plates-section blueprint-surface" data-blueprint>
          <div className="page-wrap plates-intro">
            <div className="section-heading reveal">
              <p className="eyebrow"><span className="section-index">04</span> TECHNICAL DRAWING SET</p>
              <h2>Sheets from<br /><span>the drafting table.</span></h2>
            </div>
            <div className="plates-meta reveal">
              <span>CIV222</span>
              <span>4 SELECTED PLATES</span>
              <span>SELECT A SHEET TO ENLARGE</span>
            </div>
          </div>

          <div className="plate-pin">
            <div className="plate-track">
              {plates.map((plate, index) => (
              <article className="plate-frame plate-active" key={plate.file}>
                  <button
                    className="plate-open"
                    type="button"
                    onClick={() => openPlate(index)}
                    aria-label={`Open full-size drawing: Plate ${plate.number}, ${plate.title}`}
                  >
                    <span className="plate-image-wrap">
                      <Image
                        src={`/plates/${plate.file}-thumb.webp`}
                        alt={`Plate ${plate.number}: ${plate.title} — ${plate.details}`}
                        width={640}
                        height={495}
                        sizes="(max-width: 560px) 82vw, (max-width: 899px) 70vw, 43vw"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <span className="plate-zoom" aria-hidden="true">OPEN SHEET <b>↗</b></span>
                    </span>
                    <span className="plate-caption">
                      <span className="plate-number plate-label">PLATE {plate.number}</span>
                      <span className="plate-title">{plate.title}</span>
                      <span className="plate-detail">{plate.details}</span>
                      <span className="plate-date">{plate.date} <i>·</i> CIV222</span>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </div>
          <p className="plate-mobile-note page-wrap">Scroll vertically to inspect each sheet. Select a drawing to open its full-size view.</p>
        </section>

        <section id="cost" className="cost-section section-pad" data-blueprint>
          <div className="page-wrap">
            <div className="section-heading section-heading-row reveal">
              <div>
                <p className="eyebrow"><span className="section-index">05</span> COST-ESTIMATION PROJECT</p>
                <h2>A residence estimate,<br /><span>read from the source.</span></h2>
              </div>
              <p className="section-intro text-reveal">
                <span className="sentence-line">Workbook data is presented as recorded, without reclassifying the original subtotal rows</span>
                <span className="sentence-line">or recalculating the workbook-reported area.</span>
              </p>
            </div>

            <div className="estimate-title-block reveal">
              <div className="title-block-main">
                <span className="estimate-label">PROJECT / COST ESTIMATE</span>
                <h3>Two (2) Storey Residence</h3>
                <p>Group 4 <span>·</span> Sheira Mae A. Dacasin &amp; Kia G. Sardona</p>
                <p className="estimate-course">Course in workbook: {bom.course_in_workbook}</p>
              </div>
              <div className="title-block-total">
                <span>ESTIMATED CONSTRUCTION COST</span>
                <strong>{formatPeso(bom.estimated_construction_cost)}</strong>
                <small>As stated in the workbook</small>
              </div>
            </div>

            <div className="area-register reveal">
              <div className="area-entry"><span>GROUND FLOOR</span><strong>{bom.areas.ground} m²</strong></div>
              <div className="area-entry"><span>SECOND FLOOR</span><strong>{bom.areas.second} m²</strong></div>
              <div className="area-entry area-reported">
                <span>WORKBOOK-REPORTED TOTAL FLOOR AREA</span>
                <strong>{bom.areas.workbook_reported_total_floor_area} m²</strong>
              </div>
            </div>
            <p className="area-note reveal">{bom.area_note}</p>

            <div className="cost-progress-rail" aria-hidden="true"><span /></div>
            <div className="estimate-table-wrap reveal" role="region" aria-label="Workbook subtotal details" tabIndex={0}>
              <table className="estimate-table">
                <caption>Subtotal schedule / values displayed as recorded in the workbook</caption>
                <thead>
                  <tr><th scope="col">WORKBOOK ROW</th><th scope="col">MATERIAL</th><th scope="col">LABOR</th><th scope="col">EQUIPMENT</th><th scope="col">OCM</th><th scope="col">TOTAL</th></tr>
                </thead>
                <tbody>
                  {bom.subtotals.map((subtotal, index) => {
                    const maxTotal = Math.max(...bom.subtotals.map((row) => row.total ?? 0));
                    const width = `${((subtotal.total ?? 0) / maxTotal) * 100}%`;
                    return (
                      <tr key={`${subtotal.label}-${index}`}>
                        <th scope="row">
                          <span>{subtotal.label}</span>
                          <span className="estimate-bar" style={{ width }} aria-hidden="true" />
                        </th>
                        <td>{formatPeso(subtotal.material)}</td>
                        <td>{formatPeso(subtotal.labor)}</td>
                        <td>{formatPeso(subtotal.equipment)}</td>
                        <td>{formatPeso(subtotal.ocm)}</td>
                        <td className="subtotal-total">{formatPeso(subtotal.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={6}>“Not listed” indicates that no value is present for that field in the supplied workbook data.</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="estimate-unit reveal">
              <span>ESTIMATED COST PER SQUARE METRE</span>
              <strong>{formatPeso(bom.estimated_cost_per_sqm)} / m²</strong>
            </div>
          </div>
        </section>

        <section id="documentation" className="documentation-section section-pad blueprint-surface" data-blueprint>
          <div className="page-wrap">
            <div className="section-heading section-heading-row reveal">
              <div>
                <p className="eyebrow"><span className="section-index">06</span> PROJECT DOCUMENTATION</p>
                <h2>Drawings, details,<br /><span>and estimate.</span></h2>
              </div>
              <p className="section-intro text-reveal">
                <span className="sentence-line">A visual index of the supplied technical sheets alongside the residence workbook information.</span>
                <span className="sentence-line">Open any drawing to inspect it at full size.</span>
              </p>
            </div>

            <div className="documentation-layout">
              <figure className="document-frame document-frame-lead reveal">
                <div className="document-image document-frame-image">
                  <Image
                    src="/plates/plate-0-frame-thumb.webp"
                    alt="Prepared technical drawing sheet frame"
                    width={640}
                    height={495}
                    sizes="(max-width: 760px) 92vw, 52vw"
                    loading="lazy"
                  />
                </div>
                <figcaption><span>DOCUMENT / 00</span><b>Drawing sheet frame</b><span>TECHNICAL DRAWING SET</span></figcaption>
              </figure>

              <div className="document-index reveal">
                <div className="document-index-head"><span>DOCUMENT REGISTER</span><span>01—05</span></div>
                {plates.map((plate, index) => (
                  <button type="button" className="document-row" key={plate.file} onClick={() => openPlate(index)}>
                    <span className="document-thumb" aria-hidden="true">
                      <Image
                        src={`/plates/${plate.file}-thumb.webp`}
                        alt=""
                        width={160}
                        height={124}
                        sizes="100px"
                        loading="lazy"
                      />
                    </span>
                    <span className="document-number">{plate.number}</span>
                    <b><small>PLATE {plate.number} / CIV222</small>{plate.title}</b>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
                <a className="document-row document-workbook" href="#cost">
                  <span className="document-thumb document-workbook-thumb" aria-hidden="true">BOM</span>
                  <span className="document-number">05</span>
                  <b><small>WORKBOOK / ESTIMATE</small>Residence estimate / BOM</b>
                  <span aria-hidden="true">↓</span>
                </a>
                <p className="document-note">OPEN DRAWING INDEX / SELECT TO VIEW</p>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="process-section section-pad" data-blueprint>
          <div className="page-wrap">
            <div className="section-heading reveal">
              <p className="eyebrow"><span className="section-index">07</span> ENGINEERING PROCESS</p>
              <h2>From first line<br /><span>to clear record.</span></h2>
              <p className="section-intro text-reveal">
                <span className="sentence-line">A simple working sequence for connecting drawings, quantities, estimates,</span>
                <span className="sentence-line">and documentation.</span>
              </p>
            </div>
            <div className="process-layout">
              <div className="process-rail" aria-hidden="true"><span /></div>
              <ol className="process-steps">
                {processSteps.map((step, index) => (
                  <li className="construction-step" key={step}>
                    <span className="process-count">{String(index + 1).padStart(2, "0")}</span>
                    <span className="process-symbol" aria-hidden="true">{["⌁", "⌖", "↔", "∑", "✓", "▤"][index]}</span>
                    <h3>{step}</h3>
                  </li>
                ))}
              </ol>
              <div className="process-footer"><span>REVIEW EACH INPUT</span><span>KEEP THE RECORD CLEAR</span><span>LEARN / REFINE / REPEAT</span></div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section section-pad blueprint-surface" data-blueprint>
          <div className="page-wrap contact-layout">
            <div className="contact-copy reveal">
              <p className="eyebrow"><span className="section-index">08</span> CONTACT / END OF SHEET</p>
              <h2>Let’s talk<br /><span>engineering.</span></h2>
              <p className="text-reveal"><span className="sentence-line">For a conversation about civil engineering, technical drafting, cost estimating, or construction safety.</span></p>
              <div className="contact-card contact-details reveal">
                <div className="contact-card-head"><span>CONTACT DETAILS</span><span>KS—CE / 01</span></div>
                <div className="contact-detail"><span>EMAIL</span><a href="mailto:sardonakia06@gmail.com"><ContactIcon type="email" /> sardonakia06@gmail.com <span aria-hidden="true">↗</span></a></div>
                <div className="contact-detail"><span>PHONE</span><a href="tel:09359579761"><ContactIcon type="phone" /> 09359579761 <span aria-hidden="true">↗</span></a></div>
                <div className="contact-detail"><span>LINKEDIN</span><a href="https://www.linkedin.com/in/kia-sardona-277385188/" target="_blank" rel="noopener noreferrer"><ContactIcon type="network" /> Kia Sardona <span aria-hidden="true">↗</span></a></div>
                <div className="contact-card-foot"><span>ENGINEER IN THE MAKING</span><span>END / 08</span></div>
              </div>
            </div>
            <form
                className="inquiry-form"
                onSubmit={submitInquiry}
                aria-labelledby="inquiry-heading"
                noValidate
              >
                <div className="inquiry-form-heading">
                  <p className="eyebrow"><span className="section-index">INQUIRY / 01</span></p>
                  <h3 id="inquiry-heading">Send an inquiry</h3>
                  <p>Required fields are marked with an asterisk.</p>
                </div>

                <div className="honeypot-field" aria-hidden="true">
                  <label htmlFor="website-confirmation">Leave this field empty</label>
                  <input id="website-confirmation" name="botcheck" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="inquiry-field">
                  <label htmlFor="inquiry-name">Full Name <span aria-hidden="true">*</span></label>
                  <input id="inquiry-name" name="name" type="text" autoComplete="name" maxLength={120} required />
                </div>
                <div className="inquiry-field">
                  <label htmlFor="inquiry-email">Email Address <span aria-hidden="true">*</span></label>
                  <input id="inquiry-email" name="email" type="email" autoComplete="email" maxLength={254} required />
                </div>
                <div className="inquiry-field">
                  <label htmlFor="inquiry-subject">Subject <span aria-hidden="true">*</span></label>
                  <input id="inquiry-subject" name="subject" type="text" maxLength={160} required />
                </div>
                <div className="inquiry-field">
                  <label htmlFor="inquiry-message">Inquiry / Message <span aria-hidden="true">*</span></label>
                  <textarea id="inquiry-message" name="message" rows={5} maxLength={5000} required />
                </div>
                {inquiryFeedback && (
                  <p className={`inquiry-feedback ${inquiryFeedback.type}`} role={inquiryFeedback.type === "error" ? "alert" : "status"} aria-live="polite">
                    {inquiryFeedback.message}
                  </p>
                )}
                <button className="button button-yellow inquiry-submit" type="submit" disabled={isSubmittingInquiry}>
                  {isSubmittingInquiry ? "Sending inquiry..." : "Send inquiry"}
                  <span aria-hidden="true">{isSubmittingInquiry ? "…" : "↗"}</span>
                </button>
            </form>
            <svg className="contact-compass parallax parallax-fast" viewBox="0 0 240 240" fill="none" aria-hidden="true">
              <circle className="blueprint-draw" cx="120" cy="120" r="84" />
              <circle className="blueprint-draw" cx="120" cy="120" r="62" />
              <path className="blueprint-draw" d="M120 18v204M18 120h204M48 48l144 144M192 48 48 192m72-112 18 40-18 40-18-40 18-40Z" />
            </svg>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-wrap footer-content">
          <a className="footer-brand" href="#top"><Image src="/brand/logo.webp" alt="" width={36} height={36} /> KS <span>/ CIVIL ENGINEERING</span></a>
          <p>Technical drafting <i>·</i> Cost estimates <i>·</i> Construction documentation</p>
          <a className="footer-top" href="#top">BACK TO TOP ↑</a>
          <small>
            © {new Date().getFullYear()} Kia G. Sardona
            <span className="footer-credit">Website created by Lenj Magsino</span>
          </small>
        </div>
      </footer>

      {lightboxIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Plate ${plates[lightboxIndex].number}: ${plates[lightboxIndex].title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
        >
          <div className="lightbox-head">
            <span>TECHNICAL PLATE / {plates[lightboxIndex].number}</span>
            <button type="button" data-lightbox-control ref={closeButton} onClick={() => setLightboxIndex(null)} aria-label="Close drawing viewer">CLOSE <span aria-hidden="true">×</span></button>
          </div>
          <div className="lightbox-stage">
            <Image
              src={`/plates/${plates[lightboxIndex].file}.webp`}
              alt={`Full-size technical drawing, Plate ${plates[lightboxIndex].number}: ${plates[lightboxIndex].title} — ${plates[lightboxIndex].details}`}
              width={1650}
              height={1275}
              sizes="96vw"
              priority
              className="lightbox-image"
            />
          </div>
          <div className="lightbox-caption">
            <div><b>{plates[lightboxIndex].title}</b><span>{plates[lightboxIndex].details} · {plates[lightboxIndex].date}</span></div>
            <div className="lightbox-controls">
              <button type="button" data-lightbox-control onClick={() => setLightboxIndex((lightboxIndex + plates.length - 1) % plates.length)} aria-label="Previous plate">← PREVIOUS</button>
              <button type="button" data-lightbox-control onClick={() => setLightboxIndex((lightboxIndex + 1) % plates.length)} aria-label="Next plate">NEXT →</button>
            </div>
          </div>
          <p className="lightbox-hint">Use ← → to navigate · ESC to close</p>
        </div>
      )}
    </div>
  );
}

function ContactIcon({ type }: { type: "email" | "phone" | "network" }) {
  const paths = {
    email: "M3 5.5h18v13H3zM3.5 6l8.5 6.5L20.5 6",
    phone: "M7 3.5h10v17H7zM10 6h4m-3 11.5h2",
    network: "M5 5.5h14v14H5zM9 10v6m0-8v.1M12 16v-6h2.5a2.5 2.5 0 0 1 2.5 2.5V16",
  };

  return (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path className="contact-icon-path" d={paths[type]} />
    </svg>
  );
}
