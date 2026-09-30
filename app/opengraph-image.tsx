import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = "William Glas, Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const background = await readFile(join(process.cwd(), "assets/images/og-background.jpg"));
  const backgroundSrc = `data:image/jpeg;base64,${background.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#08090c" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img
          src={backgroundSrc}
          alt=""
          width={1200}
          height={675}
          style={{ position: "absolute", top: -22, left: 120, width: 1200, height: 675, opacity: 0.85 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, #08090c 0%, rgba(8,9,12,0.92) 38%, rgba(8,9,12,0.2) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "72px 80px",
            color: "#f5f7fa",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#4cc9f0" }}>DEVELOPER LAB</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
            <div style={{ marginTop: 24, fontSize: 38 }}>{profile.title}</div>
            <div style={{ marginTop: 14, fontSize: 26, color: "#9ba3af" }}>{profile.coreStack.join("  •  ")}</div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#9ba3af" }}>
            Developer platforms · AI systems · Distributed systems · Cloud infrastructure
          </div>
        </div>
      </div>
    ),
    size,
  );
}
