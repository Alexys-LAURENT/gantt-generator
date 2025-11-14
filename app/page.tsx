"use client";

import Footer from "@/components/Footer";
import GanttToolSection from "@/components/GanttToolSection";
import HeroSection from "@/components/HeroSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { APP_URL, AUTHOR, IMAGES, SEO } from "@/lib/config";
import Script from "next/script";

export type Task = {
  key: number;
  name: string;
  start_date: string;
  end_date: string;
  group?: string;
  depends?: number[];
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Gantt Chart Generator",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Project Management",
  operatingSystem: "Any",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "127",
  },
  creator: {
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.github,
    sameAs: [AUTHOR.linkedin, AUTHOR.github],
  },
  description: SEO.description,
  featureList: [
    "JSON configuration",
    "Task dependencies visualization",
    "Visual grouping",
    "High-quality PNG export",
    "No registration required",
    "Free to use",
    "Intuitive interface",
    "Real-time preview",
  ],
  screenshot: `${APP_URL}${IMAGES.ogImage}`,
  url: APP_URL,
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  softwareVersion: "1.0",
  datePublished: "2025-11-14",
  dateModified: "2025-11-14",
  inLanguage: ["en", "fr"],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: APP_URL,
    },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Gantt Generator",
  url: APP_URL,
  logo: `${APP_URL}${IMAGES.manifest512}`,
  founder: {
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.github,
  },
  sameAs: [AUTHOR.github],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Gantt Generator free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Gantt Generator is completely free to use. There are no hidden costs or premium features. You can create unlimited Gantt charts without any registration.",
      },
    },
    {
      "@type": "Question",
      name: "What format does the tool accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool accepts JSON format for defining tasks. Each task should have a unique key, name, start date, end date, and optionally a group and dependencies on other tasks.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export my Gantt chart?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can export your Gantt chart as a high-quality PNG image. This is perfect for presentations, reports, or sharing with your team.",
      },
    },
    {
      "@type": "Question",
      name: "Does it support task dependencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can define dependencies between tasks. The tool will visualize these relationships with colored arrows, making it easy to understand task relationships and critical paths.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="json-ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-white">
        <LanguageSwitcher />
        <HeroSection />
        <GanttToolSection />
        <Footer />
      </div>
    </>
  );
}
