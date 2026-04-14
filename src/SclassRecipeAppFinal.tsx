
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Save,
  Download,
  Trash2,
  Calculator,
  ChefHat,
  Sparkles,
  Layers3,
  IceCreamBowl,
  Users,
  BookOpen,
  Wand2,
} from "lucide-react";

type Goal = "Lean" | "Bulk" | "Anabolic" | "Low Cal" | "No Sugar";
type ProteinMode = "Whey" | "No Whey";
type ComboIntensity = "Light Blend" | "Even Split" | "Primary Dominant";
type Ingredient = [string, number];
type Macro = { cal: number; p: number; c: number; f: number };

type Recipe = {
  category: string;
  name: string;
  clientName: string;
  servings: number;
  base: Ingredient[];
  method: string[];
  flavors: Record<string, Ingredient[]>;
  flavorHow: Record<string, string[]>;
  swirls: Record<string, Ingredient[]>;
  swirlBuild: Record<string, string[]>;
  toppings: Record<string, Ingredient[]>;
  toppingHow: Record<string, string[]>;
  creami: string[];
};

type SavedBuild = {
  id: string;
  customName: string;
  recipeName: string;
  goal: Goal;
  flavor: string;
  swirl: string;
  topping: string;
};


const BRAND = {
  name: "Sclass Fitness",
  appName: "Sclass Recipe Vault",
  tag: "Luxury performance recipes",
  logos: {
    main: "/logo-main.png",
    mark: "/logo-mark.png",
    online: "/logo-online.png",
  },
};

const db: Record<string, { unit: string; cal: number; p: number; c: number; f: number }> = {
  "whey isolate": { unit: "g", cal: 3.8, p: 0.84, c: 0.06, f: 0.03 },
  "oat flour": { unit: "g", cal: 4.04, p: 0.14, c: 0.68, f: 0.09 },
  "cocoa powder": { unit: "g", cal: 2.28, p: 0.2, c: 0.58, f: 0.14 },
  "egg whites": { unit: "g", cal: 0.52, p: 0.11, c: 0.007, f: 0.002 },
  "whole egg": { unit: "unit", cal: 70, p: 6, c: 0.4, f: 5 },
  "greek yogurt nonfat": { unit: "g", cal: 0.59, p: 0.1, c: 0.036, f: 0.004 },
  "light cream cheese": { unit: "g", cal: 2.1, p: 0.07, c: 0.05, f: 0.15 },
  "almond milk unsweetened": { unit: "ml", cal: 0.13, p: 0.005, c: 0.003, f: 0.011 },
  "baking powder": { unit: "g", cal: 0.53, p: 0, c: 0.28, f: 0 },
  "zero-cal sweetener": { unit: "g", cal: 0, p: 0, c: 0, f: 0 },
  "sugar-free syrup": { unit: "g", cal: 0.2, p: 0, c: 0.05, f: 0 },
  blueberries: { unit: "g", cal: 0.57, p: 0.007, c: 0.145, f: 0.003 },
  strawberries: { unit: "g", cal: 0.32, p: 0.007, c: 0.077, f: 0.003 },
  almond: { unit: "g", cal: 5.79, p: 0.21, c: 0.22, f: 0.5 },
  apple: { unit: "g", cal: 0.52, p: 0.003, c: 0.14, f: 0.002 },
  banana: { unit: "g", cal: 0.89, p: 0.011, c: 0.228, f: 0.003 },
  carrot: { unit: "g", cal: 0.41, p: 0.009, c: 0.096, f: 0.002 },
  cherry: { unit: "g", cal: 0.5, p: 0.01, c: 0.12, f: 0.003 },
  coconut: { unit: "g", cal: 3.54, p: 0.033, c: 0.15, f: 0.33 },
  lemon: { unit: "g", cal: 0.29, p: 0.011, c: 0.093, f: 0.003 },
  pumpkin: { unit: "g", cal: 0.26, p: 0.01, c: 0.065, f: 0.001 },
  peach: { unit: "g", cal: 0.39, p: 0.009, c: 0.096, f: 0.003 },
  pecan: { unit: "g", cal: 6.91, p: 0.09, c: 0.14, f: 0.72 },
  caramel: { unit: "g", cal: 3.8, p: 0, c: 0.8, f: 0 },
  mint: { unit: "g", cal: 0.44, p: 0.03, c: 0.08, f: 0.01 },
  salt: { unit: "g", cal: 0, p: 0, c: 0, f: 0 },

  pb2: { unit: "g", cal: 4, p: 0.5, c: 0.33, f: 0.125 },
  "biscoff spread": { unit: "g", cal: 5.84, p: 0.03, c: 0.58, f: 0.37 },
  "dark chocolate chips": { unit: "g", cal: 5, p: 0.06, c: 0.63, f: 0.27 },
  "sugar-free chocolate chips": { unit: "g", cal: 4.3, p: 0.05, c: 0.5, f: 0.28 },
  "graham crumbs": { unit: "g", cal: 4.6, p: 0.07, c: 0.78, f: 0.13 },
  cinnamon: { unit: "g", cal: 2.47, p: 0.04, c: 0.81, f: 0.01 },
  "vanilla extract": { unit: "g", cal: 2.88, p: 0, c: 0.13, f: 0 },
  "pudding mix sugar-free cheesecake": { unit: "g", cal: 3.3, p: 0, c: 0.8, f: 0 },
  "instant pudding sugar-free vanilla": { unit: "g", cal: 3.4, p: 0, c: 0.82, f: 0 },
  "xanthan gum": { unit: "g", cal: 3.3, p: 0, c: 0.77, f: 0 },
  "rice krispies cereal": { unit: "g", cal: 3.88, p: 0.07, c: 0.88, f: 0.01 },
  "chocolate crispy rice cereal": { unit: "g", cal: 4.04, p: 0.06, c: 0.85, f: 0.09 },
  "mini marshmallows": { unit: "g", cal: 3.18, p: 0.02, c: 0.79, f: 0 },
  "light butter": { unit: "g", cal: 3.6, p: 0, c: 0, f: 0.4 },
};

const goalMultipliers: Record<Goal, number> = {
  Lean: 1,
  Bulk: 1.35,
  Anabolic: 1.12,
  "Low Cal": 0.85,
  "No Sugar": 0.82,
};

const flavorPacks: Record<string, Record<string, Ingredient[]>> = {
  "Gym Pack": {
    Vanilla: [["instant pudding sugar-free vanilla", 8]],
    Chocolate: [["cocoa powder", 10]],
    PB: [["pb2", 16]],
  },
  "Dessert Pack": {
    "Cake Batter": [["instant pudding sugar-free vanilla", 10]],
    "Cinnamon Roll": [["cinnamon", 4], ["instant pudding sugar-free vanilla", 6]],
    "Chocolate Fudge": [["cocoa powder", 14]],
  },
  "Cereal Pack": {
    "Cinnamon Toast": [["cinnamon", 4], ["zero-cal sweetener", 4]],
    "Cookie Crunch": [["graham crumbs", 16]],
  },
  "Luxury Pack": {
    "Biscoff Deluxe": [["biscoff spread", 18]],
    "Cheesecake Supreme": [["pudding mix sugar-free cheesecake", 10]],
    "Choco PB Dream": [["cocoa powder", 8], ["pb2", 12]],
  },
};

const commonFlavors: Record<string, Ingredient[]> = {
  "None": [],
  "Almond": [["almond", 20]],
  "Apple": [["apple", 90]],
  "Apple Cinnamon": [["apple", 80], ["cinnamon", 4]],
  "Banana": [["banana", 80]],
  "Banana Nut": [["banana", 70], ["pb2", 10]],
  "Biscoff": [["biscoff spread", 18]],
  "Birthday Cake": [["instant pudding sugar-free vanilla", 10]],
  "Blueberry": [["blueberries", 75]],
  "Blueberry Cheesecake": [["blueberries", 60], ["pudding mix sugar-free cheesecake", 5]],
  "Brownie Batter": [["cocoa powder", 12], ["zero-cal sweetener", 4]],
  "Cake Batter": [["instant pudding sugar-free vanilla", 10]],
  "Caramel": [["caramel", 15]],
  "Carrot Cake": [["carrot", 70], ["cinnamon", 4]],
  "Cherry": [["cherry", 80]],
  "Chocolate": [["cocoa powder", 10]],
  "Chocolate Banana": [["cocoa powder", 8], ["banana", 60]],
  "Chocolate Chip": [["sugar-free chocolate chips", 18]],
  "Chocolate PB": [["cocoa powder", 8], ["pb2", 12]],
  "Chocolate Strawberry": [["cocoa powder", 8], ["strawberries", 60]],
  "Cinnamon Roll": [["cinnamon", 4], ["instant pudding sugar-free vanilla", 8]],
  "Cinnamon Toast": [["cinnamon", 4], ["zero-cal sweetener", 4]],
  "Coconut": [["coconut", 15]],
  "Cookies & Cream": [["instant pudding sugar-free vanilla", 8]],
  "Dark Chocolate": [["cocoa powder", 14]],
  "Double Chocolate": [["dark chocolate chips", 18]],
  "Lemon": [["lemon", 20]],
  "Mint": [["mint", 5]],
  "Mint Chocolate": [["mint", 5], ["cocoa powder", 8]],
  "Peach": [["peach", 90]],
  "Peanut Butter": [["pb2", 16]],
  "Pecan": [["pecan", 15]],
  "Pumpkin": [["pumpkin", 90], ["cinnamon", 3]],
  "Red Velvet": [["cocoa powder", 6], ["zero-cal sweetener", 4]],
  "Salted Caramel": [["caramel", 15], ["salt", 1]],
  "Smores": [["graham crumbs", 14], ["sugar-free chocolate chips", 14]],
  "Strawberry": [["strawberries", 80]],
  "Strawberry Banana": [["strawberries", 60], ["banana", 60]],
  "Strawberry Cheesecake": [["strawberries", 80], ["pudding mix sugar-free cheesecake", 6]],
  "Vanilla": [["instant pudding sugar-free vanilla", 8]]
};

const commonSwirls: Record<string, Ingredient[]> = {
  "None": [],
  "Center • PB": [["pb2", 12], ["almond milk unsweetened", 8]],
  "Core • Biscoff": [["biscoff spread", 18]],
  "Core • Cheesecake": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 6]],
  "Core • Chocolate": [["sugar-free chocolate chips", 16]],
  "Core • PB": [["pb2", 14], ["almond milk unsweetened", 10]],
  "Ribbon • Biscoff": [["biscoff spread", 16]],
  "Ribbon • Chocolate": [["cocoa powder", 8], ["sugar-free syrup", 15]],
  "Ribbon • Chocolate Fudge": [["sugar-free syrup", 20], ["cocoa powder", 5]],
  "Ripple • Cheesecake": [["greek yogurt nonfat", 50], ["pudding mix sugar-free cheesecake", 6]],
  "Swirl • Biscoff": [["biscoff spread", 14]],
  "Swirl • Blueberry": [["blueberries", 50]],
  "Swirl • Cheesecake": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]],
  "Swirl • Chocolate": [["sugar-free syrup", 20], ["cocoa powder", 6]],
  "Swirl • Fruit Jam": [["strawberries", 60]],
  "Swirl • PB": [["pb2", 14], ["almond milk unsweetened", 10]]
};

const commonToppings: Record<string, Ingredient[]> = {
  None: [],
  "Chocolate Drip": [["sugar-free syrup", 16], ["cocoa powder", 4]],
  "Chocolate Drizzle": [["sugar-free syrup", 18], ["cocoa powder", 4]],
  "Chocolate Chips": [["sugar-free chocolate chips", 15]],
  "PB Drip": [["pb2", 10], ["almond milk unsweetened", 10]],
  "PB Drizzle": [["pb2", 10], ["almond milk unsweetened", 10]],
  "Biscoff Drip": [["biscoff spread", 12]],
  "Biscoff Drizzle": [["biscoff spread", 12]],
  "Cookie Crunch": [["graham crumbs", 14]],
  "Cookie Crumble": [["graham crumbs", 14]],
  "Protein Frost": [["greek yogurt nonfat", 30], ["instant pudding sugar-free vanilla", 5]],
  "Vanilla Glaze": [["greek yogurt nonfat", 25], ["instant pudding sugar-free vanilla", 4]],
  "Yogurt Glaze": [["greek yogurt nonfat", 30], ["zero-cal sweetener", 3]],
  "Yogurt Top": [["greek yogurt nonfat", 35]],
  "Fresh Fruit": [["strawberries", 60]],
  "Fresh Fruit Top": [["strawberries", 70]],
  Syrup: [["sugar-free syrup", 20]],
};

const recipes: Recipe[] = [
  {
    category: "Muffins",
    name: "Base Protein Muffins",
    clientName: "Protein Muffins",
    servings: 6,
    base: [["whey isolate", 30], ["oat flour", 35], ["egg whites", 150], ["almond milk unsweetened", 60], ["baking powder", 6], ["zero-cal sweetener", 8], ["vanilla extract", 3]],
    method: [
      "Preheat oven to 350°F. Line or lightly spray a 6-slot muffin tray.",
      "Whisk dry ingredients until even.",
      "Whisk wet ingredients separately until smooth.",
      "Combine wet and dry and rest 2 minutes.",
      "Add selected flavor ingredients.",
      "Fill halfway, add swirl/core if using, then cover with remaining batter.",
      "Bake 14–18 minutes.",
      "Cool 10 minutes before removing."
    ],
    flavors: {
      Blueberry: [["blueberries", 75]],
      Chocolate: [["cocoa powder", 12]],
      "Cinnamon Roll": [["cinnamon", 4], ["instant pudding sugar-free vanilla", 8]],
      "Peanut Butter": [["pb2", 16]],
      Biscoff: [["biscoff spread", 18]]
    },
    flavorHow: {
      Blueberry: ["Fold blueberries in at the end."],
      Chocolate: ["Whisk cocoa into the dry mix before adding wet ingredients."],
      "Cinnamon Roll": ["Whisk cinnamon and pudding mix into the dry ingredients."],
      "Peanut Butter": ["Whisk PB2 into the dry mix."],
      Biscoff: ["Warm slightly and fold gently into the batter or reserve for a ribbon."]
    },
    swirls: {
      None: [],
      "Cheesecake Swirl": [["greek yogurt nonfat", 50], ["pudding mix sugar-free cheesecake", 6]],
      "Chocolate Swirl": [["sugar-free syrup", 20], ["cocoa powder", 6]],
      "Biscoff Core": [["biscoff spread", 24]],
      "PB Core": [["pb2", 14], ["almond milk unsweetened", 10]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Swirl": ["Mix yogurt and cheesecake pudding until thick.", "Spoon into each half-filled muffin and lightly twist."],
      "Chocolate Swirl": ["Mix syrup and cocoa until glossy, then drag lightly through the batter."],
      "Biscoff Core": ["Freeze small Biscoff portions for 15–20 minutes.", "Place in the center and cover completely."],
      "PB Core": ["Mix PB2 with almond milk into a thick paste.", "Freeze small portions and bury in the center."]
    },
    toppings: {
      None: [],
      "Yogurt Glaze": [["greek yogurt nonfat", 30], ["zero-cal sweetener", 3]],
      "Cinnamon Drizzle": [["sugar-free syrup", 18], ["cinnamon", 2]],
      "Chocolate Drizzle": [["sugar-free syrup", 18], ["cocoa powder", 4]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Yogurt Glaze": ["Mix until smooth and drizzle over cooled muffins."],
      "Cinnamon Drizzle": ["Mix until smooth and drizzle after cooling."],
      "Chocolate Drizzle": ["Whisk until glossy and drizzle after cooling."]
    },
    creami: [
      "Add 120ml extra almond milk and 1g xanthan gum.",
      "Freeze 20–24 hours in a pint.",
      "Spin on Lite Ice Cream and respin if needed."
    ]
  },
  {
    category: "Brownies",
    name: "Base Protein Brownies",
    clientName: "Protein Brownies",
    servings: 9,
    base: [["whey isolate", 35], ["oat flour", 30], ["cocoa powder", 18], ["egg whites", 160], ["almond milk unsweetened", 70], ["baking powder", 5], ["zero-cal sweetener", 10]],
    method: [
      "Preheat oven to 350°F and line a small square pan.",
      "Whisk dry ingredients and wet ingredients separately.",
      "Combine until glossy and pourable.",
      "Add selected flavor ingredients.",
      "Spread half the batter, build the selected swirl/core, then cover with the rest.",
      "Bake 12–16 minutes.",
      "Cool fully before slicing."
    ],
    flavors: {
      "Cookies & Cream": [["instant pudding sugar-free vanilla", 8]],
      Biscoff: [["biscoff spread", 20]],
      "Double Chocolate": [["dark chocolate chips", 18]],
      "Peanut Butter": [["pb2", 18]],
      "Blueberry Cheesecake": [["blueberries", 60], ["pudding mix sugar-free cheesecake", 5]]
    },
    flavorHow: {
      "Cookies & Cream": ["Whisk pudding mix into the dry ingredients."],
      Biscoff: ["Warm slightly and fold it in gently."],
      "Double Chocolate": ["Fold chocolate chips in at the end."],
      "Peanut Butter": ["Whisk PB2 into the dry mix."],
      "Blueberry Cheesecake": ["Whisk cheesecake pudding into the dry mix and fold blueberries in last."]
    },
    swirls: {
      None: [],
      "Cheesecake Ripple": [["greek yogurt nonfat", 60], ["pudding mix sugar-free cheesecake", 8]],
      "PB Swirl": [["pb2", 18], ["almond milk unsweetened", 15]],
      "Biscoff Core Pockets": [["biscoff spread", 30]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Ripple": ["Mix yogurt and pudding until thick.", "Dot over the half-filled pan and drag a knife through."],
      "PB Swirl": ["Mix PB2 and almond milk into a smooth paste.", "Dot over the batter and drag lightly."],
      "Biscoff Core Pockets": ["Freeze small Biscoff portions until firm and press into the half-filled batter, then cover fully."]
    },
    toppings: {
      None: [],
      "Dusting Cocoa": [["cocoa powder", 3]],
      "Yogurt Frost": [["greek yogurt nonfat", 35], ["zero-cal sweetener", 3]],
      "Chocolate Top": [["sugar-free chocolate chips", 16]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Dusting Cocoa": ["Dust after brownies cool."],
      "Yogurt Frost": ["Mix and spread over cooled brownies."],
      "Chocolate Top": ["Add after baking for melt or after cooling for texture."]
    },
    creami: [
      "Add 140ml extra almond milk and 1g xanthan gum.",
      "Freeze flat, then spin.",
      "Use PB or Biscoff after first spin for brownie batter style."
    ]
  },
  {
    category: "Cookies",
    name: "Base Protein Cookies",
    clientName: "Protein Cookies",
    servings: 8,
    base: [["whey isolate", 30], ["oat flour", 40], ["greek yogurt nonfat", 80], ["almond milk unsweetened", 20], ["baking powder", 4], ["zero-cal sweetener", 8], ["vanilla extract", 3]],
    method: [
      "Preheat oven to 350°F and line a tray.",
      "Mix dry ingredients thoroughly.",
      "Add yogurt, almond milk, and vanilla until a thick dough forms.",
      "Rest 3 minutes.",
      "Add selected flavor ingredients.",
      "For stuffed cookies, flatten dough, build the selected core, seal, and flatten lightly.",
      "Bake 9–12 minutes.",
      "Cool on the tray first so the cookies set."
    ],
    flavors: {
      "Cake Batter": [["instant pudding sugar-free vanilla", 10]],
      "Chocolate Chip": [["sugar-free chocolate chips", 24]],
      "Blueberry Muffin": [["blueberries", 55], ["cinnamon", 2]],
      "PB Cookie": [["pb2", 18]],
      "Biscoff Cookie": [["biscoff spread", 18]]
    },
    flavorHow: {
      "Cake Batter": ["Whisk pudding mix into the dry ingredients first."],
      "Chocolate Chip": ["Fold chips in last."],
      "Blueberry Muffin": ["Fold blueberries in gently at the end."],
      "PB Cookie": ["Whisk PB2 into the dry mix."],
      "Biscoff Cookie": ["Warm Biscoff slightly and fold it in gently, or reserve it for a filled center."]
    },
    swirls: {
      None: [],
      "Cheesecake Center": [["greek yogurt nonfat", 45], ["pudding mix sugar-free cheesecake", 6]],
      "Chocolate Core": [["sugar-free chocolate chips", 20]],
      "PB Swirl": [["pb2", 14], ["almond milk unsweetened", 10]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Center": ["Mix yogurt and cheesecake pudding until thick.", "Freeze small center portions, place inside flattened dough, then seal completely."],
      "Chocolate Core": ["Place chips in the middle of flattened dough and seal well."],
      "PB Swirl": ["Mix PB2 and almond milk into a drizzle.", "Swirl on top before baking or drizzle after baking."]
    },
    toppings: {
      None: [],
      "Vanilla Glaze": [["greek yogurt nonfat", 25], ["instant pudding sugar-free vanilla", 4]],
      "PB Drizzle": [["pb2", 10], ["almond milk unsweetened", 10]],
      "Cinnamon Top": [["cinnamon", 2], ["zero-cal sweetener", 2]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Vanilla Glaze": ["Mix until smooth and spoon over cooled cookies."],
      "PB Drizzle": ["Mix until glossy and drizzle after cooling."],
      "Cinnamon Top": ["Sprinkle over warm cookies."]
    },
    creami: [
      "Add 120ml extra almond milk for a cookie dough style pint.",
      "Freeze flat, spin, then add chips or cheesecake center pieces after respin."
    ]
  },
  {
    category: "Cheesecakes",
    name: "Base Protein Cheesecake",
    clientName: "Protein Cheesecake",
    servings: 6,
    base: [["greek yogurt nonfat", 220], ["light cream cheese", 100], ["whey isolate", 25], ["whole egg", 1], ["instant pudding sugar-free vanilla", 10], ["zero-cal sweetener", 10], ["vanilla extract", 3]],
    method: [
      "Preheat oven to 325°F and prep your pan or ramekins.",
      "Beat cream cheese smooth first.",
      "Mix in yogurt, whey, pudding mix, sweetener, and vanilla.",
      "Add the egg last and mix only until combined.",
      "Pour into the pan.",
      "Add selected flavor ingredients, then build the selected swirl/core.",
      "Bake 24–32 minutes until the center is just slightly jiggly.",
      "Cool fully, then chill at least 4 hours."
    ],
    flavors: {
      "Blueberry Cheesecake": [["blueberries", 80]],
      "Biscoff Cheesecake": [["biscoff spread", 24]],
      "Chocolate Cheesecake": [["cocoa powder", 12]],
      "Cinnamon Cheesecake": [["cinnamon", 4]],
      "PB Cheesecake": [["pb2", 20]]
    },
    flavorHow: {
      "Blueberry Cheesecake": ["Fold blueberries in last."],
      "Biscoff Cheesecake": ["Warm slightly and swirl in or blend directly into the batter."],
      "Chocolate Cheesecake": ["Whisk cocoa into the base before the egg."],
      "Cinnamon Cheesecake": ["Whisk cinnamon into the base for even spice."],
      "PB Cheesecake": ["Whisk PB2 in before the egg."]
    },
    swirls: {
      None: [],
      "Blueberry Swirl": [["blueberries", 50]],
      "Biscoff Swirl": [["biscoff spread", 18]],
      "Chocolate Ribbon": [["cocoa powder", 8], ["sugar-free syrup", 15]],
      "Cheesecake Core Cups": [["light cream cheese", 36], ["zero-cal sweetener", 3]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Blueberry Swirl": ["Lightly mash part of the blueberries, spoon over the batter, and drag a skewer through."],
      "Biscoff Swirl": ["Warm slightly, spoon over the top, and drag lightly through the batter."],
      "Chocolate Ribbon": ["Mix cocoa and syrup into a smooth ribbon, then streak through the top."],
      "Cheesecake Core Cups": ["Mix cream cheese and sweetener, freeze small center portions, place in ramekins halfway through filling, then cover."]
    },
    toppings: {
      None: [],
      "Yogurt Top": [["greek yogurt nonfat", 40]],
      "Crumb Top": [["graham crumbs", 16]],
      "Chocolate Chips": [["sugar-free chocolate chips", 16]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Yogurt Top": ["Spread over chilled cheesecake."],
      "Crumb Top": ["Sprinkle just before serving."],
      "Chocolate Chips": ["Top after chilling for texture or near the end of baking for slight melt."]
    },
    creami: [
      "Blend the base with 100ml almond milk until smooth.",
      "Freeze, spin once, scrape sides, then respin.",
      "Use the chosen flavor as a mix-in or add the selected swirl after the final spin."
    ]
  },
  {
    category: "Ice Cream / Creami",
    name: "Base Protein Creami Pint",
    clientName: "Protein Creami Pint",
    servings: 1,
    base: [["whey isolate", 30], ["greek yogurt nonfat", 120], ["almond milk unsweetened", 220], ["instant pudding sugar-free vanilla", 8], ["zero-cal sweetener", 6], ["xanthan gum", 1]],
    method: [
      "Blend all ingredients until completely smooth.",
      "Pour into a Creami pint and freeze flat for 20–24 hours.",
      "Spin on Lite Ice Cream.",
      "If crumbly, add 15–30ml almond milk and respin.",
      "Blend in or fold in selected flavor ingredients.",
      "Build the selected ribbon or topping after the final spin."
    ],
    flavors: {
      Blueberry: [["blueberries", 90]],
      Chocolate: [["cocoa powder", 12]],
      "Cake Batter": [["instant pudding sugar-free vanilla", 8]],
      PB: [["pb2", 18]],
      Biscoff: [["biscoff spread", 18]]
    },
    flavorHow: {
      Blueberry: ["Blend directly into the base before freezing."],
      Chocolate: ["Blend cocoa fully before freezing."],
      "Cake Batter": ["Whisk in extra vanilla pudding mix before freezing."],
      PB: ["Blend PB2 into the base before freezing."],
      Biscoff: ["Blend into the base or save for a ribbon after the final spin."]
    },
    swirls: {
      None: [],
      "Cheesecake Swirl": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]],
      "Biscoff Ribbon": [["biscoff spread", 16]],
      "Chocolate Fudge Ribbon": [["sugar-free syrup", 20], ["cocoa powder", 5]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Swirl": ["Mix yogurt and pudding until thick.", "After the final spin, dig a trench, spoon in the mixture, and run Mix-In once or fold by hand."],
      "Biscoff Ribbon": ["Warm slightly, spoon into a center trench after the final spin, and run Mix-In once."],
      "Chocolate Fudge Ribbon": ["Mix syrup and cocoa until smooth, then spoon into the center trench and lightly fold."]
    },
    toppings: {
      None: [],
      "Cookie Crumble": [["graham crumbs", 14]],
      "Chocolate Chips": [["sugar-free chocolate chips", 15]],
      "Fresh Fruit Top": [["strawberries", 70]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Cookie Crumble": ["Sprinkle over the finished pint just before eating."],
      "Chocolate Chips": ["Add after the final spin or use Mix-In once."],
      "Fresh Fruit Top": ["Top the finished pint right before serving."]
    },
    creami: [
      "This recipe is already in Creami format.",
      "For firmer texture, respin once without extra liquid first.",
      "For softer texture, add almond milk in small splashes and respin until creamy."
    ]
  },
  {
    category: "Pudding Cups",
    name: "Base Protein Pudding Cup",
    clientName: "Protein Pudding Cup",
    servings: 2,
    base: [["greek yogurt nonfat", 200], ["whey isolate", 25], ["instant pudding sugar-free vanilla", 12], ["almond milk unsweetened", 40], ["zero-cal sweetener", 4]],
    method: [
      "Whisk or blend all base ingredients until completely smooth.",
      "Rest 3–5 minutes so the pudding mix thickens.",
      "Add selected flavor ingredients.",
      "Layer into cups or jars.",
      "If using a swirl or center, add halfway through the filling process.",
      "Top as desired and chill 20–30 minutes for best texture."
    ],
    flavors: {
      Cheesecake: [["pudding mix sugar-free cheesecake", 8]],
      Chocolate: [["cocoa powder", 10]],
      Biscoff: [["biscoff spread", 16]],
      Strawberry: [["strawberries", 80]],
      PeanutButter: [["pb2", 16]]
    },
    flavorHow: {
      Cheesecake: ["Whisk cheesecake pudding mix directly into the base for a tangier, thicker finish."],
      Chocolate: ["Whisk cocoa into the base until fully dissolved."],
      Biscoff: ["Warm slightly and blend in or leave partly mixed for ribbons."],
      Strawberry: ["Fold chopped strawberries in after the base is mixed."],
      PeanutButter: ["Whisk PB2 into the pudding base until smooth." ]
    },
    swirls: {
      None: [],
      "Chocolate Ribbon": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "Biscoff Swirl": [["biscoff spread", 14]],
      "Cheesecake Center": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]],
      "PB Core": [["pb2", 12], ["almond milk unsweetened", 8]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Chocolate Ribbon": ["Whisk syrup and cocoa until glossy, then spoon it between pudding layers."],
      "Biscoff Swirl": ["Warm slightly and drizzle between layers, then lightly drag a spoon through."],
      "Cheesecake Center": ["Mix yogurt and cheesecake pudding until thick and use as the middle layer."],
      "PB Core": ["Mix PB2 and almond milk into a thick paste and place in the center of each cup before covering with the final layer."]
    },
    toppings: {
      None: [],
      "Cookie Crumbs": [["graham crumbs", 12]],
      "Chocolate Chips": [["sugar-free chocolate chips", 12]],
      "Fresh Fruit": [["strawberries", 60]],
      "Yogurt Top": [["greek yogurt nonfat", 30]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Cookie Crumbs": ["Sprinkle over the top right before serving for texture."],
      "Chocolate Chips": ["Scatter over the top after chilling."],
      "Fresh Fruit": ["Top with fresh fruit before serving."],
      "Yogurt Top": ["Spread a light top layer over the finished cups."]
    },
    creami: [
      "Add 80–100ml extra almond milk and 1g xanthan gum.",
      "Blend smooth, freeze flat, then spin for a pudding-style frozen pint.",
      "Use the selected swirl after the final spin for a layered spoonable texture."
    ]
  },
  {
    category: "Donuts",
    name: "Base Protein Donuts",
    clientName: "Base Protein Donuts",
    servings: 6,
    base: [["whey isolate", 30], ["oat flour", 35], ["egg whites", 140], ["almond milk unsweetened", 60], ["baking powder", 5], ["zero-cal sweetener", 8], ["vanilla extract", 2]],
    method: [
      "Preheat oven to 350°F and lightly grease a donut mold.",
      "Whisk dry ingredients together.",
      "Whisk wet ingredients separately until smooth.",
      "Combine and rest 2 minutes.",
      "Add selected flavor ingredients.",
      "Pipe or spoon into the mold about three-quarters full.",
      "If using a core, place it centrally and cover lightly.",
      "Bake 10–14 minutes and cool before removing."
    ],
    flavors: {
      Vanilla: [["instant pudding sugar-free vanilla", 8]],
      Chocolate: [["cocoa powder", 10]],
      Cinnamon: [["cinnamon", 3]],
      Biscoff: [["biscoff spread", 16]],
      Blueberry: [["blueberries", 55]]
    },
    flavorHow: {
      Vanilla: ["Whisk pudding mix into the dry ingredients."],
      Chocolate: ["Whisk cocoa into the dry base before adding wet."],
      Cinnamon: ["Whisk cinnamon into the base for an even spice profile."],
      Biscoff: ["Warm slightly and fold in gently or reserve for glaze/swirl."],
      Blueberry: ["Fold blueberries in gently at the end."]
    },
    swirls: {
      None: [],
      "Cheesecake Core": [["greek yogurt nonfat", 35], ["pudding mix sugar-free cheesecake", 5]],
      "Chocolate Ribbon": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "Biscoff Core": [["biscoff spread", 18]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Core": ["Mix yogurt and cheesecake pudding until thick.", "Pipe a small amount into the center of each donut and cover lightly with batter."],
      "Chocolate Ribbon": ["Mix syrup and cocoa until glossy and lightly swirl into the batter after piping."],
      "Biscoff Core": ["Freeze small Biscoff portions and place them in the center before baking."]
    },
    toppings: {
      None: [],
      Glaze: [["greek yogurt nonfat", 30], ["zero-cal sweetener", 3]],
      "Chocolate Glaze": [["greek yogurt nonfat", 25], ["cocoa powder", 4]],
      "Cinnamon Sugar Top": [["cinnamon", 2], ["zero-cal sweetener", 2]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Glaze: ["Mix until smooth and dip cooled donuts."],
      "Chocolate Glaze": ["Whisk until smooth and spoon over cooled donuts."],
      "Cinnamon Sugar Top": ["Sprinkle over warm donuts for best adhesion."]
    },
    creami: [
      "Blend the donut base with 120ml extra almond milk.",
      "Freeze and spin for a cake-donut ice cream base."
    ]
  },
  {
    category: "Pancakes",
    name: "Base Protein Pancakes",
    clientName: "Protein Pancakes",
    servings: 4,
    base: [["whey isolate", 30], ["oat flour", 40], ["egg whites", 120], ["almond milk unsweetened", 70], ["baking powder", 5], ["zero-cal sweetener", 6]],
    method: [
      "Whisk all ingredients until smooth.",
      "Let batter rest 2 minutes.",
      "Fold in selected flavor ingredients if needed.",
      "Heat a nonstick pan over medium heat.",
      "Pour batter and cook until bubbles form.",
      "Flip and cook the second side until set.",
      "Stack and add swirl/topping after cooking."
    ],
    flavors: {
      Blueberry: [["blueberries", 60]],
      Chocolate: [["cocoa powder", 10]],
      Cinnamon: [["cinnamon", 3]],
      Biscoff: [["biscoff spread", 14]],
      PB: [["pb2", 14]]
    },
    flavorHow: {
      Blueberry: ["Fold blueberries in at the end so they stay whole."],
      Chocolate: ["Whisk cocoa directly into the batter."],
      Cinnamon: ["Whisk cinnamon into the base."],
      Biscoff: ["Whisk a little into the batter or reserve for filling between stacked pancakes."],
      PB: ["Whisk PB2 into the batter. Add a small splash of milk if it thickens too much."]
    },
    swirls: {
      None: [],
      "Cheesecake Layer": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 4]],
      "Chocolate Drizzle": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "PB Center": [["pb2", 12], ["almond milk unsweetened", 8]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Layer": ["Mix yogurt and cheesecake pudding until thick, then spread between pancake layers."],
      "Chocolate Drizzle": ["Whisk syrup and cocoa until smooth and drizzle between or over stacked pancakes."],
      "PB Center": ["Mix PB2 and almond milk into a thick paste and spread between pancakes as a center layer."]
    },
    toppings: {
      None: [],
      Syrup: [["sugar-free syrup", 20]],
      Fruit: [["strawberries", 60]],
      "Yogurt Dollop": [["greek yogurt nonfat", 35]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Syrup: ["Drizzle over the stack before serving."],
      Fruit: ["Top with fruit right before eating."],
      "Yogurt Dollop": ["Add a dollop on top of the stack for a thicker finish."]
    },
    creami: [
      "Blend the pancake base with extra almond milk and freeze for a pancake-batter style pint."
    ]
  },
  {
    category: "Protein Bars",
    name: "Base Protein Bars",
    clientName: "Protein Bars",
    servings: 6,
    base: [["whey isolate", 40], ["oat flour", 40], ["pb2", 20], ["almond milk unsweetened", 40], ["zero-cal sweetener", 6]],
    method: [
      "Mix all ingredients into a thick dough.",
      "Add selected flavor ingredients.",
      "Press half the mixture into a lined container if using a center layer.",
      "Build swirl/core if selected, then press the rest of the mixture over the top.",
      "Smooth firmly and chill 1–2 hours.",
      "Slice into bars."
    ],
    flavors: {
      Chocolate: [["cocoa powder", 10]],
      Biscoff: [["biscoff spread", 18]],
      Vanilla: [["instant pudding sugar-free vanilla", 8]],
      PB: [["pb2", 12]],
      Cheesecake: [["pudding mix sugar-free cheesecake", 8]]
    },
    flavorHow: {
      Chocolate: ["Whisk cocoa into the dry mix before adding liquid."],
      Biscoff: ["Warm slightly and fold into the dough or reserve for a ribbon."],
      Vanilla: ["Whisk pudding mix into the dry base."],
      PB: ["Add extra PB2 into the dough for a stronger peanut flavor."],
      Cheesecake: ["Whisk cheesecake pudding into the mix for a tangier flavor profile."]
    },
    swirls: {
      None: [],
      "Biscoff Center": [["biscoff spread", 20]],
      "Chocolate Layer": [["cocoa powder", 6], ["almond milk unsweetened", 12]],
      "Cheesecake Layer": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Biscoff Center": ["Spread Biscoff in a thin middle layer, then press remaining bar mixture on top."],
      "Chocolate Layer": ["Mix cocoa and milk into a spreadable paste and layer in the center."],
      "Cheesecake Layer": ["Mix yogurt and cheesecake pudding until thick, then spread as the middle layer before topping with remaining bar mixture."]
    },
    toppings: {
      None: [],
      Chips: [["sugar-free chocolate chips", 15]],
      Crumbs: [["graham crumbs", 12]],
      Drizzle: [["sugar-free syrup", 15]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Chips: ["Press into the top before chilling."],
      Crumbs: ["Sprinkle onto the top layer and press lightly."],
      Drizzle: ["Drizzle after slicing for a cleaner finish."]
    },
    creami: [
      "Blend the bar base with extra almond milk for a dense cookie-bar ice cream base if desired."
    ]
  },
  {
    category: "Mug Cakes",
    name: "Base Protein Mug Cake",
    clientName: "Protein Mug Cake",
    servings: 1,
    base: [["whey isolate", 25], ["oat flour", 20], ["egg whites", 70], ["almond milk unsweetened", 30], ["baking powder", 3], ["zero-cal sweetener", 4]],
    method: [
      "Whisk all ingredients in a microwave-safe mug until smooth.",
      "Add selected flavor ingredients.",
      "If using a core, add half the batter first, place the core in the middle, then cover with remaining batter.",
      "Microwave 45–75 seconds depending on thickness and microwave power.",
      "Rest 1 minute before topping."
    ],
    flavors: {
      Chocolate: [["cocoa powder", 8]],
      Cinnamon: [["cinnamon", 2]],
      PB: [["pb2", 12]],
      Biscoff: [["biscoff spread", 12]],
      Vanilla: [["instant pudding sugar-free vanilla", 6]]
    },
    flavorHow: {
      Chocolate: ["Whisk cocoa into the base."],
      Cinnamon: ["Whisk cinnamon into the base."],
      PB: ["Whisk PB2 into the batter for a thicker cake."],
      Biscoff: ["Warm slightly and stir in lightly for ribbons."],
      Vanilla: ["Whisk pudding mix into the batter for a sweeter flavor."]
    },
    swirls: {
      None: [],
      "Chocolate Core": [["sugar-free chocolate chips", 12]],
      "PB Core": [["pb2", 10], ["almond milk unsweetened", 6]],
      "Cheesecake Swirl": [["greek yogurt nonfat", 25], ["pudding mix sugar-free cheesecake", 4]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Chocolate Core": ["Pile chips in the center after half the batter is in the mug, then cover."],
      "PB Core": ["Mix PB2 and milk into a thick paste, spoon into the center, and cover with batter."],
      "Cheesecake Swirl": ["Mix yogurt and cheesecake pudding, spoon on top, and lightly swirl before microwaving."]
    },
    toppings: {
      None: [],
      Syrup: [["sugar-free syrup", 12]],
      "Yogurt Top": [["greek yogurt nonfat", 20]],
      "Cookie Crumbs": [["graham crumbs", 8]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Syrup: ["Drizzle immediately after cooking."],
      "Yogurt Top": ["Top after a short rest so it does not melt fully."],
      "Cookie Crumbs": ["Sprinkle over the top right before serving."]
    },
    creami: [
      "Blend the mug cake base with extra almond milk and freeze for a cake-batter pint."
    ]
  },
  {
    category: "Skillets",
    name: "Base Protein Skillet",
    clientName: "Protein Skillet",
    servings: 2,
    base: [["whey isolate", 30], ["oat flour", 35], ["egg whites", 110], ["almond milk unsweetened", 45], ["baking powder", 4], ["zero-cal sweetener", 6]],
    method: [
      "Preheat oven-safe skillet or pan.",
      "Mix dry ingredients, then whisk wet ingredients separately.",
      "Combine until smooth and add selected flavor ingredients.",
      "Pour into a greased skillet.",
      "Add swirl or core if using.",
      "Cook on low stovetop heat briefly, then finish in the oven or air fryer until set.",
      "Top and serve warm."
    ],
    flavors: {
      Chocolate: [["cocoa powder", 10]],
      Blueberry: [["blueberries", 60]],
      Cinnamon: [["cinnamon", 3]],
      PB: [["pb2", 14]],
      Biscoff: [["biscoff spread", 16]]
    },
    flavorHow: {
      Chocolate: ["Whisk cocoa into the dry base."],
      Blueberry: ["Fold blueberries in last."],
      Cinnamon: ["Whisk cinnamon into the batter."],
      PB: ["Whisk PB2 into the batter."],
      Biscoff: ["Warm slightly and swirl in or reserve for the center."]
    },
    swirls: {
      None: [],
      "Cheesecake Center": [["greek yogurt nonfat", 35], ["pudding mix sugar-free cheesecake", 4]],
      "Biscoff Core": [["biscoff spread", 18]],
      "Chocolate Swirl": [["sugar-free syrup", 16], ["cocoa powder", 4]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Center": ["Place the cheesecake mixture in the middle of the skillet batter and lightly cover it."],
      "Biscoff Core": ["Freeze a small Biscoff portion and place it in the center before finishing the top layer."],
      "Chocolate Swirl": ["Drizzle the chocolate mixture through the top before cooking to create ribbon pockets."]
    },
    toppings: {
      None: [],
      Syrup: [["sugar-free syrup", 16]],
      "Yogurt Top": [["greek yogurt nonfat", 25]],
      Chips: [["sugar-free chocolate chips", 12]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Syrup: ["Drizzle over the warm skillet."],
      "Yogurt Top": ["Top after the skillet cools slightly."],
      Chips: ["Sprinkle right after cooking for a partial melt."]
    },
    creami: [
      "Blend the skillet base with extra almond milk and freeze for a baked-batter style pint."
    ]
  }
  ,
  {
    category: "Rice Crispy Treats",
    name: "Base Protein Rice Crispy Treats",
    clientName: "Protein Rice Crispy Treats",
    servings: 6,
    base: [["rice krispies cereal", 40], ["whey isolate", 20], ["mini marshmallows", 35], ["light butter", 5]],
    method: [
      "Line a small loaf pan or container with parchment paper.",
      "Add the mini marshmallows and light butter to a microwave-safe bowl.",
      "Microwave in short bursts until melted, then stir until smooth and glossy.",
      "Whisk in the whey isolate quickly while the marshmallow mixture is still warm so it blends in without clumping.",
      "Fold in the selected crispy rice cereal gently so you keep as much crunch as possible.",
      "Add the selected flavor ingredients after the main mixture is evenly coated.",
      "If using a center or layer, press half the mixture into the pan first.",
      "Build the selected core or layer, then top with the remaining crispy mixture.",
      "Press lightly into the pan. Do not crush it down hard or the texture will lose crunch.",
      "Cool and set for 20–30 minutes, then finish with the selected topping and slice."
    ],
    flavors: {},
    flavorHow: {},
    swirls: {
      None: [],
      "Cheesecake Core": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]],
      "PB Center": [["pb2", 12], ["almond milk unsweetened", 8]],
      "Biscoff Core": [["biscoff spread", 18]],
      "Marshmallow Layer": [["mini marshmallows", 14]]
    },
    swirlBuild: {
      None: ["No core or center is selected, so press the whole batch into the pan once the flavored mixture is ready."],
      "Cheesecake Core": ["Mix the yogurt and cheesecake pudding until thick.", "Press half the crispy mixture into the pan, spread the cheesecake center through the middle, then top with the remaining crispy mixture and seal the edges."],
      "PB Center": ["Mix PB2 and almond milk into a thick peanut butter-style paste.", "Keep the center away from the edges so it stays hidden when sliced."],
      "Biscoff Core": ["Warm the Biscoff just enough to make it spreadable.", "Layer it through the center after pressing the first half down, then cover with the remaining crispy mixture."],
      "Marshmallow Layer": ["Scatter the extra marshmallows across the center layer before adding the top half of the mixture.", "Press lightly so they stay inside the bars."]
    },
    toppings: {
      None: [],
      "Chocolate Drizzle": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "PB Drizzle": [["pb2", 10], ["almond milk unsweetened", 10]],
      "Biscoff Drizzle": [["biscoff spread", 12]],
      "Marshmallow Top": [["mini marshmallows", 8]]
    },
    toppingHow: {
      None: ["No topping is selected, so slice and serve once the bars are fully set."],
      "Chocolate Drizzle": ["Whisk the syrup and cocoa until smooth, then drizzle it over the top after the bars are set."],
      "PB Drizzle": ["Mix PB2 and almond milk until glossy and spoonable, then drizzle lightly over the bars after slicing or just before slicing."],
      "Biscoff Drizzle": ["Warm the Biscoff slightly and drizzle it lightly over the finished bars."],
      "Marshmallow Top": ["Scatter the marshmallows over the top after slicing, or lightly torch them if you want a toasted finish."]
    },
    creami: [
      "This recipe is designed as a crunchy bar, not as a Creami base.",
      "If you want crispy topping in a Creami pint, keep the cereal for the final topping instead of freezing it in the base."
    ]
  },
  {
    category: "Rice Crispy Treats",
    name: "Chocolate Protein Rice Crispy Treats",
    clientName: "Chocolate Protein Rice Crispy Treats",
    servings: 6,
    base: [["chocolate crispy rice cereal", 40], ["whey isolate", 20], ["mini marshmallows", 35], ["light butter", 5], ["cocoa powder", 6]],
    method: [
      "Line a small loaf pan or container with parchment paper.",
      "Add the mini marshmallows and light butter to a microwave-safe bowl.",
      "Microwave in short bursts until melted, then stir until smooth.",
      "Whisk in the whey isolate and cocoa powder quickly while the mixture is warm so both ingredients blend in smoothly.",
      "Fold in the chocolate crispy rice cereal gently so the cereal stays crisp.",
      "If using a core or layer, press half the mixture into the pan first.",
      "Build the selected core or layer, then top with the remaining cereal mixture.",
      "Press lightly into the pan so you keep the texture airy and crunchy.",
      "Cool and set 20–30 minutes before finishing with the selected topping and slicing."
    ],
    flavors: {
      "Double Chocolate": [["cocoa powder", 8]],
      "Chocolate PB": [["pb2", 12]],
      "Chocolate Biscoff": [["biscoff spread", 14]],
      "Cookies & Cream Style": [["instant pudding sugar-free vanilla", 6]]
    },
    flavorHow: {
      "Double Chocolate": ["Whisk the extra cocoa into the melted mixture before folding in the cereal."],
      "Chocolate PB": ["Whisk PB2 into the warm mixture before the cereal goes in so the peanut butter flavor spreads evenly."],
      "Chocolate Biscoff": ["Warm the Biscoff slightly and fold it through the chocolate crispy mixture gently so you keep ribbons."],
      "Cookies & Cream Style": ["Whisk the vanilla pudding mix into the chocolate marshmallow mixture before the cereal is added."]
    },
    swirls: {
      None: [],
      "PB Center": [["pb2", 12], ["almond milk unsweetened", 8]],
      "Biscoff Core": [["biscoff spread", 18]],
      "Chocolate Layer": [["sugar-free syrup", 14], ["cocoa powder", 5]]
    },
    swirlBuild: {
      None: ["No core or layer is selected, so press the whole chocolate crispy mixture into the pan once ready."],
      "PB Center": ["Mix PB2 and almond milk into a thick center and keep it in the middle so it does not leak out the sides."],
      "Biscoff Core": ["Warm the Biscoff slightly, layer it in the center after pressing the bottom half down, then cover with the remaining mixture."],
      "Chocolate Layer": ["Whisk the syrup and cocoa until glossy, then spread a thin center ribbon between the two layers."]
    },
    toppings: {
      None: [],
      "Chocolate Drizzle": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "PB Drizzle": [["pb2", 10], ["almond milk unsweetened", 10]],
      "Biscoff Drizzle": [["biscoff spread", 12]]
    },
    toppingHow: {
      None: ["No topping is selected, so slice and serve once the bars are fully set."],
      "Chocolate Drizzle": ["Whisk the syrup and cocoa until smooth, then drizzle lightly over the bars after they are set."],
      "PB Drizzle": ["Mix PB2 and almond milk until smooth and drizzle lightly over the sliced bars."],
      "Biscoff Drizzle": ["Warm the Biscoff slightly and drizzle it lightly over the bars once set."]
    },
    creami: [
      "This recipe is intended as a crunchy bar recipe, not as a frozen Creami base.",
      "For a crunchy Creami topping, add chocolate cereal as a topping after the final spin."
    ]
  }

];

function scaleItems(items: Ingredient[], factor: number): Ingredient[] {
  return items.map(([name, amt]) => {
    const item = db[name];
    if (!item) return [name, amt];
    const unit = item.unit;
    if (unit === "unit") return [name, Math.max(1, Math.round(amt * factor))];
    const val = Math.round(amt * factor * 10) / 10;
    return [name, Number.isInteger(val) ? Math.trunc(val) : val];
  });
}

function calcMacros(items: Ingredient[]): Macro {
  return items.reduce(
    (acc, [name, amt]) => {
      const item = db[name];
      if (!item) return acc;
      acc.cal += item.cal * amt;
      acc.p += item.p * amt;
      acc.c += item.c * amt;
      acc.f += item.f * amt;
      return acc;
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  );
}

function addMacros(a: Macro, b: Macro): Macro {
  return { cal: a.cal + b.cal, p: a.p + b.p, c: a.c + b.c, f: a.f + b.f };
}

function divideMacros(m: Macro, servings: number): Macro {
  return { cal: m.cal / servings, p: m.p / servings, c: m.c / servings, f: m.f / servings };
}

function fmt(m: Macro) {
  return `${Math.round(m.cal)} cal • P ${m.p.toFixed(1)}g • C ${m.c.toFixed(1)}g • F ${m.f.toFixed(1)}g`;
}

function ingredientLine([name, amt]: Ingredient) {
  const unit = db[name].unit === "unit" ? "" : db[name].unit;
  return `${amt}${unit} ${name}`.trim();
}

function makeSavedId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mergeIngredientLists(lists: Ingredient[][]): Ingredient[] {
  const map = new Map<string, number>();
  for (const list of lists) {
    for (const [name, amt] of list) {
      map.set(name, (map.get(name) || 0) + amt);
    }
  }
  return Array.from(map.entries()).map(([name, amt]) => [name, Math.round(amt * 10) / 10] as Ingredient);
}

function scaleIngredientList(items: Ingredient[], multiplier: number): Ingredient[] {
  return items.map(([name, amt]) => [name, Math.round(amt * multiplier * 10) / 10] as Ingredient);
}

function buildComboFlavor(
  primaryFlavor: string,
  secondaryFlavor: string,
  intensity: ComboIntensity,
  flavorMap: Record<string, Ingredient[]>
): Ingredient[] {
  const primary = Array.isArray(flavorMap[primaryFlavor]) ? flavorMap[primaryFlavor] : [];
  const secondary = secondaryFlavor !== "None" && Array.isArray(flavorMap[secondaryFlavor]) ? flavorMap[secondaryFlavor] : [];

  if (secondaryFlavor === "None") return primary;

  const multipliers =
    intensity === "Light Blend"
      ? { primary: 0.75, secondary: 0.4 }
      : intensity === "Primary Dominant"
      ? { primary: 1.0, secondary: 0.55 }
      : { primary: 0.7, secondary: 0.7 };

  return mergeIngredientLists([
    scaleIngredientList(primary, multipliers.primary),
    scaleIngredientList(secondary, multipliers.secondary),
  ]);
}

function buildComboFlavorLabel(primaryFlavor: string, secondaryFlavor: string) {
  if (secondaryFlavor === "None") return primaryFlavor;
  return `${primaryFlavor} + ${secondaryFlavor}`;
}


function exportBrandedHTML(
  title: string,
  goal: Goal,
  servings: number,
  totalMacros: Macro,
  perServing: Macro,
  flavor: string,
  swirl: string,
  topping: string,
  baseList: Ingredient[],
  flavorList: Ingredient[],
  swirlList: Ingredient[],
  toppingList: Ingredient[],
  method: string[],
  flavorHow: string[],
  swirlHow: string[],
  toppingHow: string[],
  creami: string[]
) {
  const w = window.open("", "_blank", "width=900,height=1200");
  if (!w) return;

  const html = `
  <html>
    <head>
      <title>${title}</title>
      <style>
        body{background:#090909;color:#f5efe0;font-family:Arial,sans-serif;padding:24px}
        .wrap{max-width:900px;margin:0 auto}
        .card{border:1px solid rgba(212,175,55,.35);border-radius:18px;padding:18px;margin-bottom:16px;background:#111}
        h1,h2{color:#d4af37}
        .pill{display:inline-block;padding:8px 12px;border:1px solid rgba(212,175,55,.35);border-radius:999px;margin:0 8px 8px 0}
        ul,ol{line-height:1.6}
        .small{color:#c6c0b2}
      </style>
    </head>
    <body>
      <div class="wrap">
        <div style="text-align:center;margin-bottom:18px;"><img src="${window.location.origin}/logo-main.png" alt="Sclass Fitness" style="height:64px;max-width:100%;object-fit:contain;" /></div>
        <h1>${title}</h1>
        <div class="small">${BRAND.name} • ${goal}</div>

        <div class="card">
          <div class="pill">Flavor: ${flavor}</div>
          <div class="pill">Swirl / Core: ${swirl}</div>
          <div class="pill">Topping: ${topping}</div>
          <div style="margin-top:8px">Per Serving: ${fmt(perServing)}</div>
          <div class="small">Batch: ${fmt(totalMacros)} • Servings: ${servings}</div>
        </div>

        <div class="card"><h2>Base Ingredients</h2><ul>${baseList.map((x) => `<li>${ingredientLine(x)}</li>`).join("")}</ul></div>
        <div class="card"><h2>Flavor Ingredients</h2><ul>${flavorList.length ? flavorList.map((x) => `<li>${ingredientLine(x)}</li>`).join("") : "<li>None</li>"}</ul></div>
        <div class="card"><h2>Swirl / Core Ingredients</h2><ul>${swirlList.length ? swirlList.map((x) => `<li>${ingredientLine(x)}</li>`).join("") : "<li>None</li>"}</ul></div>
        <div class="card"><h2>Topping Ingredients</h2><ul>${toppingList.length ? toppingList.map((x) => `<li>${ingredientLine(x)}</li>`).join("") : "<li>None</li>"}</ul></div>
        <div class="card"><h2>Main Method</h2><ol>${method.map((x) => `<li>${x}</li>`).join("")}</ol></div>
        <div class="card"><h2>Flavor Build Method</h2><ul>${flavorHow.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="card"><h2>Swirl / Core Build Method</h2><ul>${swirlHow.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="card"><h2>Topping Method</h2><ul>${toppingHow.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="card"><h2>Ninja Creami Conversion</h2><ul>${creami.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>
    </body>
  </html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
}



const genericFlavorHow: Record<string, string[]> = {
  "None": ["No flavor add-in is selected, so keep the recipe base exactly as written."],
  "Banana": ["Mash or blend the banana until smooth, then mix it evenly through the base so the banana flavor spreads through the whole recipe."],
  "Banana Nut": ["Mash or blend the banana first, mix it into the base, then whisk in the nut-style ingredient so the flavor stays balanced and even."],
  "Biscoff": ["Warm the Biscoff slightly if needed, then fold it in gently so you keep visible ribbons and even flavor."],
  "Birthday Cake": ["Whisk the birthday-cake style vanilla ingredients in fully before shaping, baking, or chilling."],
  "Blueberry": ["Fold blueberries in gently at the end so they stay intact and visible."],
  "Blueberry Cheesecake": ["Mix the cheesecake-style ingredients first, then fold the blueberries in gently at the end."],
  "Cake Batter": ["Whisk the vanilla pudding-style ingredients into the base until smooth and evenly flavored."],
  "Chocolate": ["Whisk the cocoa thoroughly into the batter or mixture before baking, chilling, or freezing so there are no dry streaks."],
  "Chocolate PB": ["Whisk the chocolate ingredients in first, then blend in the peanut butter ingredients until smooth."],
  "Cinnamon Roll": ["Whisk the cinnamon and vanilla ingredients into the base until evenly distributed."],
  "Cinnamon Toast": ["Whisk the cinnamon and sweetener through the base until the flavor is evenly distributed."],
  "Cookies & Cream": ["Whisk the vanilla-style ingredients into the base, then keep any crunchy additions for the end if desired."],
  "Dark Chocolate": ["Whisk the cocoa in completely so the mixture is evenly dark and smooth before continuing."],
  "Double Chocolate": ["Whisk cocoa into the base, then fold chocolate chips in last so the texture stays clean."],
  "Peanut Butter": ["Whisk the peanut butter ingredients in thoroughly so the flavor spreads evenly with no dry pockets."],
  "Strawberry": ["Fold the strawberries in gently at the end so they stay visible and do not bleed too much into the recipe."],
  "Strawberry Cheesecake": ["Whisk the cheesecake-style ingredients in first, then fold the strawberries in gently at the end."],
  "Vanilla": ["Whisk the vanilla ingredients fully into the base so the flavor runs evenly through the entire recipe."]
};

const genericSwirlHow: Record<string, string[]> = {
  "None": ["No swirl or core is selected for this build."],
  "Center • PB": ["Spread or place the PB filling only in the middle so it stays as a defined center when sliced."],
  "Core • Biscoff": ["Warm slightly if needed, keep the Biscoff centered, and fully seal it inside the recipe so it stays as a true core."],
  "Core • Cheesecake": ["Mix the cheesecake ingredients until very thick.", "Freeze briefly if needed, place the core in the center, and fully cover it so it stays hidden."],
  "Core • Chocolate": ["Keep the chocolate center concentrated in the middle and fully cover it so it does not leak."],
  "Core • PB": ["Mix into a thick paste, freeze briefly if needed, then keep it centered and fully cover it."],
  "Ribbon • Biscoff": ["Spoon the Biscoff into a center trench or middle layer, then lightly fold or run a mix-in step once."],
  "Ribbon • Chocolate": ["Spread or streak the chocolate mixture through the center or top layer instead of mixing it all the way in."],
  "Ribbon • Chocolate Fudge": ["Spoon the ribbon into the center after the base is mostly done, then lightly fold for visible chocolate ribbons."],
  "Ripple • Cheesecake": ["Dot the cheesecake mixture over the surface or middle layer, then drag a knife through only a few times."],
  "Swirl • Biscoff": ["Warm slightly, spoon in small lines, and drag lightly to create visible ribbons without overmixing."],
  "Swirl • Blueberry": ["Lightly mash part of the blueberries, spoon over the top or middle, and drag lightly for a berry ribbon."],
  "Swirl • Cheesecake": ["Mix until smooth and thick, then spoon small amounts through the batter and drag lightly for a swirl."],
  "Swirl • Chocolate": ["Mix until glossy and drizzle lightly through the batter or over the top, then drag a knife through a few times only."],
  "Swirl • Fruit Jam": ["Spoon the fruit layer between sections or on top and swirl only a few times so it stays visible."],
  "Swirl • PB": ["Whisk into a drizzle consistency and lightly drag it across the top or middle layer."]
};

const genericToppingHow: Record<string, string[]> = {
  "None": ["No topping is selected for this build."],
  "Chocolate Drip": ["Whisk the chocolate drip until smooth and drizzle over the finished recipe after it has set or cooled."],
  "Chocolate Drizzle": ["Whisk until glossy and drizzle after baking, chilling, or freezing for the cleanest look."],
  "Chocolate Chips": ["Scatter the chips over the top after chilling or near the end of baking depending on whether you want texture or melt."],
  "PB Drip": ["Mix until glossy and drizzle over the finished recipe once the surface can hold it cleanly."],
  "PB Drizzle": ["Mix until smooth and spoon or drizzle over the top after the recipe is set."],
  "Biscoff Drip": ["Warm slightly and drizzle lightly over the top after the recipe is fully set."],
  "Biscoff Drizzle": ["Warm slightly and drizzle lightly so it stays on top and does not sink in."],
  "Cookie Crunch": ["Sprinkle the crunchy topping over the finished recipe right before serving or after setting for the best texture."],
  "Cookie Crumble": ["Add the crumble at the very end so it keeps its texture."],
  "Protein Frost": ["Whisk until thick and spreadable, then apply a light top layer once the recipe is cool or chilled."],
  "Vanilla Glaze": ["Mix until smooth and spoon over the finished recipe once it has cooled or set."],
  "Yogurt Glaze": ["Stir until smooth and drizzle or spread over the top after cooling."],
  "Yogurt Top": ["Add or spread the yogurt topping only after the recipe has cooled or chilled enough to hold it."],
  "Fresh Fruit": ["Top with fresh fruit just before serving for the cleanest texture and look."],
  "Fresh Fruit Top": ["Add the fresh fruit on top right before serving."],
  "Syrup": ["Drizzle syrup over the finished recipe right before eating or serving."]
};

function getRecipeType(recipeName: string) {
  const n = recipeName.toLowerCase();
  if (n.includes("muffin")) return "muffin";
  if (n.includes("brownie")) return "brownie";
  if (n.includes("cookie")) return "cookie";
  if (n.includes("cheesecake")) return "cheesecake";
  if (n.includes("creami") || n.includes("ice cream") || n.includes("pint")) return "creami";
  if (n.includes("pudding")) return "pudding";
  if (n.includes("donut")) return "donut";
  if (n.includes("pancake")) return "pancake";
  if (n.includes("bar")) return "bar";
  if (n.includes("mug cake")) return "mug";
  if (n.includes("skillet")) return "skillet";
  return "general";
}

function getDetailedGuide(recipeName: string, flavor: string, swirl: string, topping: string) {
  const recipeType = getRecipeType(recipeName);
  const swirlName = swirl.toLowerCase();
  const toppingName = topping.toLowerCase();

  const flavorGuide = [
    `Mix the base first until it is fully smooth before adding the ${flavor} ingredients.`,
    "If the flavor uses powders like cocoa, pudding mix, or PB2, whisk them in completely so there are no dry pockets.",
    "If the flavor uses fruit, chips, or spreads, fold those in last with a spoon or spatula so the texture stays clean.",
    ...(recipeType === "muffin" ? [
      "For muffins, mix only until the batter looks even. Overmixing makes them dense.",
      "If using berries or chips, fold them in gently right before portioning the batter."
    ] : []),
    ...(recipeType === "brownie" ? [
      "For brownies, keep the batter glossy and slightly thick. Stop mixing once the flavor is evenly distributed.",
      "If using chips or chunks, fold them in last so they stay visible in the finished brownies."
    ] : []),
    ...(recipeType === "cookie" ? [
      "For cookies, the dough should stay thick enough to scoop, flatten, or roll in your hands.",
      "If the dough softens too much after adding the flavor, let it rest 2–3 minutes before shaping."
    ] : []),
    ...(recipeType === "cheesecake" ? [
      "For cheesecake, add the flavor before the egg when possible, then mix the egg in last just until combined.",
      "Do not whip too much air into cheesecake batter or the texture can turn airy instead of creamy."
    ] : []),
    ...(recipeType === "creami" ? [
      "For Creami pints, blend flavor ingredients fully before freezing unless you want them to stay as a post-spin mix-in.",
      "If using fruit, blending it smooth before freezing gives the cleanest texture."
    ] : []),
    ...(recipeType === "pudding" ? [
      "For pudding cups, whisk until smooth, then let the mixture thicken for a few minutes before layering anything else.",
    ] : []),
    ...(recipeType === "donut" ? [
      "For donuts, keep the batter thick enough to pipe or spoon cleanly into the mold.",
    ] : []),
    ...(recipeType === "pancake" ? [
      "For pancakes, let the batter rest 2 minutes before cooking so it thickens slightly and cooks more evenly.",
    ] : []),
    ...(recipeType === "bar" ? [
      "For bars, the mixture should feel like a thick dough rather than a pourable batter.",
    ] : []),
    ...(recipeType === "mug" ? [
      "For mug cakes, keep the batter thick enough to hold the center in place once microwaved.",
    ] : []),
    ...(recipeType === "skillet" ? [
      "For skillets, keep the batter spreadable but not runny so the center stays soft without sinking.",
    ] : []),
  ];

  let swirlGuide: string[] = [];
  if (swirl === "None") {
    swirlGuide = [
      "No swirl or core is selected for this build.",
      "Once your flavor is mixed in evenly, continue straight to baking, chilling, freezing, or spinning.",
    ];
  } else if (recipeType === "cookie" && (swirlName.includes("core") || swirlName.includes("center"))) {
    swirlGuide = [
      `Make the ${swirl} separately first until it is thick enough to hold shape.`,
      "Flatten some dough in your hand, place the filling in the middle, then cover it with more dough.",
      "Pinch all seams shut so the filling is fully sealed before baking.",
      "If the center shows through, patch it with extra dough so it does not leak.",
    ];
  } else if ((recipeType === "muffin" || recipeType === "brownie" || recipeType === "donut" || recipeType === "mug" || recipeType === "skillet") && (swirlName.includes("core") || swirlName.includes("center"))) {
    swirlGuide = [
      `Make the ${swirl} separately first until it is thicker than the main batter.`,
      "If it is soft, freeze it for 10–20 minutes so it is easier to place cleanly.",
      "Fill the mold, cup, pan, or skillet halfway with the main batter.",
      "Place the core directly in the center, not touching the sides.",
      "Cover fully with the remaining batter so the core stays hidden and does not leak out.",
    ];
  } else if (recipeType === "cheesecake" && (swirlName.includes("swirl") || swirlName.includes("ribbon") || swirlName.includes("ripple"))) {
    swirlGuide = [
      `Make the ${swirl} separately until smooth or lightly thickened.`,
      "Pour the cheesecake batter first.",
      "Spoon the swirl over the top in dots or short lines.",
      "Drag a knife or skewer through it only 2–4 times for a defined ripple effect.",
      "Do not overmix or the swirl will disappear into the batter.",
    ];
  } else if (recipeType === "creami") {
    swirlGuide = [
      `Prepare the ${swirl} separately before serving.`,
      "Spin the pint first until creamy.",
      "Use a spoon to make a trench down the center of the pint.",
      "Spoon the swirl or ribbon into that trench.",
      "Run Mix-In once if you want it lightly distributed, or fold it in by hand if you want stronger ribbons.",
    ];
  } else if (recipeType === "pudding") {
    swirlGuide = [
      `Prepare the ${swirl} separately until smooth or thick.`,
      "Fill the cup halfway with pudding.",
      "Add the swirl or center in the middle layer.",
      "Cover with the remaining pudding so you get a visible layered effect when spooning through it.",
    ];
  } else if (recipeType === "bar") {
    swirlGuide = [
      `Make the ${swirl} separately first.`,
      "Press half of the bar mixture into the container.",
      "Spread or place the center over the middle layer, keeping it slightly away from the edges.",
      "Press the remaining bar mixture on top and smooth firmly so the bars slice cleanly later.",
    ];
  } else if (swirlName.includes("swirl") || swirlName.includes("ribbon") || swirlName.includes("ripple") || swirlName.includes("drizzle")) {
    swirlGuide = [
      `Make the ${swirl} separately until smooth and slightly thick, not watery.`,
      "Add it in thin lines or small dots across the top or middle layer.",
      "Drag a knife, skewer, or spoon handle through it only a few times.",
      "Stop as soon as you see a visible pattern. Overmixing will erase the swirl.",
    ];
  } else {
    swirlGuide = [
      `Prepare the ${swirl} separately first.`,
      "Keep it slightly thicker than the main mixture so it stays visible in the finished recipe.",
      "Layer it carefully and avoid mixing it fully into the batter.",
    ];
  }

  let toppingGuide: string[] = [];
  if (topping === "None") {
    toppingGuide = [
      "No topping is selected for this build.",
      "Let the final texture set properly before eating or slicing.",
    ];
  } else if (recipeType === "creami") {
    toppingGuide = [
      `Add the ${topping} only after the final spin.`,
      "If it is crunchy, sprinkle it on top right before eating so it stays crisp.",
      "If it is a drizzle, spoon it slowly over the finished pint or into a trench for ribbon pockets.",
    ];
  } else if (recipeType === "cheesecake" || recipeType === "pudding") {
    toppingGuide = [
      `Add the ${topping} after the dessert is fully chilled and set.`,
      "For yogurt or frosting-style toppings, spread gently with the back of a spoon.",
      "For crumbs, chips, or fruit, add them last so the texture stays distinct.",
    ];
  } else {
    toppingGuide = [
      `Apply the ${topping} after the recipe is cooked or fully set unless the recipe specifically says otherwise.`,
      "If it is a drizzle or glaze, stir until smooth first, then spoon or drizzle it slowly over the top.",
      "If it includes crumbs, chips, or fruit, scatter them evenly at the end for the cleanest finish.",
      "Let warm recipes cool 2–5 minutes before topping so everything does not melt straight into the surface.",
    ];
  }

  const textureTips = [
    "If a core is too runny, thicken it or freeze it briefly before using it.",
    "If the batter feels too thin, let it sit 1–3 minutes so the powders hydrate before filling or layering.",
    "If the swirl disappears, you mixed too aggressively or too long.",
    "If the center leaks, it was too close to the edge or was not fully covered.",
    "For cleaner layers and cores, a spoon or piping bag works better than pouring freehand.",
  ];

  return { flavorGuide, swirlGuide, toppingGuide, textureTips, recipeType };
}


export default function SclassRecipeAppFinal() {
  const [goal, setGoal] = useState<Goal>("Lean");
  const [category, setCategory] = useState("All");
  const [proteinMode, setProteinMode] = useState<ProteinMode>("Whey");
  const [showIntro, setShowIntro] = useState(true);


  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => category === "All" || r.category === category);
  }, [category]);

  const categories = ["All", ...Array.from(new Set(recipes.map((r) => r.category)))];

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(215,176,75,0.14),_transparent_30%),linear-gradient(180deg,#080808,#020202)]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.72, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
              <motion.img
                src={BRAND.logos.mark}
                alt="Sclass Fitness"
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{
                  opacity: 1,
                  scale: [0.92, 1.05, 1],
                }}
                transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-28 w-28 object-contain drop-shadow-[0_0_28px_rgba(215,176,75,0.22)] sm:h-36 sm:w-36 md:h-44 md:w-44"
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-6 text-center"
              >
                <div className="text-[11px] uppercase tracking-[0.42em] text-yellow-500">Sclass Fitness</div>
                <div className="mt-2 text-sm text-neutral-400">Recipe Vault</div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative overflow-hidden rounded-3xl border border-yellow-700/40 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.16),_transparent_28%),linear-gradient(180deg,rgba(23,23,23,1),rgba(10,10,10,1))] shadow-2xl">
            <img src={BRAND.logos.mark} alt="" className="pointer-events-none absolute right-4 top-4 h-24 w-24 opacity-[0.07] sm:h-28 sm:w-28" />
            <div className="border-b border-yellow-700/20 px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img src={BRAND.logos.main} alt={BRAND.name} className="h-24 w-auto object-contain sm:h-28" />
                    <div>
                      <div className="mb-2 text-[11px] uppercase tracking-[0.35em] text-yellow-500">{BRAND.tag}</div>
                      <h1 className="text-3xl font-bold leading-tight text-yellow-300 sm:text-4xl md:text-5xl">
                        {BRAND.appName}
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm text-neutral-300 sm:text-base">
                        Premium branded recipe system with dynamic macros, combo flavor building, branded export,
                        and a cleaner premium layout.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge icon={<BookOpen className="h-3.5 w-3.5" />} label="Sclass Cookbook Builder" />
                    <Badge icon={<Wand2 className="h-3.5 w-3.5" />} label="Luxury Flavor Expansion" />
                    <Badge icon={<Calculator className="h-3.5 w-3.5" />} label="Auto Macros" />
                    <Badge icon={<ChefHat className="h-3.5 w-3.5" />} label="Rice Crispy Elite" />
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[680px] xl:grid-cols-3">
                  <ControlCard label="Goal">
                    <AppSelect value={goal} onChange={(e) => setGoal(e.target.value as Goal)} options={Object.keys(goalMultipliers)} />
                  </ControlCard>
                  <ControlCard label="Category">
                    <AppSelect value={category} onChange={(e) => setCategory(e.target.value)} options={categories} />
                  </ControlCard>
                  <ControlCard label="Protein Source">
                    <AppSelect value={proteinMode} onChange={(e) => setProteinMode(e.target.value as ProteinMode)} options={["Whey", "No Whey"]} />
                  </ControlCard>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 grid-cols-1">
          <div className="space-y-6">
            {filteredRecipes.map((recipe, idx) => (
              <RecipeCard
                key={recipe.name}
                recipe={recipe}
                goal={goal}
                proteinMode={proteinMode}
                index={idx}
              />
            ))}
          </div>

          
        </div>
        <div className="mt-8 rounded-3xl border border-yellow-700/25 bg-neutral-950/90 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={BRAND.logos.online} alt="Sclass Online Coaching" className="h-16 w-auto object-contain opacity-95" />
              <div>
                <div className="text-sm font-semibold text-yellow-300">Built for {BRAND.name}</div>
                <div className="text-sm text-neutral-400">Luxury coaching aesthetic • premium recipe delivery • branded client experience • splash screen included</div>
              </div>
            </div>
            <div className="rounded-2xl border border-yellow-700/20 bg-neutral-900/80 px-4 py-3 text-xs uppercase tracking-[0.28em] text-neutral-400">
              Coach Sclass Master Edition
            </div>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}

function RecipeCard({
  recipe,
  goal,
  proteinMode,
  index,
}: {
  recipe: Recipe;
  goal: Goal;
  proteinMode: ProteinMode;
  index: number;
}) {
  const factor = goalMultipliers[goal];

  const scaledBase = useMemo(() => scaleItems(recipe.base, factor), [recipe, factor]);
  const scaledFlavors = useMemo(
    () => Object.fromEntries(Object.entries(recipe.flavors).map(([k, v]) => [k, scaleItems(v, factor)])),
    [recipe, factor]
  );
  const scaledSwirls = useMemo(
    () => Object.fromEntries(Object.entries(recipe.swirls).map(([k, v]) => [k, scaleItems(v, factor)])),
    [recipe, factor]
  );
  const scaledToppings = useMemo(
    () => Object.fromEntries(Object.entries(recipe.toppings).map(([k, v]) => [k, scaleItems(v, factor)])),
    [recipe, factor]
  );

  const packFlavors = {};

  const sortWithNoneFirst = (keys: string[]) => {
    const withoutNone = keys.filter((k) => k !== "None").sort((a, b) => a.localeCompare(b));
    return ["None", ...withoutNone];
  };

  const mergedFlavorsUnsorted = Object.fromEntries(
    Object.entries(commonFlavors).map(([k, v]) => [k, scaleItems(v, factor)])
  );
  const mergedSwirlsUnsorted = Object.fromEntries(
    Object.entries(commonSwirls).map(([k, v]) => [k, scaleItems(v, factor)])
  );
  const mergedToppingsUnsorted = Object.fromEntries(
    Object.entries(commonToppings).map(([k, v]) => [k, scaleItems(v, factor)])
  );

  const flavorKeys = sortWithNoneFirst(Object.keys(mergedFlavorsUnsorted));
  const swirlKeys = sortWithNoneFirst(Object.keys(mergedSwirlsUnsorted));
  const toppingKeys = sortWithNoneFirst(Object.keys(mergedToppingsUnsorted));

  const mergedFlavors = Object.fromEntries(flavorKeys.map((k) => [k, mergedFlavorsUnsorted[k]]));
  const mergedSwirls = Object.fromEntries(swirlKeys.map((k) => [k, mergedSwirlsUnsorted[k]]));
  const mergedToppings = Object.fromEntries(toppingKeys.map((k) => [k, mergedToppingsUnsorted[k]]));

  const [primaryFlavor, setPrimaryFlavor] = useState("None");
  const [secondaryFlavor, setSecondaryFlavor] = useState("None");
  const [comboIntensity, setComboIntensity] = useState<ComboIntensity>("Even Split");
  const [swirl, setSwirl] = useState("None");
  const [topping, setTopping] = useState("None");

  useEffect(() => {
    if (!flavorKeys.includes(primaryFlavor)) setPrimaryFlavor("None");
    if (!flavorKeys.includes(secondaryFlavor)) setSecondaryFlavor("None");
  }, [goal, primaryFlavor, secondaryFlavor]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!swirlKeys.includes(swirl)) setSwirl(swirlKeys[0]);
    if (!toppingKeys.includes(topping)) setTopping(toppingKeys[0]);
  }, [goal, primaryFlavor, secondaryFlavor]); // eslint-disable-line react-hooks/exhaustive-deps

  const flavorList = buildComboFlavor(primaryFlavor, secondaryFlavor, comboIntensity, mergedFlavors);
  const flavorLabel = buildComboFlavorLabel(primaryFlavor, secondaryFlavor);
  const swirlList = mergedSwirls[swirl] || [];
  const toppingList = mergedToppings[topping] || [];

  const isRiceCrispy = recipe.category === "Rice Crispy Treats";
  const shouldUseChocolateCereal =
    isRiceCrispy && (
      flavorLabel.toLowerCase().includes("chocolate") ||
      recipe.name.toLowerCase().includes("chocolate")
    );

  let baseList = shouldUseChocolateCereal
    ? scaledBase.map(([name, amt]) =>
        name === "rice krispies cereal" ? ["chocolate crispy rice cereal", amt] as Ingredient : [name, amt]
      )
    : scaledBase;

  if (isRiceCrispy && proteinMode === "No Whey") {
    baseList = baseList
      .filter(([name]) => name !== "whey isolate")
      .map(([name, amt]) => {
        if (name === "rice krispies cereal") return [name, amt + 15] as Ingredient;
        if (name === "chocolate crispy rice cereal") return [name, amt + 15] as Ingredient;
        if (name === "mini marshmallows") return [name, amt + 5] as Ingredient;
        return [name, amt] as Ingredient;
      });
  }

  const baseMacros = calcMacros(baseList);
  const flavorMacros = calcMacros(flavorList);
  const swirlMacros = calcMacros(swirlList);
  const toppingMacros = calcMacros(toppingList);
  const totalMacros = addMacros(addMacros(addMacros(baseMacros, flavorMacros), swirlMacros), toppingMacros);

  const detailTitle = recipe.name;
  const detailedGuide = getDetailedGuide(recipe.name, flavorLabel, swirl, topping);
  const flavorMethodItems = secondaryFlavor === "None"
    ? (genericFlavorHow[primaryFlavor] || recipe.flavorHow?.[primaryFlavor] || detailedGuide.flavorGuide)
    : [
        `Primary flavor: ${primaryFlavor}. Secondary flavor: ${secondaryFlavor}. Intensity: ${comboIntensity}.`,
        "Build the combo by mixing the primary flavor into the base first, then blending in the secondary flavor gently so both stay balanced.",
        "If both flavors use wet add-ins or fruit, add the heavier ingredient first and fold delicate fruit or chips in last.",
      ];
  const swirlMethodItems = genericSwirlHow[swirl] || recipe.swirlBuild?.[swirl] || detailedGuide.swirlGuide;
  const toppingMethodItems = genericToppingHow[topping] || recipe.toppingHow?.[topping] || detailedGuide.toppingGuide;

  const exportBranded = () =>
    exportBrandedHTML(
      detailTitle,
      goal,
      recipe.servings,
      totalMacros,
      divideMacros(totalMacros, recipe.servings),
      flavorLabel,
      swirl,
      topping,
      baseList,
      flavorList,
      swirlList,
      toppingList,
      recipe.method,
      flavorMethodItems,
      swirlMethodItems,
      toppingMethodItems,
      recipe.creami
    );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }}>
      <div className="overflow-hidden rounded-3xl border border-yellow-700/35 bg-neutral-950 shadow-xl">
        <div className="border-b border-yellow-700/20 bg-gradient-to-r from-yellow-900/10 to-transparent p-5 sm:p-6">
          <div className="mb-2 text-[10px] uppercase tracking-[0.28em] text-yellow-500">{recipe.category}</div>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-yellow-300">{detailTitle}</h2>
                <div className="mt-1 text-sm text-neutral-400">Servings: {recipe.servings}</div>
                <div className="mt-1 text-xs text-neutral-500">Primary + Secondary flavor combo builder enabled.</div>
                {recipe.category === "Rice Crispy Treats" && (
                  <div className="mt-1 text-xs text-neutral-500">
                    Protein source: {proteinMode}. Chocolate builds auto-switch to chocolate crispy rice cereal.
                  </div>
                )}
              </div>
              <img src={BRAND.logos.mark} alt="" className="h-16 w-16 object-contain opacity-95" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              <AppSelect value={primaryFlavor} onChange={(e) => setPrimaryFlavor(e.target.value)} options={flavorKeys} />
              <AppSelect value={secondaryFlavor} onChange={(e) => setSecondaryFlavor(e.target.value)} options={flavorKeys} />
              <AppSelect value={comboIntensity} onChange={(e) => setComboIntensity(e.target.value as ComboIntensity)} options={["Light Blend", "Even Split", "Primary Dominant"]} />
              <AppSelect value={swirl} onChange={(e) => setSwirl(e.target.value)} options={swirlKeys} />
              <AppSelect value={topping} onChange={(e) => setTopping(e.target.value)} options={toppingKeys} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="rounded-2xl border border-yellow-700/20 bg-neutral-900/70 px-4 py-3 text-sm text-neutral-300">
                Combo Builder: <span className="text-yellow-300 font-medium">{flavorLabel}</span>
              </div>
              <button
                onClick={exportBranded}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-yellow-700/40 bg-neutral-950 px-5 text-white transition hover:border-yellow-500"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Base Batch" value={fmt(baseMacros)} icon={<ChefHat className="h-4 w-4" />} />
            <StatCard title="Final Batch" value={fmt(totalMacros)} icon={<Sparkles className="h-4 w-4" />} />
            <StatCard title="Per Serving" value={fmt(divideMacros(totalMacros, recipe.servings))} icon={<Calculator className="h-4 w-4" />} />
            <StatCard title="Build" value={`${flavorLabel} • ${swirl} • ${topping} • ${proteinMode}`} icon={<Layers3 className="h-4 w-4" />} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel title="Ingredients Breakdown">
              <div className="space-y-3 text-sm">
                <IngredientGroup title="Base" items={baseList} />
                <IngredientGroup title={`Flavor (${flavorLabel})`} items={flavorList} />
                <IngredientGroup title={`Swirl / Core (${swirl})`} items={swirlList} />
                <IngredientGroup title={`Topping (${topping})`} items={toppingList} />
              </div>
            </Panel>

            <Panel title="Build Deltas">
              <div className="space-y-3 text-sm">
                <DeltaRow label={`Flavor: ${flavorLabel}`} batch={fmt(flavorMacros)} per={fmt(divideMacros(flavorMacros, recipe.servings))} />
                <DeltaRow label={`Swirl / Core: ${swirl}`} batch={fmt(swirlMacros)} per={fmt(divideMacros(swirlMacros, recipe.servings))} />
                <DeltaRow label={`Topping: ${topping}`} batch={fmt(toppingMacros)} per={fmt(divideMacros(toppingMacros, recipe.servings))} />
              </div>
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel title="Main Method">
              <ol className="list-decimal space-y-3 pl-5 text-sm text-neutral-200">
                {recipe.method.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </Panel>

            <div className="space-y-6">
              <Panel title="Flavor Build Method">
                <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-200">
                  {flavorMethodItems.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Swirl / Core Build Method">
                <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-200">
                  {swirlMethodItems.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Topping Method">
                <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-200">
                  {toppingMethodItems.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Ninja Creami Conversion" icon={<IceCreamBowl className="h-4 w-4" />}>
                <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-200">
                  {recipe.creami.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel title="Detailed Build Guide">
              <div className="space-y-5 text-sm text-neutral-200">
                <GuideSection title={`How to add the flavor: ${flavorLabel}`} items={detailedGuide.flavorGuide} />
                <GuideSection title={swirl === "None" ? "Swirl / core guide" : `How to build the ${swirl}`} items={detailedGuide.swirlGuide} />
                <GuideSection title={topping === "None" ? "Topping guide" : `How to finish with ${topping}`} items={detailedGuide.toppingGuide} />
              </div>
            </Panel>

            <Panel title="Texture & Core Tips">
              <div className="space-y-4 text-sm text-neutral-200">
                <GuideSection title="Important technique notes" items={detailedGuide.textureTips} />
                <div className="rounded-2xl border border-yellow-700/20 bg-neutral-950/70 p-3">
                  <div className="mb-2 font-medium text-yellow-300">Best order to build</div>
                  <p>1. Mix base completely smooth.</p>
                  <p>2. Add flavor ingredients.</p>
                  <p>3. If using a core, freeze or thicken it first.</p>
                  <p>4. Add half the batter, place the core or swirl, then cover or drag through lightly.</p>
                  <p>5. Cook, chill, or freeze based on the recipe.</p>
                  <p>6. Finish with topping only once the texture is set enough to hold it.</p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Panel({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-900/60">
      <div className="border-b border-yellow-700/15 px-4 py-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-yellow-300">
          {icon}
          {title}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ControlCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs text-neutral-400">{label}</div>
      {children}
    </div>
  );
}

function AppSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-12 w-full rounded-2xl border border-yellow-700/40 bg-neutral-900 px-4 text-white outline-none transition focus:border-yellow-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-neutral-900">
          {opt}
        </option>
      ))}
    </select>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-700/30 bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-200">
      <span className="text-yellow-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-900/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-yellow-300">
        {icon}
        <span>{title}</span>
      </div>
      <div className="break-words text-sm font-medium leading-relaxed text-neutral-100 sm:text-base">{value}</div>
    </div>
  );
}

function IngredientGroup({ title, items }: { title: string; items: Ingredient[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border border-yellow-700/20 p-3">
      <div className="mb-2 font-semibold text-yellow-300">{title}</div>
      <ul className="space-y-1 text-neutral-200">
        {items.map((item, i) => (
          <li key={`${title}-${i}`}>{ingredientLine(item)}</li>
        ))}
      </ul>
    </div>
  );
}


function GuideSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-950/70 p-3">
      <div className="mb-2 font-medium text-yellow-300">{title}</div>
      <ul className="list-disc space-y-2 pl-5 text-neutral-200">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}


function DeltaRow({ label, batch, per }: { label: string; batch: string; per: string }) {
  return (
    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-950/70 p-3">
      <div className="mb-2 font-medium text-yellow-300">{label}</div>
      <div className="text-neutral-300">Batch: {batch}</div>
      <div className="mt-1 text-neutral-400">Per serving: {per}</div>
    </div>
  );
}
