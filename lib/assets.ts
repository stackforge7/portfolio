/**
 * Optional GLB models for the Developer Lab. Each scene object falls back to
 * primitive geometry when its file is missing, so these can be added incrementally.
 * Models should be Draco-compressed and use KTX2 textures where possible.
 */
export const labModels = {
  room: "/models/developer-lab.glb",
  desk: "/models/desk.glb",
  server: "/models/server.glb",
  aiTerminal: "/models/ai-terminal.glb",
} as const;

export type LabModelKey = keyof typeof labModels;
