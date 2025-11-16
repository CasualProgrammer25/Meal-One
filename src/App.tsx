import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { SignUpModal } from "./components/SignUpModal";
import { MealSearch } from "./components/MealSearch";
import { DonationPage } from "./components/DonationPage";
import { CreateMealPage } from "./components/CreateMealPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

type View = "landing" | "search" | "donate" | "create";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleGetStarted = () => {
    setCurrentView("search");
  };

  const handleSignUp = () => {
    setShowSignUpModal(true);
  };

  const handleSignUpSuccess = () => {
    toast.success("Account created successfully! You can now search for meals.");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleDonate = () => {
    setCurrentView("donate");
  };

  const handleCreateMeal = () => {
    setCurrentView("create");
  };

  const handleBackToSearch = () => {
    setCurrentView("search");
  };

  return (
    <>
      {currentView === "landing" && (
        <LandingPage
          onGetStarted={handleGetStarted}
          onSignUp={handleSignUp}
          onDonate={handleDonate}
        />
      )}

      {currentView === "search" && (
        <MealSearch 
          onBack={handleBackToLanding}
          onDonate={handleDonate}
          onCreateMeal={handleCreateMeal}
        />
      )}

      {currentView === "donate" && (
        <DonationPage onBack={handleBackToSearch} />
      )}

      {currentView === "create" && (
        <CreateMealPage onBack={handleBackToSearch} />
      )}

      <SignUpModal
        open={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={handleSignUpSuccess}
      />

      <Toaster />
    </>
  );
}