import cooking from "@/assets/images/hobbies/cooking.jpg";
import greatSmokyMountainsPhoto from "@/assets/images/hobbies/great-smoky-mountains.jpg";
import hiking from "@/assets/images/hobbies/hiking.jpg";
import jogging from "@/assets/images/hobbies/jogging.jpg";
import mountRainierPhoto from "@/assets/images/hobbies/mount-rainier.jpg";
import videoGames from "@/assets/images/hobbies/video-games.jpg";
import weightlifting from "@/assets/images/hobbies/weightlifting.jpg";
import studioDesk from "@/assets/images/scene/studio-desk.jpg";
import studioExterior from "@/assets/images/scene/studio-exterior.jpg";
import studioInterior from "@/assets/images/scene/studio-interior.jpg";
import studioReading from "@/assets/images/scene/studio-reading.jpg";
import studioShelf from "@/assets/images/scene/studio-shelf.jpg";
import { education } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import type { ImageAsset, ShelfItem, StudioView, StudioViewId } from "@/types/portfolio";

export const studioExteriorImage: ImageAsset = {
  src: studioExterior,
  alt: "A glass-walled rooftop studio at dusk, its warm interior showing a desk with monitors, a server rack, and a bookshelf, with a city skyline behind it.",
};

export const studioInteriorImage: ImageAsset = {
  src: studioInterior,
  alt: "Inside the studio: a desk with two monitors and a phone stand, a whiteboard with an architecture sketch, a server rack, a bookshelf holding books, running shoes, a diploma, a globe, and a keyboard, and an armchair beside a side table with an open notebook and a clipped stack of pages.",
};

/** National Park Service photos (public domain). */
const greatSmokyMountains: ImageAsset = {
  src: greatSmokyMountainsPhoto,
  alt: "Fog hanging over forested ridges in the Great Smoky Mountains",
};

const mountRainier: ImageAsset = {
  src: mountRainierPhoto,
  alt: "Mount Rainier reflected in a still lake below forested hills",
};

/** Where the "Enter" control sits on the exterior render (the open glass door). */
export const studioDoorAnchor = { x: 63, y: 63 };

/** Screen corners measured on the 2560×1440 desk render. */
export const studioViews: Record<StudioViewId, StudioView> = {
  room: {
    id: "room",
    title: "The studio",
    image: studioInteriorImage,
    parent: null,
    entry: { x: 50, y: 50, zoom: 1 },
    screens: [
      {
        id: "whiteboard",
        quad: [
          { x: 10, y: 5 },
          { x: 42, y: 5 },
          { x: 42, y: 40 },
          { x: 10, y: 40 },
        ],
      },
    ],
    hotspots: [
      {
        id: "whiteboard",
        label: "Experience",
        object: "Whiteboard",
        anchor: { x: 26, y: 36 },
        to: { view: "room", inspector: "experience" },
        focus: { x: 26, y: 24, zoom: 1.55 },
      },
      {
        id: "desk",
        label: "Projects",
        object: "Desk and monitors",
        anchor: { x: 25, y: 47 },
        to: { view: "desk" },
      },
      {
        id: "room-phone",
        label: "Contact",
        object: "Phone on the desk",
        anchor: { x: 9, y: 58 },
        to: { view: "desk", inspector: "contact" },
      },
      {
        id: "server-rack",
        label: "Systems",
        object: "Server rack",
        anchor: { x: 56, y: 44 },
        to: { view: "room", inspector: "systems" },
        focus: { x: 56, y: 44, zoom: 1.45 },
      },
      {
        id: "bookshelf",
        label: "Skills & hobbies",
        object: "Bookshelf",
        anchor: { x: 73, y: 24 },
        to: { view: "shelf" },
      },
      {
        id: "reading-chair",
        label: "Notes",
        object: "Reading chair and side table",
        anchor: { x: 90, y: 71 },
        to: { view: "reading" },
      },
    ],
  },
  desk: {
    id: "desk",
    title: "The desk",
    image: {
      src: studioDesk,
      alt: "The desk up close: two monitors, a laptop, a keyboard and mouse, a desk lamp, and a phone on a wooden stand.",
    },
    parent: "room",
    entry: { x: 27, y: 44, zoom: 2.1 },
    screens: [
      {
        id: "terminal",
        quad: [
          { x: 18.7, y: 19.9 },
          { x: 50.7, y: 19.9 },
          { x: 50.7, y: 52.8 },
          { x: 18.7, y: 52.8 },
        ],
      },
      {
        id: "career",
        quad: [
          { x: 53.7, y: 23.3 },
          { x: 80.7, y: 23.3 },
          { x: 80.7, y: 53.5 },
          { x: 53.7, y: 53.5 },
        ],
      },
      {
        id: "laptop",
        quad: [
          { x: 83.5, y: 44.7 },
          { x: 98.4, y: 46.4 },
          { x: 97.0, y: 68.8 },
          { x: 81.2, y: 64.5 },
        ],
      },
      {
        id: "phone",
        quad: [
          { x: 6.1, y: 50.6 },
          { x: 10.5, y: 50.1 },
          { x: 12.0, y: 66.7 },
          { x: 7.6, y: 67.3 },
        ],
      },
    ],
    hotspots: [
      {
        id: "terminal",
        label: "Terminal",
        object: "Left monitor",
        anchor: { x: 34.7, y: 57 },
        to: { view: "desk", inspector: "about" },
        focus: { x: 34.7, y: 36, zoom: 1.3 },
      },
      {
        id: "career",
        label: "Career",
        object: "Right monitor",
        anchor: { x: 67.2, y: 58.5 },
        to: { view: "desk", inspector: "experience" },
        focus: { x: 67.2, y: 38.5, zoom: 1.3 },
      },
      {
        id: "laptop",
        label: "Projects",
        object: "Laptop",
        anchor: { x: 90, y: 72 },
        to: { view: "desk", inspector: "projects" },
        focus: { x: 90, y: 57, zoom: 1.5 },
      },
      {
        id: "phone",
        label: "Contact",
        object: "Phone on its stand",
        anchor: { x: 9, y: 72 },
        to: { view: "desk", inspector: "contact" },
        focus: { x: 9, y: 58, zoom: 1.5 },
      },
    ],
  },
  shelf: {
    id: "shelf",
    title: "The bookshelf",
    image: {
      src: studioShelf,
      alt: "The bookshelf up close: a row of cloth-bound books, a pair of dumbbells and running shoes, a framed diploma, a desk globe with a game controller, a plant, a keyboard, and a stack of two books.",
    },
    parent: "room",
    entry: { x: 73, y: 33, zoom: 2 },
    screens: [],
    hotspots: [
      {
        id: "books",
        label: "Skills",
        object: "Row of books",
        anchor: { x: 39, y: 17 },
        to: { view: "shelf", inspector: "shelf", param: "book-languages" },
        focus: { x: 39, y: 20, zoom: 1.25 },
      },
      {
        id: "training",
        label: "Training",
        object: "Dumbbells and running shoes",
        anchor: { x: 63, y: 24 },
        to: { view: "shelf", inspector: "shelf", param: "training" },
        focus: { x: 63, y: 27, zoom: 1.25 },
      },
      {
        id: "diploma",
        label: "Education",
        object: "Framed diploma",
        anchor: { x: 38, y: 55 },
        to: { view: "shelf", inspector: "shelf", param: "education" },
        focus: { x: 38, y: 55, zoom: 1.25 },
      },
      {
        id: "hobbies",
        label: "Hobbies",
        object: "Globe and game controller",
        anchor: { x: 56, y: 57 },
        to: { view: "shelf", inspector: "shelf", param: "hobbies" },
        focus: { x: 56, y: 56, zoom: 1.25 },
      },
      {
        id: "favorite-books",
        label: "Favorite books",
        object: "Stack of two books",
        anchor: { x: 64, y: 86 },
        to: { view: "shelf", inspector: "shelf", param: "favorite-ddia" },
        focus: { x: 64, y: 86, zoom: 1.25 },
      },
    ],
  },
  reading: {
    id: "reading",
    title: "The reading corner",
    image: {
      src: studioReading,
      alt: "The reading corner: a leather armchair and a round side table holding an open notebook with a pen and a clipped stack of printed pages, with the city at dusk through the window.",
    },
    parent: "room",
    entry: { x: 88, y: 70, zoom: 2 },
    screens: [],
    hotspots: [
      {
        id: "notebook",
        label: "Notes",
        object: "Open notebook",
        anchor: { x: 46, y: 60 },
        to: { view: "reading", inspector: "journal" },
        focus: { x: 46, y: 62, zoom: 1.3 },
      },
      {
        id: "papers",
        label: "Résumé",
        object: "Printed résumé",
        anchor: { x: 68, y: 66 },
        to: { view: "reading", inspector: "resume" },
        focus: { x: 68, y: 68, zoom: 1.4 },
      },
    ],
  },
};

export const studioViewOrder: StudioViewId[] = ["room", "desk", "shelf", "reading"];

const BOOK_COLORS = [
  "#22304a",
  "#2c4a3a",
  "#2a2a2e",
  "#6b2530",
  "#cfc3a6",
  "#343c4d",
  "#3f5a4a",
  "#5a3a2a",
  "#26384f",
  "#4a4a52",
];

const [degree] = education;

function projectsUsing(skills: string[]) {
  const wanted = new Set(skills.map((skill) => skill.toLowerCase()));
  return projects
    .filter((project) => project.technologies.some((tech) => wanted.has(tech.toLowerCase())))
    .map((project) => ({ slug: project.slug, title: project.title }));
}
export const shelfItems: ShelfItem[] = [
  ...skillCategories.map<ShelfItem>((category, index) => ({
    id: `book-${category.id}`,
    kind: "book",
    title: category.title,
    subtitle: category.context,
    description: category.description,
    color: BOOK_COLORS[index % BOOK_COLORS.length],
    entries: category.skills,
    projects: projectsUsing(category.skills),
  })),
  {
    id: "training",
    kind: "hobby",
    title: "Lifting and running",
    subtitle: "Away from the keyboard",
    description:
      "Most weeks he gets in a couple of lifting sessions and a few easy runs. It clears his head after a long day of debugging.",
    entries: ["Weightlifting", "Jogging"],
    facts: [
      {
        label: "Weightlifting",
        value:
          "Two or three sessions a week built around the squat, bench press, and deadlift, with dumbbell work to finish.",
        image: {
          src: weightlifting,
          alt: "A loaded barbell on a squat rack with bumper plates and dumbbells nearby",
        },
      },
      {
        label: "Jogging",
        value:
          "Easy runs on the Neuse River Greenway, a paved trail that follows the river for 27.5 miles outside Raleigh.",
        image: { src: jogging, alt: "A runner on a paved greenway beside a river" },
      },
    ],
  },
  {
    id: "education",
    kind: "diploma",
    title: `${degree.degree} in ${degree.field}`,
    subtitle: `${degree.institution} · ${degree.startYear}-${degree.endYear}`,
    description:
      degree.story ?? "The computer science foundation behind the work at Microsoft and GitHub.",
    entries: [],
  },
  {
    id: "hobbies",
    kind: "hobby",
    title: "Weekends",
    subtitle: "Off hours",
    description:
      "Weekends usually mean a trail, a market run for something to cook, or a long Factorio session. Bigger trips go to national parks.",
    entries: ["Hiking", "Cooking", "Video games", "Travel"],
    facts: [
      {
        label: "Hiking",
        value: "Umstead State Park is his go-to. It has over 30 miles of wooded trails just outside downtown Raleigh.",
        image: { src: hiking, alt: "Hiking boots on a forest trail leading to a wooden footbridge" },
      },
      {
        label: "Cooking",
        value:
          "Saturday mornings often start at the State Farmers Market, picking up whatever is in season for the week’s meals.",
        image: { src: cooking, alt: "A basket of fresh vegetables next to a cutting board, knife, and skillet" },
      },
      {
        label: "Video games",
        value:
          "Factorio, a game about building and optimizing factories. It scratches the same itch as tuning a slow system.",
        image: { src: videoGames, alt: "A keyboard and controller in front of a monitor showing a factory game" },
      },
      {
        label: "Travel",
        value: "Great Smoky Mountains, a few hours west of home, for long hikes in the fog and fall colors.",
        image: greatSmokyMountains,
      },
      {
        label: "Travel",
        value: "Mount Rainier, a favorite day trip from his years in Redmond working at Microsoft.",
        image: mountRainier,
      },
    ],
  },
  {
    id: "favorite-ddia",
    kind: "book",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    subtitle: "Favorite book",
    description:
      "The “wild boar book”. How databases, replication, partitioning, and stream processing actually work, and the trade-offs between them. Close to the systems he builds every day.",
    color: "#6b2530",
    entries: [],
    facts: [
      {
        label: "Why he likes it",
        value: "It explains the trade-offs behind databases and queues without tying them to any one product.",
      },
      {
        label: "Edition",
        value: "Published by O’Reilly in 2017. A second edition with Chris Riccomini came out in 2026.",
      },
    ],
  },
  {
    id: "favorite-murakami",
    kind: "book",
    title: "What I Talk About When I Talk About Running",
    author: "Haruki Murakami",
    subtitle: "Favorite book",
    description:
      "Murakami kept a journal while training for the New York City Marathon, and it became this memoir about how running and writing feed each other. A good read for anyone who jogs.",
    color: "#a9c0d3",
    entries: [],
    facts: [
      {
        label: "Why he likes it",
        value: "It is a short, honest book about sticking with something hard, one run at a time.",
      },
      {
        label: "Edition",
        value: "Translated from Japanese by Philip Gabriel and published in English in 2008.",
      },
    ],
  },
];
