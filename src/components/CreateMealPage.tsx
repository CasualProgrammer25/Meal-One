import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ArrowLeft, Plus, X, ChefHat, Check } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface CreateMealPageProps {
  onBack: () => void;
}

interface IngredientInput {
  name: string;
  price: string;
  store: string;
}

export function CreateMealPage({ onBack }: CreateMealPageProps) {
  const [mealName, setMealName] = useState("");
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: "", price: "", store: "" }
  ]);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", price: "", store: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof IngredientInput, value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!mealName.trim()) {
      toast.error("Please enter a meal name");
      return;
    }

    const validIngredients = ingredients.filter(
      ing => ing.name.trim() && ing.price.trim() && ing.store.trim()
    );

    if (validIngredients.length === 0) {
      toast.error("Please add at least one complete ingredient");
      return;
    }

    if (!calories || !protein || !carbs || !fat) {
      toast.error("Please fill in all macro information");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48790404/create-meal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: mealName,
            ingredients: validIngredients.map(ing => ({
              name: ing.name,
              price: parseFloat(ing.price),
              store: ing.store
            })),
            macros: {
              calories: parseInt(calories),
              protein: parseInt(protein),
              carbs: parseInt(carbs),
              fat: parseInt(fat)
            }
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create meal");
      }

      toast.success(`${mealName} has been created successfully!`);
      
      // Reset form
      setMealName("");
      setIngredients([{ name: "", price: "", store: "" }]);
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
    } catch (err) {
      console.error("Error creating meal:", err);
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = ingredients.reduce((sum, ing) => {
    const price = parseFloat(ing.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
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
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <Plus className="size-10 text-orange-600" />
          </div>
          <h1 className="text-gray-900 mb-2">Create & Share Your Meal</h1>
          <p className="text-gray-600 text-xl">Add your favorite recipes to share with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meal Name */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Meal Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="mealName">Meal Name</Label>
              <Input
                id="mealName"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g., Homemade Lasagna"
                required
                className="h-12"
              />
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Ingredients
                <Button
                  type="button"
                  onClick={addIngredient}
                  size="sm"
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="size-4" />
                  Add Ingredient
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-900">Ingredient {index + 1}</span>
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <Label htmlFor={`ingredient-name-${index}`}>Name</Label>
                      <Input
                        id={`ingredient-name-${index}`}
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, "name", e.target.value)}
                        placeholder="e.g., Ground Beef"
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`ingredient-price-${index}`}>Price ($)</Label>
                        <Input
                          id={`ingredient-price-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={ingredient.price}
                          onChange={(e) => updateIngredient(index, "price", e.target.value)}
                          placeholder="0.00"
                          required
                          className="h-11"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`ingredient-store-${index}`}>Store</Label>
                        <Input
                          id={`ingredient-store-${index}`}
                          value={ingredient.store}
                          onChange={(e) => updateIngredient(index, "store", e.target.value)}
                          placeholder="e.g., Walmart"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {totalPrice > 0 && (
                <div className="p-5 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">Estimated Total Price</p>
                    <p className="text-orange-600 text-xl">${totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Macros */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Nutritional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="0"
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="0"
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    min="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="0"
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    min="0"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="0"
                    required
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 gap-2"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Meal...
              </>
            ) : (
              <>
                <Check className="size-5" />
                Create & Share Meal
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}