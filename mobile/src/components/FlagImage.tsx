import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";

import { ensureSvgViewBox } from "../utils/flagSvg";

interface Props {
  svgUri: string;
  pngUri: string;
}

/**
 * Renders the flag as SVG (crisp at any size) and falls back to the PNG if the
 * SVG can't be fetched or parsed. We load the markup ourselves instead of using
 * `SvgUri` so the missing-viewBox case can be repaired before rendering.
 */
export function FlagImage({ svgUri, pngUri }: Props) {
  const [xml, setXml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setXml(null);
    setFailed(false);

    fetch(svgUri)
      .then((response) => {
        if (!response.ok) throw new Error(`status ${response.status}`);
        return response.text();
      })
      .then((markup) => {
        if (active) setXml(ensureSvgViewBox(markup));
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [svgUri]);

  if (failed || !svgUri) {
    return <Image source={{ uri: pngUri }} style={styles.fill} resizeMode="cover" />;
  }
  if (!xml) {
    // Show the PNG while the SVG loads, so the flag never flashes empty.
    return <Image source={{ uri: pngUri }} style={styles.fill} resizeMode="cover" />;
  }
  return <SvgXml xml={xml} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
}

const styles = StyleSheet.create({
  fill: {
    width: "100%",
    height: "100%",
  },
});
