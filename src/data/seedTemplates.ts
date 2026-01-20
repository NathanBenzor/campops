export type TemplateItem = {
  name: string;
  category: string;
  quantity?: number;
  note?: string;
  sortOrder?: number;
};

export type PackingTemplate = {
  id: "car_camping_basic" | "backpacking_basic";
  name: string;
  tripType: "car_camping" | "backpacking";
  items: TemplateItem[];
};

export const PACKING_TEMPLATES: PackingTemplate[] = [
  {
    id: "car_camping_basic",
    name: "Car Camping (Basic)",
    tripType: "car_camping",
    items: [
      { category: "Shelter", name: "Tent", quantity: 1, sortOrder: 10 },
      {
        category: "Shelter",
        name: "Footprint / Ground tarp",
        quantity: 1,
        sortOrder: 20,
      },
      { category: "Shelter", name: "Stakes", quantity: 1, sortOrder: 30 },
      { category: "Shelter", name: "Mallet", quantity: 1, sortOrder: 40 },

      { category: "Sleep", name: "Sleeping bag", quantity: 1, sortOrder: 10 },
      { category: "Sleep", name: "Sleeping pad", quantity: 1, sortOrder: 20 },
      { category: "Sleep", name: "Pillow", quantity: 1, sortOrder: 30 },

      { category: "Kitchen", name: "Stove", quantity: 1, sortOrder: 10 },
      { category: "Kitchen", name: "Fuel", quantity: 1, sortOrder: 20 },
      {
        category: "Kitchen",
        name: "Lighter / matches",
        quantity: 1,
        sortOrder: 30,
      },
      { category: "Kitchen", name: "Pot / pan", quantity: 1, sortOrder: 40 },
      { category: "Kitchen", name: "Mug / bottle", quantity: 1, sortOrder: 50 },
      { category: "Kitchen", name: "Utensils", quantity: 1, sortOrder: 60 },

      {
        category: "Water",
        name: "Water (jugs/bottles)",
        quantity: 1,
        sortOrder: 10,
      },

      { category: "Safety", name: "First aid kit", quantity: 1, sortOrder: 10 },
      { category: "Safety", name: "Headlamp", quantity: 1, sortOrder: 20 },
      {
        category: "Safety",
        name: "Extra batteries",
        quantity: 1,
        sortOrder: 30,
      },

      { category: "Hygiene", name: "Sunscreen", quantity: 1, sortOrder: 10 },
      { category: "Hygiene", name: "Bug spray", quantity: 1, sortOrder: 20 },
      {
        category: "Hygiene",
        name: "Toothbrush/toothpaste",
        quantity: 1,
        sortOrder: 30,
      },

      { category: "Tools", name: "Trash bags", quantity: 1, sortOrder: 10 },
      { category: "Tools", name: "Multi-tool", quantity: 1, sortOrder: 20 },
    ],
  },
  {
    id: "backpacking_basic",
    name: "Backpacking (Overnight Basic)",
    tripType: "backpacking",
    items: [
      { category: "Shelter", name: "Tent / tarp", quantity: 1, sortOrder: 10 },
      { category: "Shelter", name: "Stakes", quantity: 1, sortOrder: 20 },

      {
        category: "Sleep",
        name: "Quilt / sleeping bag",
        quantity: 1,
        sortOrder: 10,
      },
      { category: "Sleep", name: "Sleeping pad", quantity: 1, sortOrder: 20 },

      { category: "Kitchen", name: "Stove", quantity: 1, sortOrder: 10 },
      { category: "Kitchen", name: "Fuel", quantity: 1, sortOrder: 20 },
      { category: "Kitchen", name: "Pot", quantity: 1, sortOrder: 30 },
      { category: "Kitchen", name: "Spoon", quantity: 1, sortOrder: 40 },

      {
        category: "Water",
        name: "Water bottles (2L capacity)",
        quantity: 1,
        sortOrder: 10,
      },
      { category: "Water", name: "Water filter", quantity: 1, sortOrder: 20 },

      { category: "Safety", name: "Headlamp", quantity: 1, sortOrder: 10 },
      { category: "Safety", name: "First aid kit", quantity: 1, sortOrder: 20 },
      {
        category: "Safety",
        name: "Navigation (offline maps)",
        quantity: 1,
        sortOrder: 30,
      },

      { category: "Clothing", name: "Rain shell", quantity: 1, sortOrder: 10 },
      { category: "Clothing", name: "Warm layer", quantity: 1, sortOrder: 20 },

      { category: "Food", name: "Meals / snacks", quantity: 1, sortOrder: 10 },
    ],
  },
];
