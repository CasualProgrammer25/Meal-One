import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Search, ChefHat, MapPin, DollarSign, ArrowLeft, Plus, Heart } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Ingredient {
  name: string;
  price: number;
  store: string;
}

interface MealDetails {
  meal: string;
  ingredients: Ingredient[];
  totalPrice: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface MealSearchProps {
  onBack: () => void;
  onDonate: () => void;
  onCreateMeal: () => void;
}

export function MealSearch({ onBack, onDonate, onCreateMeal }: MealSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [allMeals, setAllMeals] = useState<string[]>([]);
  const [mealDetails, setMealDetails] = useState<MealDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all meals on mount for autocomplete
  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-48790404/meals`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }

        const data = await response.json();
        setAllMeals(data.meals);
      } catch (err) {
        console.error("Error fetching meals:", err);
      }
    };

    fetchAllMeals();
  }, []);

  const handleSearch = async (mealName?: string) => {
    const query = mealName || searchQuery;
    if (!query.trim()) return;

    setError("");
    setLoading(true);
    setMealDetails(null);

    try {
      // First search for meals
      const searchResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48790404/search-meals?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!searchResponse.ok) {
        throw new Error("Failed to search meals");
      }

      const searchData = await searchResponse.json();
      setSearchResults(searchData.meals);

      // If exactly one result, fetch its details automatically
      if (searchData.meals.length === 1) {
        await fetchMealDetails(searchData.meals[0]);
      } else if (searchData.meals.length === 0) {
        setError("No meals found. Try searching for 'pizza', 'tacos', or 'salad'.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSearch = async () => {
    const budgetValue = parseFloat(budget);
    if (!budgetValue || budgetValue <= 0) {
      setError("Please enter a valid budget");
      return;
    }

    setError("");
    setLoading(true);
    setMealDetails(null);
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48790404/meals-by-budget?budget=${budgetValue}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search meals by budget");
      }

      const data = await response.json();
      
      if (data.meals.length === 0) {
        setError(`No meals found within $${budgetValue} budget. Try increasing your budget.`);
      } else {
        setSearchResults(data.meals.map((m: any) => m.name));
      }
    } catch (err) {
      console.error("Budget search error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchMealDetails = async (mealName: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48790404/meal/${encodeURIComponent(mealName)}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meal details");
      }

      const data = await response.json();
      setMealDetails(data);
      setSearchResults([]);
    } catch (err) {
      console.error("Error fetching meal details:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filter meals for suggestions
  const suggestions = searchQuery.trim()
    ? allMeals.filter((meal) =>
        meal.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="size-4" />
                Home
              </Button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <ChefHat className="size-6 text-orange-600" />
                <span className="text-gray-900">MealFinder</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={onCreateMeal}
                className="bg-orange-600 hover:bg-orange-700 gap-2"
              >
                <Plus className="size-4" />
                Create Meal
              </Button>
              <Button
                onClick={onDonate}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Heart className="size-4" />
                Donate
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-gray-900 mb-2">Find Your Perfect Meal</h1>
          <p className="text-gray-600">Search by name or filter by your budget</p>
        </div>

        <div className="mb-8 space-y-6">
          {/* Main Search */}
          <div className="relative">
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="size-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder="Search for meals (e.g., 'Spaghetti', 'Tacos', 'Salad')..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-12 h-14 text-lg border-0 focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    onClick={() => handleSearch()}
                    disabled={loading || !searchQuery.trim()}
                    className="bg-orange-600 hover:bg-orange-700 h-14 px-8"
                    size="lg"
                  >
                    Search
                  </Button>
                </div>

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {suggestions.map((meal, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(meal);
                          handleSearch(meal);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <span className="text-gray-700">{meal}</span>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Budget Filter */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-lg p-3">
                  <DollarSign className="size-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">Set Your Budget</p>
                  <p className="text-gray-600">Find meals that fit your price range</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Input
                  type="number"
                  placeholder="Enter budget (e.g., 25.00)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="flex-1 h-12"
                  min="0"
                  step="0.01"
                />
                <Button
                  onClick={handleBudgetSearch}
                  disabled={loading || !budget}
                  className="bg-green-600 hover:bg-green-700 h-12 px-8"
                >
                  Find Meals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Search Results (Multiple meals) */}
        {!loading && searchResults.length > 1 && (
          <div>
            <h2 className="text-gray-900 mb-4">Select a Meal</h2>
            <div className="grid gap-4">
              {searchResults.map((meal, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => fetchMealDetails(meal)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="text-gray-900">{meal}</span>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Meal Details */}
        {!loading && mealDetails && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{mealDetails.meal}</span>
                  <span className="text-orange-600">
                    Total: ${mealDetails.totalPrice.toFixed(2)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mealDetails.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-2 capitalize">
                          {ingredient.name}
                        </h3>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <DollarSign className="size-4" />
                            <span>${ingredient.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{ingredient.store}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Estimated Cost</p>
                    <p className="text-orange-600">${mealDetails.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Ingredients</p>
                    <p className="text-gray-900">{mealDetails.ingredients.length} items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Macros Card */}
            <Card>
              <CardHeader>
                <CardTitle>Nutritional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-600 mb-1">{mealDetails.macros.calories}</p>
                    <p className="text-gray-600">Calories</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-purple-600 mb-1">{mealDetails.macros.protein}g</p>
                    <p className="text-gray-600">Protein</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-amber-600 mb-1">{mealDetails.macros.carbs}g</p>
                    <p className="text-gray-600">Carbs</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-green-600 mb-1">{mealDetails.macros.fat}g</p>
                    <p className="text-gray-600">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !mealDetails && searchResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="size-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Search for a meal to get started
            </p>
            <p className="text-gray-500">
              Try popular dishes like pizza, pasta, salad, or curry
            </p>
          </div>
        )}
      </div>
    </div>
  );
}