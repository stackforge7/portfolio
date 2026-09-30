import type { StaticImageData } from "next/image";

export type Vector3Tuple = [x: number, y: number, z: number];

/** Static imports today; a CMS can supply URL strings with explicit dimensions later. */
export interface ImageAsset {
  src: StaticImageData | string;
  alt: string;
}

/** ISO-like year-month, e.g. "2020-07". */
export type YearMonth = `${number}-${number}`;

export type CompanyName = "GitHub" | "Microsoft" | "Allscripts" | "Sageworks";

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: {
    url: string;
    display: string;
  };
}

export interface ResumeLink {
  /** `null` until a PDF is published; UI renders a disabled control. */
  href: string | null;
  label: string;
}

export interface ProfileStat {
  value: string;
  label: string;
}

export interface FocusArea {
  id: string;
  title: string;
  description: string;
}

export interface Principle {
  id: string;
  title: string;
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  location: string;
  coreStack: string[];
  tagline: string;
  summary: string;
  /** First-person story; the first paragraph is also the studio's opening line. */
  about: string[];
  stats: ProfileStat[];
  focusAreas: FocusArea[];
  /** How he likes to work, in his own framing. */
  principles: Principle[];
  contact: ContactInfo;
  resume: ResumeLink;
  /** Real headshot; `null` until provided, in which case the workspace image is shown. */
  photo: ImageAsset | null;
}

export interface ExperienceHighlight {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  /** Only metrics documented in the resume. */
  metric?: {
    value: string;
    label: string;
  };
}

export interface Experience {
  id: string;
  company: CompanyName;
  role: string;
  location: string;
  start: YearMonth;
  /** `null` means current role. */
  end: YearMonth | null;
  summary: string;
  /** Titles held along the way, oldest first. */
  progression?: { title: string; start: YearMonth }[];
  highlights: ExperienceHighlight[];
  technologies: string[];
}

/** Internships and part-time roles before the full-time career. */
export interface EarlyRole {
  id: string;
  organization: string;
  role: string;
  period: string;
  startYear: number;
  location: string;
  story: string;
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution?: string;
  startYear: number;
  endYear: number;
  story?: string;
}

export type ArchitectureNodeKind =
  | "client"
  | "frontend"
  | "api"
  | "service"
  | "queue"
  | "worker"
  | "cache"
  | "database"
  | "infra"
  | "ai"
  | "event"
  | "observability";

export interface ArchitectureNode {
  id: string;
  label: string;
  detail?: string;
  kind: ArchitectureNodeKind;
  /** Grid cell, zero-based; the diagram has at most 4 columns. */
  col: number;
  row: number;
}

/** request: synchronous call · event: async message or trigger · data: read/write to a store. */
export type ArchitectureFlow = "request" | "event" | "data";

export interface ArchitectureEdge {
  from: string;
  to: string;
  flow: ArchitectureFlow;
  /** Keep short: labels sit in the gaps between nodes. */
  label?: string;
  /** Traffic moves both ways, e.g. reads and writes. */
  both?: boolean;
  /**
   * For nodes in different rows and columns: "vh" leaves vertically and enters from the side (default),
   * "hv" leaves from the side and enters vertically. The cells the pipe crosses must be empty.
   */
  route?: "vh" | "hv";
}

export interface ArchitectureGroup {
  label: string;
  nodes: string[];
}

export interface Architecture {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  /** Boundaries drawn around related nodes; their bounding boxes must not overlap other nodes. */
  groups?: ArchitectureGroup[];
}

export interface ProjectMetric {
  value: string;
  label: string;
}

/** A screenshot of a public, official page related to the project. */
export interface ProjectScreenshot extends ImageAsset {
  caption: string;
  source: { label: string; url: string };
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  company: CompanyName;
  /** Illustrated hero; always the first image in the gallery. */
  cover: ImageAsset;
  /** Real screenshots shown after the cover. */
  gallery: ProjectScreenshot[];
  summary: string;
  /** Overview paragraph for the case study. */
  description: string;
  problem: string;
  role: string;
  /** One-line engineering challenge used on cards. */
  challenge: string;
  challenges: string[];
  solution: string;
  technologies: string[];
  impact: string[];
  metrics: ProjectMetric[];
  architecture: Architecture;
  decisions: string[];
  featured: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  /** Where and when he used these, e.g. "React at GitHub · Angular at Microsoft". */
  context: string;
  description: string;
  /** Names match `Project.technologies` so books can link to the projects that used them. */
  skills: string[];
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface ResumeRole {
  id: string;
  company: CompanyName;
  title: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface ResumeSkillLine {
  label: string;
  items: string;
}

/** Verbatim resume content, rendered as a printable document. */
export interface Resume {
  headline: string;
  summary: string;
  roles: ResumeRole[];
  skills: ResumeSkillLine[];
  education: {
    institution: string;
    degree: string;
    period: string;
  };
}

/** Percent coordinates relative to the 16:9 scene image. */
export interface ScenePoint {
  x: number;
  y: number;
}

export type SceneFocus = ScenePoint & { zoom: number };

/** Four corners of a surface in the image: top-left, top-right, bottom-right, bottom-left. */
export type SceneQuad = [ScenePoint, ScenePoint, ScenePoint, ScenePoint];

export type StudioViewId = "room" | "desk" | "shelf" | "reading";

export type StudioInspectorId =
  | "experience"
  | "systems"
  | "about"
  | "projects"
  | "contact"
  | "shelf"
  | "journal"
  | "resume";

/** A location inside the studio; serialized into the URL hash. */
export interface StudioRoute {
  view: StudioViewId;
  inspector: StudioInspectorId | null;
  param: string | null;
}

export interface StudioHotspot {
  id: string;
  /** Pill label shown in the scene. */
  label: string;
  /** The physical object the hotspot sits on, used for accessible names. */
  object: string;
  anchor: ScenePoint;
  /** Where the hotspot leads. */
  to: Pick<StudioRoute, "view"> & Partial<Omit<StudioRoute, "view">>;
  /** Camera framing while this hotspot's inspector is open. */
  focus?: SceneFocus;
}

export type StudioScreenId = "terminal" | "career" | "laptop" | "phone" | "whiteboard";

export interface StudioScreen {
  id: StudioScreenId;
  quad: SceneQuad;
}

export interface StudioView {
  id: StudioViewId;
  /** Announced when the view opens, e.g. "The desk". */
  title: string;
  image: ImageAsset;
  parent: StudioViewId | null;
  /** Point in the parent view the camera dollies toward before this view fades in. */
  entry: SceneFocus;
  hotspots: StudioHotspot[];
  screens: StudioScreen[];
}

export type ShelfItemKind = "book" | "diploma" | "hobby";

export interface ShelfItem {
  id: string;
  kind: ShelfItemKind;
  title: string;
  subtitle: string;
  description: string;
  /** Book cloth color. */
  color?: string;
  /** Set for books he reads, as opposed to skill books. */
  author?: string;
  entries: string[];
  /** Specific details, optionally with a photo of the activity or place. */
  facts?: { label: string; value: string; image?: ImageAsset }[];
  /** Projects where these skills were used. */
  projects?: { slug: string; title: string }[];
}

export type HotspotType =
  | "platform"
  | "ai"
  | "cloud"
  | "frontend"
  | "backend"
  | "career";

export interface Hotspot {
  id: string;
  label: string;
  /** Short hover tooltip, e.g. "AI SYSTEMS". */
  tooltip: string;
  type: HotspotType;
  /** Object placement inside the lab scene. */
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  /** Point the camera looks at when the hotspot is focused. */
  target: Vector3Tuple;
  /** Camera position used when focusing this hotspot. */
  cameraPosition: Vector3Tuple;
  title: string;
  summary: string;
  topics: string[];
  related: {
    projects: string[];
    experience: string[];
  };
}
