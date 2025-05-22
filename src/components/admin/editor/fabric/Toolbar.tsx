import Image from "next/image";

import styles from "./styles.module.css";
import { circleIcon, pointerIcon, squareIcon, textIcon } from "@public/icons";

interface ToolbarProps {
  setSelectedTool: (tool: "rect" | "circle" | "text" | "group" | null) => void;
  selectedTool: "rect" | "circle" | "text" | "group" | null;
}

export default function Toolbar({
  setSelectedTool,
  selectedTool,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <button
        onClick={() => setSelectedTool("rect")}
        className={selectedTool === "rect" ? styles.active : ""}
      >
        <Image src={squareIcon} alt="square icon" priority />
      </button>
      <button
        onClick={() => setSelectedTool("circle")}
        className={selectedTool === "circle" ? styles.active : ""}
      >
        <Image src={circleIcon} alt="circle icon" priority />
      </button>
      <button
        onClick={() => setSelectedTool("text")}
        className={selectedTool === "text" ? styles.active : ""}
      >
        <Image src={textIcon} alt="text icon" priority />
      </button>
      <button
        onClick={() => setSelectedTool(null)}
        className={selectedTool === null ? styles.active : ""}
      >
        <Image src={pointerIcon} alt="pointer icon" priority />
      </button>
    </div>
  );
}
