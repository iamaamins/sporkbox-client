export const FAQ_DATA = [
  {
    question: 'How do I cancel my order?',
    answer: [
      "Go to your Dashboard and click on the date of the order you’d like to cancel. This will take you to the order review page, where you’ll see an orange “Cancel” button. Click that button to cancel your order. Your daily budget will automatically be replenished by the dollar amount of that item, and you can go back and re-order for that day if you'd like.",
    ],
  },
  {
    question: 'How do I change my shift?',
    answer: [
      "Navigate to your Profile page. Under your name, click “Select shift” and choose the shift you'd like to assign your meals to.",
      'Please note that this change only applies to future orders placed after you update your shift.',
    ],
  },
  {
    question: 'When do I need to order by?',
    answer: [
      'Most restaurants close 48 hours before each delivery date and time.',
      'We always aim to have at least one restaurant available for orders up to 24 hours before delivery.',
      'To see the widest selection, try ordering soon after you receive the “Time to Order” email.',
    ],
  },
  {
    question: 'How can I recommend a new restaurant?',
    answer: [
      'We love hearing your suggestions!',
      'Email portland@sporkbytes.com with your restaurant recommendation.',
      'We partner only with locally owned restaurants (no national chains), and each partner must meet our standards for packaging, quality, and reliability before joining Spork Box.',
    ],
  },
  {
    question: 'How do I change my dietary preferences?',
    answer: [
      'To update your preferences permanently, go to your Profile page and click “Food preferences.”',
      'Select your dietary preferences, and these filters will automatically apply every time you order.',
      'To adjust filters for just one order, click “Filter” at the top of the Place Order page and select your preferences there.',
    ],
  },
  {
    question: "My meal didn't show up. What should I do?",
    answer: [
      'Navigate to the section above and report it there.',
      'Choose the category “Missing Meal” and provide as much detail as possible.',
      "We'll look into it promptly and issue a discount code for a future meal if we determine the meal was lost on our account.",
      ,
    ],
  },
  {
    question: 'Can I pay extra if my meal exceeds the company budget?',
    answer: [
      "Yes! If your cart total exceeds your company's daily meal budget, you can pay the remaining balance securely by credit or debit card at checkout.",
    ],
  },
  {
    question: 'Can I add or remove items after placing an order?',
    answer: [
      "You can modify or cancel your order until the restaurant's order window closes. After that time, your meal is locked in to ensure timely preparation and delivery.",
    ],
  },
  {
    question: 'How do I know when my meal is arriving?',
    answer: [
      "You'll receive an email delivery notification once your order is on its way.",
      "If your company uses Slack, we can also set up delivery notifications in your team's Slack channel—just ask your company administrator.",
    ],
  },
  {
    question: 'How big are the portion sizes?',
    answer: [
      'Most Spork Box meals come directly from our local restaurant partners and are intended as individual entrée-sized portions—perfect for lunch. Some restaurants may include sides or small desserts depending on the menu.',
    ],
  },
  {
    question: 'Can I see nutritional or allergen information?',
    answer: [
      "Where available, restaurants provide allergen and ingredient details. You can find them by clicking on a menu item's name before adding it to your cart. If you have a severe allergy, please also note it in the special instructions section during checkout.",
    ],
  },
] as const;
