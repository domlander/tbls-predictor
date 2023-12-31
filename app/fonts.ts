import { Chivo as Chivo } from "next/font/google";
import { Chivo_Mono as ChivoMono } from "next/font/google";

const chivoMono = ChivoMono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export { chivoMono, chivo };
