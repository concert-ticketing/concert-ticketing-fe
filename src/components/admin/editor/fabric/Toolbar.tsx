import Image from "next/image";

import styles from "./styles.module.css";
import { circleIcon, pointerIcon, squareIcon, textIcon } from "@public/icons";

interface ToolbarProps {
  setSelectedTool: (tool: "rect" | "circle" | "text" | null) => void;
}

export default function Toolbar({ setSelectedTool }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <button onClick={() => setSelectedTool("rect")}>
        <Image src={squareIcon} alt="square icon" />
      </button>
      <button onClick={() => setSelectedTool("circle")}>
        <Image src={circleIcon} alt="circle icon" />
      </button>
      <button onClick={() => setSelectedTool("text")}>
        <Image src={textIcon} alt="text icon" />
      </button>
      <button onClick={() => setSelectedTool(null)}>
        <Image src={pointerIcon} alt="pointer icon" />
      </button>
    </div>
  );
}
