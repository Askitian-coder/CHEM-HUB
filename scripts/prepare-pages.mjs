import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const entryPoint = join("dist", "index.html");
const routes = [
  "/periodic-table",
  "/converter",
  "/formulas",
  "/concept-maps",
  "/chemistry-facts",
  "/calculators/molar-mass",
  "/calculators/stoichiometry",
  "/calculators/concentration",
  "/redox",
  "/acid-base-salts",
  "/oxidation-numbers",
];

await copyFile(entryPoint, join("dist", "404.html"));

for (const route of routes) {
  const routeDirectory = join("dist", route.slice(1));
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(entryPoint, join(routeDirectory, "index.html"));
}
