export interface TestQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TestPassage {
  id: string;
  title: string;
  text: string;
  wordCount: number;
  questions: TestQuestion[];
}

const passages: TestPassage[] = [
  {
    id: "coffee-origins",
    title: "The Origins of Coffee",
    text: `The history of coffee begins in Ethiopia, where legend says a goat herder named Kaldi noticed his goats became unusually energetic after eating berries from a certain tree. Curious, he tried the berries himself and experienced a similar burst of alertness. He brought the berries to a local monastery, where monks brewed them into a drink that helped them stay awake during long evening prayers.

By the fifteenth century, coffee was being cultivated in Yemen and traded across the Arabian Peninsula. Coffeehouses, known as qahveh khaneh, sprang up in cities throughout the Middle East. These establishments quickly became centers of social activity, earning the nickname "Schools of the Wise." Patrons would gather to share news, discuss politics, listen to music, and play chess.

Coffee reached Europe in the seventeenth century and was initially met with suspicion. Some called it the "bitter invention of Satan." When coffee arrived in Venice in 1615, the local clergy condemned it. Pope Clement VIII was asked to intervene, but after tasting the beverage himself, he found it so satisfying that he gave it papal approval.

The Dutch were the first Europeans to obtain live coffee trees, which they planted in their colonies in Java and Suriname. The French followed suit, establishing plantations in the Caribbean. A single plant gifted to King Louis XIV became the parent of all coffee trees throughout French colonial territories. Brazil, which would eventually become the world's largest producer, received its first coffee seedlings in 1727 through a diplomatic mission that involved a cleverly concealed gift of seeds and cuttings.

Today, coffee is the second most traded commodity in the world after petroleum. Over two billion cups are consumed daily across the globe. The industry supports roughly twenty-five million farming families, and the beverage remains central to economies and cultures on every inhabited continent.`,
    wordCount: 272,
    questions: [
      {
        question: "According to legend, who first discovered the effects of coffee?",
        options: [
          "A monk during evening prayers",
          "A goat herder named Kaldi",
          "A Yemeni trader",
          "Pope Clement VIII",
        ],
        correctIndex: 1,
      },
      {
        question: "What were Middle Eastern coffeehouses nicknamed?",
        options: [
          "Houses of Prayer",
          "The Arabian Halls",
          "Schools of the Wise",
          "Merchants' Quarters",
        ],
        correctIndex: 2,
      },
      {
        question: "How did Pope Clement VIII respond to coffee?",
        options: [
          "He banned it throughout Europe",
          "He ignored the controversy",
          "He gave it papal approval after tasting it",
          "He declared it a medicine",
        ],
        correctIndex: 2,
      },
      {
        question: "How did Brazil obtain its first coffee seedlings?",
        options: [
          "Through a trade agreement with the Dutch",
          "By purchasing them from Yemen",
          "Through a diplomatic mission with concealed seeds",
          "From French plantations in the Caribbean",
        ],
        correctIndex: 2,
      },
      {
        question: "What is the most traded commodity in the world?",
        options: ["Coffee", "Petroleum", "Gold", "Sugar"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "octopus-intelligence",
    title: "The Intelligence of Octopuses",
    text: `Octopuses are widely regarded as the most intelligent invertebrates on Earth. Their nervous system contains roughly five hundred million neurons, comparable in number to that of a dog. However, unlike any vertebrate, about two-thirds of those neurons reside in their eight arms rather than in their central brain. Each arm can taste, touch, and even make basic decisions independently, allowing the animal to multitask in ways no other creature can match.

In laboratory settings, octopuses have demonstrated remarkable problem-solving abilities. They can navigate complex mazes, unscrew jars from the inside to escape, and even use coconut shells as portable shelters, which represents one of the few documented cases of tool use in invertebrates. At the University of Otago, researchers found that individual octopuses have distinct personalities, with some being bold explorers and others cautious observers.

Their capacity for learning extends beyond solitary tasks. Octopuses can learn by observing other octopuses, a skill once thought exclusive to social mammals. In one experiment, an untrained octopus watched a trained one choose a specific colored ball and then immediately replicated the behavior, despite having never performed the task before.

Perhaps most astonishing is their ability to edit their own genetic code. Unlike nearly all other animals, octopuses extensively edit their RNA, making changes to proteins after genes have been transcribed. Scientists at the Marine Biological Laboratory discovered that this editing is particularly active in brain tissues, suggesting it plays a role in their cognitive flexibility. This process comes at a cost, as it slows down traditional DNA evolution, but the trade-off appears to grant octopuses an extraordinary ability to adapt their nervous systems in real time.

Despite their intelligence, octopuses live remarkably short lives, typically just one to two years. They are solitary creatures that die shortly after reproducing. This brief lifespan means each generation must relearn everything from scratch, with no cultural knowledge passed between parent and offspring.`,
    wordCount: 298,
    questions: [
      {
        question: "Where are most of an octopus's neurons located?",
        options: [
          "In their central brain",
          "In their eyes",
          "In their eight arms",
          "Distributed evenly throughout the body",
        ],
        correctIndex: 2,
      },
      {
        question: "What did researchers at the University of Otago discover about octopuses?",
        options: [
          "They can survive on land for hours",
          "They have distinct individual personalities",
          "They communicate using color patterns",
          "They prefer to live in groups",
        ],
        correctIndex: 1,
      },
      {
        question: "What unique genetic ability do octopuses possess?",
        options: [
          "They can clone themselves",
          "They have extra chromosomes",
          "They extensively edit their own RNA",
          "They pass memories through DNA",
        ],
        correctIndex: 2,
      },
      {
        question: "What is the trade-off of RNA editing in octopuses?",
        options: [
          "It reduces their lifespan",
          "It slows down traditional DNA evolution",
          "It makes them more vulnerable to disease",
          "It limits their physical growth",
        ],
        correctIndex: 1,
      },
      {
        question: "How long do octopuses typically live?",
        options: [
          "Five to ten years",
          "Three to four years",
          "One to two years",
          "Less than six months",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "bridges-engineering",
    title: "The Engineering of Suspension Bridges",
    text: `Suspension bridges are among the most visually striking feats of civil engineering, capable of spanning distances that no other bridge type can match. The basic principle is elegantly simple: a deck is hung from vertical cables that transfer its weight upward to massive main cables, which in turn drape between tall towers and anchor firmly into the ground at each end. The main cables follow a natural curve called a catenary, which distributes forces so efficiently that the structure can support enormous loads with relatively little material.

The construction of a suspension bridge typically begins with the towers, which must be engineered to withstand both the immense downward compression from the cables and lateral forces from wind. Once the towers are in place, workers spin the main cables by pulling thousands of individual wires back and forth between anchorages. On the Golden Gate Bridge, each main cable contains over twenty-seven thousand individual wires, bundled and compressed into a cylinder about three feet in diameter.

Wind is the greatest enemy of a suspension bridge. The 1940 collapse of the Tacoma Narrows Bridge, nicknamed "Galloping Gertie," demonstrated this dramatically. The bridge oscillated violently in moderate winds due to a phenomenon called aeroelastic flutter, ultimately tearing itself apart just four months after opening. The disaster transformed bridge engineering, leading to mandatory wind tunnel testing and aerodynamic deck designs that allow wind to pass through rather than push against the structure.

Modern suspension bridges incorporate sophisticated damping systems to counteract vibrations. The Akashi Kaikyo Bridge in Japan, the longest suspension bridge in the world with a central span of nearly two kilometers, uses pendulum-like tuned mass dampers inside its towers. These devices swing in opposition to wind-induced motion, canceling out potentially destructive oscillations. The bridge was also designed to withstand earthquakes up to magnitude eight and wind speeds exceeding two hundred kilometers per hour.

Materials science continues to push the boundaries of what is possible. Researchers are developing carbon fiber cables that could be five times stronger than steel at a fraction of the weight, potentially enabling spans of five kilometers or more.`,
    wordCount: 316,
    questions: [
      {
        question: "What is the natural curve shape of suspension bridge main cables called?",
        options: ["Parabola", "Catenary", "Hyperbola", "Ellipse"],
        correctIndex: 1,
      },
      {
        question: "What caused the Tacoma Narrows Bridge to collapse?",
        options: [
          "An earthquake",
          "Excessive vehicle load",
          "Aeroelastic flutter from wind",
          "Cable corrosion",
        ],
        correctIndex: 2,
      },
      {
        question:
          "Approximately how many individual wires are in each main cable of the Golden Gate Bridge?",
        options: ["Five thousand", "Twelve thousand", "Twenty-seven thousand", "Fifty thousand"],
        correctIndex: 2,
      },
      {
        question: "What technology does the Akashi Kaikyo Bridge use to counteract vibrations?",
        options: [
          "Hydraulic shock absorbers",
          "Flexible deck joints",
          "Tuned mass dampers",
          "Active cable tensioning",
        ],
        correctIndex: 2,
      },
      {
        question: "What material could enable suspension bridge spans of five kilometers or more?",
        options: [
          "Titanium alloy cables",
          "Carbon fiber cables",
          "Graphene-reinforced steel",
          "Kevlar composite cables",
        ],
        correctIndex: 1,
      },
    ],
  },
];

export function getRandomPassage(): TestPassage {
  return passages[Math.floor(Math.random() * passages.length)] as TestPassage;
}

export function getPercentile(wpm: number): number {
  // Based on research data for adult reading speeds
  // Median ~238 WPM, standard deviation ~75
  if (wpm < 100) return 1;
  if (wpm < 150) return 5;
  if (wpm < 175) return 10;
  if (wpm < 200) return 20;
  if (wpm < 225) return 30;
  if (wpm < 250) return 50;
  if (wpm < 300) return 65;
  if (wpm < 350) return 80;
  if (wpm < 400) return 85;
  if (wpm < 450) return 90;
  if (wpm < 500) return 93;
  if (wpm < 600) return 95;
  if (wpm < 700) return 97;
  if (wpm < 800) return 98;
  return 99;
}

export function getSpeedLabel(wpm: number): string {
  if (wpm < 150) return "Below Average";
  if (wpm < 250) return "Average";
  if (wpm < 350) return "Above Average";
  if (wpm < 500) return "Fast";
  if (wpm < 700) return "Speed Reader";
  return "Exceptional";
}
