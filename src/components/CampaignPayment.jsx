import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSignIcon,
  HeartIcon,
  UserIcon,
  MailIcon,
  CreditCardIcon,
} from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import apiConfig from "@/config/apiConfig";

const CampaignPayment = () => {
  const { campaignId } = useParams();
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [campaign, setCampaign] = useState(null);
  const location = useLocation();

  // Predefined donation amounts
  const donationPresets = [25, 50, 100, 250, 500];

  // Fetch single campaign data on mount
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setIsLoading(true);
        const response = await apiConfig.get(`/campaigns/${campaignId}`);
        setCampaign(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching campaign:", error);
        setError(
          "Failed to load campaign details. Please check your connection and try again."
        );
        toast.error(error.message);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const handleDonationAmountSelect = (amount) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setDonationAmount(value);
    setCustomAmount(value);
  };

  const validateEmail = (email) => {
    // Basic email regex validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isFormValid = () => {
    return (
      donationAmount > 0 &&
      campaignId &&
      fullName.trim() !== "" &&
      validateEmail(email)
    );
  };
  const handleDonation = async () => {
    if (!isFormValid()) {
      toast.error("Please fill out the form correctly");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const submitData = {
        donationId: Date.now().toString(),
        amount: donationAmount,
        campaignId: campaignId,
      };

      const response = await apiConfig.post("/donate/stripe", submitData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        window.location.href = response.data;
      } else {
        throw new Error("Failed to create Stripe session");
      }
    } catch (error) {
      console.error("Donation submission error:", error);

      if (error.response) {
        setError(
          error.response.data.message || "Failed to process the donation."
        );
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(error.message || "An unexpected error occurred.");
      }
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDonation();
  };

  if (isLoading) {
    return <p className='text-center'>Loading campaign details...</p>;
  }
  if (error) {
    return <p className='text-center text-red-500'>{error}</p>;
  }

  if (!campaign) {
    return <p className='text-center'>Campaign not found</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900'
    >
      <Navbar />

      <div className='container mx-auto px-4 py-24'>
        <div className='grid md:grid-cols-2 gap-12'>
          {/* Donation Form Section */}
          <div>
            <h1 className='text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400'>
              {campaign.title}
            </h1>
            <p className='text-gray-600 dark:text-gray-300 mb-8'>
              {campaign.description}
            </p>

            {/* Donation Amount Selection */}
            <div className='mb-6'>
              <Label className='block mb-2'>Donation Amount</Label>
              <div className='flex flex-wrap gap-3 mb-4'>
                {donationPresets.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleDonationAmountSelect(amount)}
                    className={`
                      px-4 py-2 rounded-full border transition-all
                      ${
                        donationAmount == amount
                          ? "bg-indigo-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                      }
                    `}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className='flex items-center'>
                <div className='relative flex-grow'>
                  <DollarSignIcon
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                    size={20}
                  />
                  <Input
                    type='number'
                    placeholder='Enter custom amount'
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className='pl-10'
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Donor Information */}
            <div className='space-y-4 mb-6'>
              <div>
                <Label>Full Name</Label>
                <div className='relative'>
                  <UserIcon
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                    size={20}
                  />
                  <Input
                    placeholder='Your full name'
                    className='pl-10'
                    value={fullName}
                    onChange={handleFullNameChange}
                  />
                </div>
              </div>
              <div>
                <Label>Email Address</Label>
                <div className='relative'>
                  <MailIcon
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                    size={20}
                  />
                  <Input
                    type='email'
                    placeholder='your.email@example.com'
                    className='pl-10'
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
              </div>
            </div>

            {/* Donation Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isLoading}
              className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <CreditCardIcon className='mr-2' /> Donate Now
                </>
              )}
            </Button>
          </div>

          {/* Campaign Impact Section */}
          <div>
            <h2 className='text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400'>
              Campaign Highlights
            </h2>
            <Card className='mb-6 hover:shadow-xl transition-all'>
              <CardHeader className='flex flex-row items-center space-x-4'>
                <HeartIcon
                  className='text-indigo-600 dark:text-indigo-400'
                  size={36}
                />
                <CardTitle>{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 dark:text-gray-300 mb-4'>
                  {campaign.description}
                </p>
                <div className='flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400'>
                  <span>Goal: ${campaign.fundraisingGoal}</span>
                  {/*  Calculate amount raised here based on donations */}
                  <span>Raised: $0</span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2'>
                  <div
                    className='bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 h-2.5 rounded-full'
                    style={{ width: `0%` }}
                  />
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400 text-right'>
                  0% Funded
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default CampaignPayment;