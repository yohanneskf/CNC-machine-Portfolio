"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "am";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "hero.title": "Precision CNC Furniture Design",
    "hero.subtitle": "Custom furniture solutions with industrial precision",
    "hero.cta": "View Projects",
    "hero.contact": "Get Quote",
    "projects.title": "Featured Projects",
    "projects.all": "View All Projects",
    "projects.category.all": "All",
    "projects.category.living": "Living Room",
    "projects.category.bedroom": "Bedroom",
    "projects.category.office": "Office",
    "projects.category.commercial": "Commercial",
    "contact.title": "Request a Custom Design",
    "contact.subtitle": "Get a quote for your furniture project",
    "contact.name": "Full Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.project": "Project Type",
    "contact.description": "Project Description",
    "contact.budget": "Estimated Budget",
    "contact.timeline": "Timeline",
    "contact.submit": "Submit Request",
    "footer.copyright": "All rights reserved",
  },
  am: {
    "nav.home": "መነሻ",
    "nav.projects": "ፕሮጀክቶች",
    "nav.about": "ስለ እኛ",
    "nav.contact": "አግኙን",
    "nav.admin": "አስተዳዳሪ",
    "hero.title": "ትክክለኛ CNC የዕቃ ንድፍ",
    "hero.subtitle": "በኢንዱስትሪ ትክክለኛነት የተለመዱ የዕቃ መፍትሄዎች",
    "hero.cta": "ፕሮጀክቶችን ይመልከቱ",
    "hero.contact": "ዋጋ ያግኙ",
    "projects.title": "የተለዩ ፕሮጀክቶች",
    "projects.all": "ሁሉንም ፕሮጀክቶች ይመልከቱ",
    "projects.category.all": "ሁሉም",
    "projects.category.living": "ክፍል አቀማመጥ",
    "projects.category.bedroom": "የእርግብ ክፍል",
    "projects.category.office": "ቢሮ",
    "projects.category.commercial": "ንግድ",
    "contact.title": "ብጁ ዲዛይን ይጠይቁ",
    "contact.subtitle": "ለዕቃ ፕሮጀክትዎ ዋጋ ያግኙ",
    "contact.name": "ሙሉ ስም",
    "contact.email": "የኢሜል አድራሻ",
    "contact.phone": "ስልክ ቁጥር",
    "contact.project": "የፕሮጀክት አይነት",
    "contact.description": "የፕሮጀክት መግለጫ",
    "contact.budget": "የተገመተ በጀት",
    "contact.timeline": "ጊዜ መርሐግብር",
    "contact.submit": "ጥያቄ አስገባ",
    "footer.copyright": "ሁሉም መብቶች የተጠበቁ ናቸው",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "am" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
