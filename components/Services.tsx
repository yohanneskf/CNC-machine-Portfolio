"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  FiTool,
  FiCpu,
  FiSettings,
  FiTruck,
  FiCheckCircle,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import Link from "next/link";

interface Service {
  icon: React.ReactNode;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  features: string[];
}

export default function Services() {
  const { language, t } = useLanguage();

  const services: Service[] = [
    {
      icon: <FiTool className="h-8 w-8" />,
      titleEn: "CNC Furniture Design",
      titleAm: "CNC የዕቃ ንድፍ",
      descriptionEn:
        "Custom furniture design using advanced CNC technology for precision and perfection.",
      descriptionAm: "ብጁ የዕቃ ንድፍ የላቀ CNC ቴክኖሎጂ በመጠቀም ለትክክለኛነት እና ፍጹምነት።",
      features: ["3D Modeling", "Material Selection", "Precision Cutting"],
    },
    {
      icon: <FiCpu className="h-8 w-8" />,
      titleEn: "3D Modeling & CAD",
      titleAm: "3D ሞዴሊንግ & CAD",
      descriptionEn:
        "Detailed 3D models and CAD drawings for perfect visualization before production.",
      descriptionAm: "ዝርዝር 3D ሞዴሎች እና CAD ስዕሎች ከማምረቻው በፊት ፍጹም የሆነ ምስላዊነት።",
      features: ["AutoCAD Designs", "3D Rendering", "Technical Drawings"],
    },
    {
      icon: <FiSettings className="h-8 w-8" />,
      titleEn: "Custom Manufacturing",
      titleAm: "ብጁ ማምረቻ",
      descriptionEn:
        "From concept to creation, we manufacture custom pieces with industrial precision.",
      descriptionAm: "ከሃሳብ እስከ ፍጠራ፣ ብጁ ቁራጮችን በኢንዱስትሪ ትክክለኛነት እንሠራለን።",
      features: ["Prototype Development", "Bulk Production", "Quality Control"],
    },
    {
      icon: <FiTruck className="h-8 w-8" />,
      titleEn: "Installation & Delivery",
      titleAm: "መጫን & አቅራቢያ",
      descriptionEn:
        "Professional installation and nationwide delivery of your custom furniture.",
      descriptionAm: "ሙያዊ መጫን እና በመላው ሀገር ያለው የብጁ ዕቃዎችዎ አቅራቢያ።",
      features: [
        "Professional Setup",
        "Nationwide Delivery",
        "Post-Installation Support",
      ],
    },
  ];

  const features = [
    {
      icon: <FiCheckCircle />,
      textEn: "Precision CNC Technology",
      textAm: "ትክክለኛ CNC ቴክኖሎጂ",
    },
    {
      icon: <FiCheckCircle />,
      textEn: "Quality Materials",
      textAm: "ጥራት ያላቸው ቁሳቁሶች",
    },
    {
      icon: <FiCheckCircle />,
      textEn: "Expert Craftsmanship",
      textAm: "ባለሙያ የሠራተኛነት",
    },
    { icon: <FiCheckCircle />, textEn: "On-Time Delivery", textAm: "በጊዜ ማቅረብ" },
    { icon: <FiCheckCircle />, textEn: "Custom Design", textAm: "ብጁ ንድፍ" },
    {
      icon: <FiCheckCircle />,
      textEn: "Lifetime Support",
      textAm: "ህይወት ድረስ ድጋፍ",
    },
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "en" ? "Our CNC Services" : "የCNC አገልግሎቶቻችን"}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "en"
              ? "From design to installation, we provide complete CNC furniture solutions"
              : "ከንድፍ እስከ መጫን ፣ ሙሉ CNC የዕቃ መፍትሄዎችን እናቀርባለን"}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors group"
            >
              <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {language === "en" ? service.titleEn : service.titleAm}
              </h3>
              <p className="text-gray-400 mb-4">
                {language === "en"
                  ? service.descriptionEn
                  : service.descriptionAm}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-300 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {language === "en" ? "Why Choose Us?" : "ለምን እኛን ይምረጡ?"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-green-400">{feature.icon}</div>
                    <span className="text-gray-300">
                      {language === "en" ? feature.textEn : feature.textAm}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {language === "en" ? "Start Your Project" : "ፕሮጀክትዎን ይጀምሩ"}
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FiUsers className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">
                    {language === "en" ? "Client Satisfaction" : "ደንበኛ እርካታ"}
                  </h4>
                  <p className="text-gray-400">
                    {language === "en"
                      ? "100+ successful projects delivered"
                      : "100+ የተሳካ ፕሮጀክቶች ተላልፈዋል"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
