import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RocketIcon,
  HeartIcon,
  GlobeIcon,
  ArrowRightIcon,
  UsersIcon,
  TrendingUpIcon,
  ShieldIcon,
  HelpCircleIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "@/Footer";

// Theme Management Hook
// This custom hook handles theme state, system preferences, and localStorage persistence
const useTheme = () => {
  // Initialize theme based on system preference or saved preference
  const [theme, setTheme] = useState(() => {
    // Safely retrieve and validate the theme from localStorage
    const savedTheme = localStorage.getItem("theme");

    // Check if savedTheme is a valid theme
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    // Fallback to system preference
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDarkMode ? "dark" : "light";
  });

  // Rest of the hook remains the same...
  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove("light", "dark");

    // Add current theme class
    root.classList.add(theme);

    // Persist theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};

// Animation Configurations for Framer Motion
// Provides smooth, staggered animations for list items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
};

// Home Component: Main Landing Page
const Home = () => {
  // Use theme management hook
  const { theme, toggleTheme } = useTheme();

  // State to manage active content tab
  const [activeTab, setActiveTab] = useState("campaigns");

  // Featured Campaigns Data
  const featuredCampaigns = [
    {
      title: "Global Education Initiative",
      description:
        "Provide scholarships and learning resources to underprivileged children worldwide",
      progress: 75,
      goal: "$250,000",
      raised: "$187,500",
      icon: RocketIcon,
      category: "Education",
    },
    {
      title: "Clean Water Project",
      description:
        "Bring sustainable safe drinking water to rural communities in developing regions",
      progress: 60,
      goal: "$500,000",
      raised: "$300,000",
      icon: HeartIcon,
      category: "Humanitarian",
    },
    {
      title: "Medical Support Fund",
      description:
        "Comprehensive medical expense support for individuals without healthcare access",
      progress: 50,
      goal: "$350,000",
      raised: "$175,000",
      icon: GlobeIcon,
      category: "Health",
    },
  ];

  // Platform Features Data
  const platformFeatures = [
    {
      icon: UsersIcon,
      title: "Comprehensive User Management",
      description:
        "Seamless account creation with multi-authentication options",
      details: [
        "Email & Social Media Login",
        "Personalized User Profiles",
        "Role-Based Access Control",
      ],
    },
    {
      icon: TrendingUpIcon,
      title: "Advanced Campaign Analytics",
      description: "AI-powered insights to optimize fundraising strategies",
      details: [
        "Real-Time Performance Tracking",
        "Donor Demographic Insights",
        "Predictive Fundraising Recommendations",
      ],
    },
    {
      icon: ShieldIcon,
      title: "Robust Security Framework",
      description: "Comprehensive security measures for data protection",
      details: [
        "End-to-End Data Encryption",
        "Fraud Prevention Mechanisms",
        "Regulatory Compliance Monitoring",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen 
        bg-gradient-to-br 
        from-blue-50 via-indigo-50 to-purple-50
        dark:from-gray-900 dark:via-gray-900 dark:to-gray-900'
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        aria-label='Toggle Theme'
        className='fixed top-4 right-4 z-50 
          bg-white dark:bg-gray-800 
          text-gray-800 dark:text-white 
          p-2 rounded-full 
          shadow-md hover:shadow-lg 
          transition-all'
      >
        {theme === "light" ? <MoonIcon size={24} /> : <SunIcon size={24} />}
      </button>

      {/* Navbar */}
      <Navbar />

      {/* Main Content with Top Padding */}
      <div className='pt-24'>
        {/* Hero Section */}
        <div className='container mx-auto px-5 py-16 text-center'>
          <h1
            className='text-5xl font-bold mb-4 py-2
            text-transparent bg-clip-text 
            bg-gradient-to-r from-indigo-600 to-purple-600
            dark:from-indigo-400 dark:to-purple-400'
          >
            Empowering Change, Transforming Lives
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
            A revolutionary platform connecting passionate creators with global
            supporters, enabling impactful fundraising through technology and
            transparency
          </p>

          {/* Call to Action Buttons */}
          <div className='flex justify-center space-x-4'>
            <Button
              size='lg'
              className='bg-gradient-to-r 
                from-indigo-600 to-purple-600 
                hover:from-indigo-700 hover:to-purple-700
                dark:from-indigo-500 dark:to-purple-500
                dark:hover:from-indigo-600 dark:hover:to-purple-600'
            >
              Start Your Campaign <ArrowRightIcon className='ml-2' size={20} />
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='border-indigo-600 text-indigo-600 
                hover:bg-indigo-50
                dark:border-indigo-400 dark:text-indigo-400 
                dark:hover:bg-indigo-900/20'
            >
              Explore Causes
            </Button>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className='container mx-auto py-16'>
          {/* Tab Navigation */}
          <div className='flex justify-center mb-8'>
            <div className='bg-white dark:bg-white/90 rounded-full p-1 shadow-md flex'>
              <Button
                variant={activeTab === "campaigns" ? "default" : "ghost"}
                onClick={() => setActiveTab("campaigns")}
                className='rounded-full'
              >
                Featured Campaigns
              </Button>
              <Button
                variant={activeTab === "features" ? "default" : "ghost"}
                onClick={() => setActiveTab("features")}
                className='rounded-full'
              >
                Platform Features
              </Button>
            </div>
          </div>

          {/* Content Display */}
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid md:grid-cols-3 gap-6'
          >
            {activeTab === "campaigns"
              ? featuredCampaigns.map((campaign, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card
                      className='hover:shadow-xl transition-all group 
                        bg-white dark:bg-gray-800 
                        border dark:border-gray-700'
                    >
                      <CardHeader className='flex items-center'>
                        <campaign.icon
                          className='text-indigo-600 dark:text-indigo-400 
                            group-hover:scale-110 transition-transform'
                          size={36}
                        />
                        <CardTitle className='ml-4 dark:text-white'>
                          {campaign.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='text-gray-600 dark:text-gray-300 mb-4'>
                          {campaign.description}
                        </p>
                        <div className='flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400'>
                          <span>Goal: {campaign.goal}</span>
                          <span>Raised: {campaign.raised}</span>
                        </div>
                        <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2'>
                          <div
                            className='bg-gradient-to-r 
                              from-indigo-600 to-purple-600 
                              dark:from-indigo-500 dark:to-purple-500 
                              h-2.5 rounded-full'
                            style={{ width: `${campaign.progress}%` }}
                          />
                        </div>
                        <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400'>
                          <span>{campaign.progress}% Funded</span>
                          <span>{campaign.category}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : platformFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className='bg-white dark:bg-gray-800 
                      rounded-2xl p-6 
                      shadow-lg hover:shadow-xl 
                      transition-all 
                      border dark:border-gray-700'
                  >
                    <feature.icon
                      className='text-indigo-600 dark:text-indigo-400 mb-4'
                      size={48}
                    />
                    <h3 className='text-xl font-semibold mb-3 dark:text-white'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 mb-4'>
                      {feature.description}
                    </p>
                    <ul className='space-y-2 text-sm text-gray-500 dark:text-gray-400'>
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className='flex items-center'>
                          <HelpCircleIcon
                            className='mr-2 text-indigo-500 dark:text-indigo-400'
                            size={16}
                          />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Home;
