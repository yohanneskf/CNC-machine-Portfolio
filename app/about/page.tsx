"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FiCheck, FiUsers, FiAward, FiPackage } from "react-icons/fi";
import Image from "next/image";

export default function AboutPage() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "About CNC Design Studio",
      subtitle: "Precision meets craftsmanship in furniture design",
      mission: {
        title: "Our Mission",
        description:
          "To revolutionize furniture design through CNC precision, creating bespoke pieces that combine functionality with artistic expression.",
      },
      vision: {
        title: "Our Vision",
        description:
          "To be the leading CNC furniture design studio globally, recognized for innovation, quality, and sustainable practices.",
      },
      values: [
        {
          title: "Precision",
          description:
            "Every cut, every joint, every detail executed with CNC accuracy",
        },
        {
          title: "Innovation",
          description: "Pushing boundaries with new designs and techniques",
        },
        {
          title: "Quality",
          description: "Using premium materials and proven craftsmanship",
        },
        {
          title: "Sustainability",
          description: "Eco-friendly practices and responsible sourcing",
        },
      ],
      stats: [
        { label: "Projects Completed", value: "200+" },
        { label: "Happy Clients", value: "150+" },
        { label: "Years Experience", value: "8+" },
        { label: "Materials Used", value: "25+" },
      ],
      process: [
        {
          title: "Consultation",
          description: "Understanding your needs and vision",
        },
        {
          title: "Design",
          description: "Creating detailed 3D models and plans",
        },
        {
          title: "Production",
          description: "CNC precision cutting and assembly",
        },
        {
          title: "Delivery",
          description: "Professional installation and setup",
        },
      ],
    },
    am: {
      title: "ስለ CNC ዲዛይን ስቱዲዮ",
      subtitle: "ትክክለኛነት በዕቃ ንድፍ ውስጥ ከሠራተኛነት ጋር ይገናኛል",
      mission: {
        title: "ተልእኳችን",
        description:
          "በCNC ትክክለኛነት የዕቃ ንድፍን በማማወር፣ ተግባራዊነትን ከሥነ ጥበባዊ አገላለጽ ጋር የሚያጣምሩ ብጁ ቁራጮችን መፍጠር።",
      },
      vision: {
        title: "ራዕያችን",
        description:
          "በአለም አቀፍ ደረጃ መሪ CNC የዕቃ ንድፍ ስቱዲዮ መሆን፣ ለማሕበረሰብ፣ ጥራት እና ዘላቂ ተግባሮች ተገኝቶ።",
      },
      values: [
        {
          title: "ትክክለኛነት",
          description:
            "እያንዳንዱ መቁረጥ፣ እያንዳንዱ መገጣጠም፣ እያንዳንዱ ዝርዝር በCNC ትክክለኛነት ይከናወናል",
        },
        {
          title: "ማሕበረሰብ",
          description: "በአዲስ ዲዛይኖች እና ቴክኒኮች ወሰኖችን መጉላላት",
        },
        {
          title: "ጥራት",
          description: "የፕሪሚየም ቁሳቁሶችን እና የተረጋገጠ የሠራተኛነት ክህሎትን መጠቀም",
        },
        {
          title: "ዘላቂነት",
          description: "ኢኮ-ፍሬንድሊ ተግባሮች እና ተጠያቂ ምንጭ",
        },
      ],
      stats: [
        { label: "የተጠናቀቁ ፕሮጀክቶች", value: "200+" },
        { label: "ደስተኞች ደንበኞች", value: "150+" },
        { label: "የልምድ ዓመታት", value: "8+" },
        { label: "የተጠቀሙ ቁሳቁሶች", value: "25+" },
      ],
      process: [
        {
          title: "ምክክር",
          description: "ፍላጎቶችዎን እና ራዕይዎን መረዳት",
        },
        {
          title: "ንድፍ",
          description: "ዝርዝር 3D ሞዴሎች እና ዕቅዶች መፍጠር",
        },
        {
          title: "ማምረቻ",
          description: "CNC ትክክለኛ መቁረጥ እና ማቀናበር",
        },
        {
          title: "አቅርቦት",
          description: "ሙያዊ መጫን እና ማቀናበር",
        },
      ],
    },
  };

  const t = language === "en" ? content.en : content.am;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-blue-600 mb-4">
              <FiAward className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.mission.title}
            </h3>
            <p className="text-gray-600">{t.mission.description}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-blue-600 mb-4">
              <FiPackage className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.vision.title}
            </h3>
            <p className="text-gray-600">{t.vision.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {t.stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === "en" ? "Our Core Values" : "የእኛ ዋና እሴቶች"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <FiCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === "en" ? "Our Process" : "የእኛ ሂደት"}
          </h2>
          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            <div className="grid md:grid-cols-4 gap-8">
              {t.process.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center relative z-10">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
