import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { ArrowLeft, Heart, ExternalLink, ChefHat } from "lucide-react";

interface DonationPageProps {
  onBack: () => void;
}

export function DonationPage({ onBack }: DonationPageProps) {
  const organizations = [
    {
      name: "Food At First",
      description: "Working to end hunger in the Greater New Haven area by providing nutritious food and essential services to those in need.",
      website: "https://www.foodatfirst.org",
      impact: "Serves over 2,000 individuals monthly"
    },
    {
      name: "Feeding America",
      description: "The nation's largest domestic hunger-relief organization with a network of food banks across the country.",
      website: "https://www.feedingamerica.org",
      impact: "Supports 40 million people annually"
    },
    {
      name: "World Central Kitchen",
      description: "First to the frontlines, providing meals in response to humanitarian, climate, and community crises.",
      website: "https://wck.org",
      impact: "Served 350+ million meals worldwide"
    },
    {
      name: "No Kid Hungry",
      description: "Working to end childhood hunger in America through effective programs that provide kids with the food they need.",
      website: "https://www.nokidhungry.org",
      impact: "Connected kids to 1.7 billion meals"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <ChefHat className="size-6 text-orange-600" />
              <span className="text-gray-900">MealFinder</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Heart className="size-10 text-green-600 fill-green-600" />
          </div>
          <h1 className="text-gray-900 mb-4">Make a Difference Today</h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Your donation can make a real impact in fighting hunger and food insecurity. 
            Support these incredible organizations working to ensure everyone has access to nutritious meals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {organizations.map((org, index) => (
            <Card key={index} className="hover:shadow-xl transition-all border-2 hover:border-green-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{org.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {org.impact}
                    </CardDescription>
                  </div>
                  <Heart className="size-6 text-green-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{org.description}</p>
                <Button
                  onClick={() => window.open(org.website, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                  size="lg"
                >
                  Donate to {org.name}
                  <ExternalLink className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white">
          <CardContent className="p-8">
            <h2 className="text-white mb-4">Why Your Support Matters</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <span className="text-white/90">Every dollar donated helps provide meals to families in need</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <span className="text-white/90">Support sustainable food programs and nutrition education</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <span className="text-white/90">Help build stronger, healthier communities</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <span className="text-white/90">Your contribution is tax-deductible</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}