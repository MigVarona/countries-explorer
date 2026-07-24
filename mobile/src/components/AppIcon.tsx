import { Circle, Line, Path, Svg } from "react-native-svg";

export type AppIconName = "close" | "empty" | "error" | "info" | "search";

interface Props {
  name: AppIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Small, dependency-free icon set matching the app's rounded visual language. */
export function AppIcon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.9,
}: Props) {
  const common = {
    fill: "none",
    stroke: color,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth,
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {name === "search" && (
        <>
          <Circle cx="10.5" cy="10.5" r="6.5" {...common} />
          <Line x1="15.4" y1="15.4" x2="20" y2="20" {...common} />
        </>
      )}
      {name === "close" && (
        <>
          <Line x1="7" y1="7" x2="17" y2="17" {...common} />
          <Line x1="17" y1="7" x2="7" y2="17" {...common} />
        </>
      )}
      {name === "info" && (
        <>
          <Circle cx="12" cy="12" r="9" {...common} />
          <Line x1="12" y1="11" x2="12" y2="17" {...common} />
          <Circle cx="12" cy="7.5" r="0.8" fill={color} />
        </>
      )}
      {name === "empty" && (
        <>
          <Path d="M4 8.5h16v10.5H4z" {...common} />
          <Path d="M4 13h4l1.5 2h5l1.5-2h4M7 8.5l2-3.5h6l2 3.5" {...common} />
        </>
      )}
      {name === "error" && (
        <>
          <Path d="M12 3.5 21 20H3L12 3.5Z" {...common} />
          <Line x1="12" y1="9" x2="12" y2="14" {...common} />
          <Circle cx="12" cy="17" r="0.8" fill={color} />
        </>
      )}
    </Svg>
  );
}
