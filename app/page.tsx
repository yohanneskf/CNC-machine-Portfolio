"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import Services from "@/components/Services";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <Hero />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("projects.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </div>
          <FeaturedProjects />
        </div>
      </section>

      <Services />
    </>
  );
}
