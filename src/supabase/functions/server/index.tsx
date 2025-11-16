import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize sample data
async function initializeData() {
  try {
    // Check if data already exists
    const existingMeals = await kv.getByPrefix('meal:');
    if (existingMeals.length > 0) {
      console.log('Sample data already exists');
      return;
    }

    // Sample meals with ingredients
    const meals = [
      {
        name: 'Spaghetti Carbonara',
        ingredients: ['spaghetti', 'eggs', 'bacon', 'parmesan cheese', 'black pepper'],
        macros: { calories: 580, protein: 28, carbs: 65, fat: 22 }
      },
      {
        name: 'Caesar Salad',
        ingredients: ['romaine lettuce', 'croutons', 'parmesan cheese', 'caesar dressing', 'lemon'],
        macros: { calories: 320, protein: 12, carbs: 18, fat: 24 }
      },
      {
        name: 'Chicken Stir Fry',
        ingredients: ['chicken breast', 'bell peppers', 'soy sauce', 'garlic', 'ginger', 'rice'],
        macros: { calories: 450, protein: 35, carbs: 52, fat: 10 }
      },
      {
        name: 'Tacos',
        ingredients: ['ground beef', 'taco shells', 'lettuce', 'tomatoes', 'cheese', 'sour cream'],
        macros: { calories: 520, protein: 26, carbs: 38, fat: 28 }
      },
      {
        name: 'Margherita Pizza',
        ingredients: ['pizza dough', 'tomato sauce', 'mozzarella cheese', 'basil', 'olive oil'],
        macros: { calories: 680, protein: 24, carbs: 78, fat: 30 }
      },
      {
        name: 'Beef Burger',
        ingredients: ['ground beef', 'burger buns', 'lettuce', 'tomatoes', 'onions', 'cheese', 'pickles'],
        macros: { calories: 720, protein: 38, carbs: 48, fat: 42 }
      },
      {
        name: 'Chicken Curry',
        ingredients: ['chicken breast', 'curry powder', 'coconut milk', 'onions', 'garlic', 'rice'],
        macros: { calories: 560, protein: 40, carbs: 58, fat: 18 }
      },
      {
        name: 'Greek Salad',
        ingredients: ['cucumbers', 'tomatoes', 'feta cheese', 'olives', 'red onions', 'olive oil'],
        macros: { calories: 280, protein: 8, carbs: 14, fat: 22 }
      }
    ];

    // Sample ingredient prices and store locations
    const ingredients: Record<string, { price: number; store: string }> = {
      'spaghetti': { price: 2.99, store: 'Walmart - 123 Main St' },
      'eggs': { price: 3.49, store: 'Whole Foods - 456 Oak Ave' },
      'bacon': { price: 6.99, store: 'Walmart - 123 Main St' },
      'parmesan cheese': { price: 5.99, store: 'Whole Foods - 456 Oak Ave' },
      'black pepper': { price: 4.29, store: 'Target - 789 Elm St' },
      'romaine lettuce': { price: 2.49, store: 'Whole Foods - 456 Oak Ave' },
      'croutons': { price: 3.99, store: 'Walmart - 123 Main St' },
      'caesar dressing': { price: 4.49, store: 'Target - 789 Elm St' },
      'lemon': { price: 0.79, store: 'Whole Foods - 456 Oak Ave' },
      'chicken breast': { price: 8.99, store: 'Walmart - 123 Main St' },
      'bell peppers': { price: 3.99, store: 'Whole Foods - 456 Oak Ave' },
      'soy sauce': { price: 2.99, store: 'Target - 789 Elm St' },
      'garlic': { price: 0.99, store: 'Whole Foods - 456 Oak Ave' },
      'ginger': { price: 2.49, store: 'Whole Foods - 456 Oak Ave' },
      'rice': { price: 4.99, store: 'Walmart - 123 Main St' },
      'ground beef': { price: 9.99, store: 'Walmart - 123 Main St' },
      'taco shells': { price: 3.49, store: 'Target - 789 Elm St' },
      'lettuce': { price: 1.99, store: 'Walmart - 123 Main St' },
      'tomatoes': { price: 2.99, store: 'Whole Foods - 456 Oak Ave' },
      'cheese': { price: 5.49, store: 'Walmart - 123 Main St' },
      'sour cream': { price: 2.79, store: 'Target - 789 Elm St' },
      'pizza dough': { price: 3.99, store: 'Whole Foods - 456 Oak Ave' },
      'tomato sauce': { price: 2.49, store: 'Walmart - 123 Main St' },
      'mozzarella cheese': { price: 6.49, store: 'Whole Foods - 456 Oak Ave' },
      'basil': { price: 2.99, store: 'Whole Foods - 456 Oak Ave' },
      'olive oil': { price: 8.99, store: 'Whole Foods - 456 Oak Ave' },
      'burger buns': { price: 3.29, store: 'Walmart - 123 Main St' },
      'onions': { price: 1.49, store: 'Walmart - 123 Main St' },
      'pickles': { price: 3.99, store: 'Target - 789 Elm St' },
      'curry powder': { price: 5.99, store: 'Target - 789 Elm St' },
      'coconut milk': { price: 3.49, store: 'Whole Foods - 456 Oak Ave' },
      'cucumbers': { price: 1.99, store: 'Walmart - 123 Main St' },
      'feta cheese': { price: 6.99, store: 'Whole Foods - 456 Oak Ave' },
      'olives': { price: 4.99, store: 'Target - 789 Elm St' },
      'red onions': { price: 1.79, store: 'Walmart - 123 Main St' }
    };

    // Store meals
    for (const meal of meals) {
      await kv.set(`meal:${meal.name.toLowerCase()}`, meal);
    }

    // Store ingredients
    for (const [name, data] of Object.entries(ingredients)) {
      await kv.set(`ingredient:${name.toLowerCase()}`, data);
    }

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Initialize data on startup
initializeData();

// Sign up route
app.post('/make-server-48790404/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Error during user sign up:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error in signup route:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Search meals route
app.get('/make-server-48790404/search-meals', async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase() || '';

    if (!query) {
      return c.json({ error: 'Search query is required' }, 400);
    }

    // Get all meals
    const meals = await kv.getByPrefix('meal:');
    
    // Filter meals that match the query
    const matchingMeals = meals
      .filter((meal: any) => meal.name.toLowerCase().includes(query))
      .map((meal: any) => meal.name);

    return c.json({ meals: matchingMeals });
  } catch (error) {
    console.error('Error searching meals:', error);
    return c.json({ error: 'Internal server error while searching meals' }, 500);
  }
});

// Get meal details with ingredients, prices, and locations
app.get('/make-server-48790404/meal/:name', async (c) => {
  try {
    const mealName = c.req.param('name').toLowerCase();

    // Get meal data
    const meal = await kv.get(`meal:${mealName}`);

    if (!meal) {
      return c.json({ error: 'Meal not found' }, 404);
    }

    // Get ingredient details
    const ingredientDetails = [];
    let totalPrice = 0;

    for (const ingredientName of meal.ingredients) {
      const ingredient = await kv.get(`ingredient:${ingredientName.toLowerCase()}`);
      
      if (ingredient) {
        ingredientDetails.push({
          name: ingredientName,
          price: ingredient.price,
          store: ingredient.store
        });
        totalPrice += ingredient.price;
      } else {
        ingredientDetails.push({
          name: ingredientName,
          price: 0,
          store: 'Not available'
        });
      }
    }

    return c.json({
      meal: meal.name,
      ingredients: ingredientDetails,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      macros: meal.macros || { calories: 0, protein: 0, carbs: 0, fat: 0 }
    });
  } catch (error) {
    console.error('Error getting meal details:', error);
    return c.json({ error: 'Internal server error while getting meal details' }, 500);
  }
});

// Get all meals (for autocomplete)
app.get('/make-server-48790404/meals', async (c) => {
  try {
    const meals = await kv.getByPrefix('meal:');
    const mealNames = meals.map((meal: any) => meal.name);
    return c.json({ meals: mealNames });
  } catch (error) {
    console.error('Error getting all meals:', error);
    return c.json({ error: 'Internal server error while getting meals' }, 500);
  }
});

// Get meals within budget
app.get('/make-server-48790404/meals-by-budget', async (c) => {
  try {
    const budget = parseFloat(c.req.query('budget') || '0');

    if (budget <= 0) {
      return c.json({ error: 'Budget must be greater than 0' }, 400);
    }

    // Get all meals
    const meals = await kv.getByPrefix('meal:');
    
    // Calculate price for each meal and filter by budget
    const mealsWithPrices = [];

    for (const meal of meals) {
      let totalPrice = 0;
      
      for (const ingredientName of meal.ingredients) {
        const ingredient = await kv.get(`ingredient:${ingredientName.toLowerCase()}`);
        if (ingredient) {
          totalPrice += ingredient.price;
        }
      }

      if (totalPrice <= budget) {
        mealsWithPrices.push({
          name: meal.name,
          totalPrice: parseFloat(totalPrice.toFixed(2))
        });
      }
    }

    return c.json({ meals: mealsWithPrices });
  } catch (error) {
    console.error('Error getting meals by budget:', error);
    return c.json({ error: 'Internal server error while getting meals by budget' }, 500);
  }
});

// Create custom meal
app.post('/make-server-48790404/create-meal', async (c) => {
  try {
    const { name, ingredients, macros } = await c.req.json();

    if (!name || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return c.json({ error: 'Name and ingredients are required' }, 400);
    }

    if (!macros || !macros.calories || !macros.protein || !macros.carbs || !macros.fat) {
      return c.json({ error: 'Complete macros (calories, protein, carbs, fat) are required' }, 400);
    }

    // Check if meal already exists
    const existingMeal = await kv.get(`meal:${name.toLowerCase()}`);
    if (existingMeal) {
      return c.json({ error: 'A meal with this name already exists' }, 400);
    }

    // Store custom ingredients that don't exist yet
    for (const ingredient of ingredients) {
      const existingIngredient = await kv.get(`ingredient:${ingredient.name.toLowerCase()}`);
      if (!existingIngredient) {
        await kv.set(`ingredient:${ingredient.name.toLowerCase()}`, {
          price: ingredient.price,
          store: ingredient.store
        });
      }
    }

    // Store the meal
    const mealData = {
      name,
      ingredients: ingredients.map((ing: any) => ing.name),
      macros,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    await kv.set(`meal:${name.toLowerCase()}`, mealData);

    return c.json({ success: true, meal: mealData });
  } catch (error) {
    console.error('Error creating custom meal:', error);
    return c.json({ error: 'Internal server error while creating meal' }, 500);
  }
});

Deno.serve(app.fetch);