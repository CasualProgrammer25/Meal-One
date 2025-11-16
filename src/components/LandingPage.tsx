import { Button } from "./ui/button";
import { ChefHat, DollarSign, MapPin, TrendingUp } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onSignUp: () => void;
  onDonate: () => void;
}

export function LandingPage({ onGetStarted, onSignUp, onDonate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
            <ChefHat className="size-8 text-white" />
          </div>
          <span className="text-white text-xl">MealFinder</span>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={onDonate} 
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
            variant="outline"
          >
            Donate
          </Button>
          <Button 
            onClick={onSignUp} 
            className="bg-white text-orange-600 hover:bg-white/90"
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: '1.1', fontWeight: '900' }}>
            FIND MEALS
            <br />
            WITHIN YOUR
            <br />
            BUDGET
          </h1>
          
          <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto">
            Discover delicious recipes with detailed ingredient pricing and store locations. 
            Make smart meal choices that fit your budget.
          </p>

          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-7 text-xl rounded-full shadow-2xl"
          >
            Get Started
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="size-7 text-white" />
            </div>
            <h3 className="text-white mb-2">Budget-Friendly</h3>
            <p className="text-white/80">
              Filter meals by your budget and see exact pricing for every ingredient
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="size-7 text-white" />
            </div>
            <h3 className="text-white mb-2">Store Locations</h3>
            <p className="text-white/80">
              Know exactly where to buy each ingredient at the best price
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="size-7 text-white" />
            </div>
            <h3 className="text-white mb-2">Nutrition Info</h3>
            <p className="text-white/80">
              View detailed macros including calories, protein, carbs, and fats
            </p>
          </div>
        </div>
      </main>

      {/* Decorative corners */}
      <div className="fixed top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-white/20"></div>
      <div className="fixed top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-white/20"></div>
      <div className="fixed bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-white/20"></div>
      <div className="fixed bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-white/20"></div>
    </div>
  );
}