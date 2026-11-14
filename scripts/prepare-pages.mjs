import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const entryPoint = join("dist", "index.html");
const siteUrl = "https://askitian-coder.github.io/CHEM-HUB";
const previewImage = `${siteUrl}/og-preview.png`;
const routes = [
  {
    path: "/periodic-table",
    title: "Periodic Table of Elements | ChemHub",
    description: "Explore all 118 elements by group and period, search their properties, and open detailed element facts.",
  },
  {
    path: "/converter",
    title: "Chemistry Unit Converter | ChemHub",
    description: "Convert chemistry units for mass, volume, temperature, pressure, energy, and amount of substance.",
  },
  {
    path: "/formulas",
    title: "Chemistry Formula Sheets | ChemHub",
    description: "Search chemistry equations by topic, with examples, units, and notes on when each formula applies.",
  },
  {
    path: "/concept-maps",
    title: "Chemistry Concept Maps | ChemHub",
    description: "Study visual concept maps for redox reactions, electrochemical cells, acids, bases, and salts.",
  },
  {
    path: "/chemistry-facts",
    title: "Chemistry Facts and Discoveries | ChemHub",
    description: "Explore chemistry facts, scientist profiles, discoveries, and explanations of common misconceptions.",
  },
  {
    path: "/study-progress",
    title: "Study Progress | ChemHub",
    description: "Track chemistry topics, study days, and your learning streak.",
    indexable: false,
  },
  {
    path: "/electron-configuration",
    title: "Electron Configuration Tool | ChemHub",
    description: "Find full electron configurations and noble-gas shorthand for elements 1 through 36.",
  },
  {
    path: "/login",
    title: "Sign In | ChemHub",
    description: "Sign in to your ChemHub account.",
    indexable: false,
  },
  {
    path: "/signup",
    title: "Create an Account | ChemHub",
    description: "Create a ChemHub account to track your chemistry study progress.",
    indexable: false,
  },
  {
    path: "/calculators/molar-mass",
    title: "Molar Mass Calculator | ChemHub",
    description: "Calculate the molar mass of a chemical formula with step-by-step working.",
  },
  {
    path: "/calculators/stoichiometry",
    title: "Stoichiometry Solver | ChemHub",
    description: "Balance a reaction and calculate limiting reactants and theoretical yields step by step.",
  },
  {
    path: "/calculators/concentration",
    title: "Concentration Calculator | ChemHub",
    description: "Calculate molarity, mass concentration, and dilution values for chemistry problems.",
  },
  {
    path: "/calculators/mole-converter",
    title: "Mole Converter | ChemHub",
    description: "Convert between grams, moles, and particles using a compound's molar mass.",
  },
  {
    path: "/calculators/equation-balancer",
    title: "Chemical Equation Balancer | ChemHub",
    description: "Balance chemical equations with whole-number coefficients and check atom counts on both sides.",
  },
  {
    path: "/redox",
    title: "Redox Equation Balancer | ChemHub",
    description: "Balance oxidation-reduction equations and check atoms and charge.",
  },
  {
    path: "/acid-base-salts",
    title: "Acids, Bases and Salts | ChemHub",
    description: "Identify acids, bases, and salts from chemical formulas with helpful explanations.",
  },
  {
    path: "/oxidation-numbers",
    title: "Oxidation Number Calculator | ChemHub",
    description: "Find oxidation numbers in compounds and ions using chemistry rules.",
  },
];

const homePage = {
  path: "/",
  title: "ChemHub by Askitian | Interactive Chemistry Study Tools",
  description: "Explore a periodic table, formula sheets, concept maps, chemistry facts, and interactive calculators—all built to make high-school chemistry easier to understand.",
  socialDescription: "Explore chemistry tools, element data, formula sheets, concept maps, and study resources.",
  includeStructuredData: true,
};
const notFoundPage = {
  title: "Page Not Found | ChemHub",
  description: "This ChemHub page could not be found.",
  indexable: false,
};
const template = await readFile(entryPoint, "utf8");
const metadataMarker = "<!-- SEO_METADATA -->";
const metadataEndMarker = "<!-- /SEO_METADATA -->";

const metadataStart = template.indexOf(metadataMarker);
const metadataEnd = template.indexOf(metadataEndMarker, metadataStart);

if (metadataStart < 0 || metadataEnd < metadataStart) {
  throw new Error(`SEO metadata markers are missing or out of order in ${entryPoint}.`);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function pageUrl(route) {
  return `${siteUrl}${route.path === "/" ? "/" : `${route.path}/`}`;
}

function metadataFor(route) {
  const indexable = route.indexable !== false;
  const canonicalUrl = route.path ? pageUrl(route) : null;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const socialDescription = escapeHtml(route.socialDescription || route.description);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    '<meta name="author" content="Askitian" />',
    `<meta name="robots" content="${indexable ? "index,follow" : "noindex,follow"}" />`,
  ];

  if (canonicalUrl) {
    const canonical = escapeHtml(canonicalUrl);
    tags.push(
      `<link rel="canonical" href="${canonical}" />`,
      '<meta property="og:type" content="website" />',
      '<meta property="og:site_name" content="ChemHub" />',
      `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${socialDescription}" />`,
      `<meta property="og:image" content="${previewImage}" />`,
      '<meta property="og:image:width" content="1200" />',
      '<meta property="og:image:height" content="630" />',
      '<meta property="og:image:alt" content="ChemHub chemistry study tools and periodic table" />',
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:url" content="${canonical}" />`,
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${socialDescription}" />`,
      `<meta name="twitter:image" content="${previewImage}" />`,
    );
  }

  if (route.includeStructuredData) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "ChemHub",
      url: pageUrl(route),
      description: route.description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      author: {
        "@type": "Person",
        name: "Askitian",
      },
    };
    const jsonLd = JSON.stringify(schema).replace(/</g, "\\u003c");
    tags.push(`<script type="application/ld+json">${jsonLd}</script>`);
  }

  return `    ${tags.join("\n    ")}`;
}

function renderPage(route) {
  return [
    template.slice(0, metadataStart),
    metadataFor(route),
    template.slice(metadataEnd + metadataEndMarker.length),
  ].join("");
}

await writeFile(entryPoint, renderPage(homePage), "utf8");
await writeFile(join("dist", "404.html"), renderPage(notFoundPage), "utf8");

for (const route of routes) {
  const routeDirectory = join("dist", route.path.slice(1));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(join(routeDirectory, "index.html"), renderPage(route), "utf8");
}
