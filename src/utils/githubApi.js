const GITHUB_API = 'https://api.github.com';
const OWNER = 'sprakhar11';
const REPO = 'portfolio';
const BRANCH = 'main';

/**
 * Validate a GitHub PAT by calling GET /user
 */
export async function validateToken(token) {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return await res.json();
}

/**
 * Get file content from the repo (returns { content, sha })
 */
export async function getFileContent(token, path) {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const data = await res.json();
  const content = atob(data.content.replace(/\n/g, ''));
  return { content, sha: data.sha };
}

/**
 * Update file content in the repo (creates a commit)
 */
export async function updateFileContent(token, path, content, sha, message) {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message || `Update ${path} via admin panel`,
        content: btoa(unescape(encodeURIComponent(content))),
        sha,
        branch: BRANCH,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update file');
  }
  return await res.json();
}

/**
 * Upload a binary file (e.g. PDF) to the repo
 */
export async function uploadBinaryFile(token, path, base64Content, sha, message) {
  const body = {
    message: message || `Upload ${path} via admin panel`,
    content: base64Content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha; // update existing file

  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to upload file');
  }
  return await res.json();
}

/**
 * Check if a file exists in the repo (returns sha or null)
 */
export async function checkFileExists(token, path) {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha;
}

/**
 * Parse siteConfig.js content into a plain object
 */
export function parseSiteConfig(raw) {
  try {
    const match = raw.match(/export\s+const\s+siteConfig\s*=\s*(\{[\s\S]*?\});/);
    if (!match) return null;
    return new Function(`return ${match[1]}`)();
  } catch {
    return null;
  }
}

/**
 * Serialize siteConfig object back to JS file content
 */
export function serializeSiteConfig(obj) {
  const entries = Object.entries(obj)
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  return `export const siteConfig = {\n${entries}\n};\n`;
}

/**
 * Parse achievements.js content into { achievements, experienceData, educationData }
 */
export function parseAchievementsFile(raw) {
  try {
    const fn = new Function(`
      ${raw.replace(/export\s+const/g, 'const')}
      return { achievements, experienceData, educationData };
    `);
    return fn();
  } catch {
    return null;
  }
}

/**
 * Serialize achievements data back to JS file content
 */
export function serializeAchievementsFile({ achievements, experienceData, educationData }) {
  const stringify = (arr) => JSON.stringify(arr, null, 2)
    .replace(/"(\w+)":/g, '  $1:')   // unquote keys
    .replace(/\[\n\s+{/g, '[\n  {')
    .replace(/}\n\]/g, '}\n]');

  return `export const achievements = ${stringify(achievements)};

export const experienceData = ${stringify(experienceData)};

export const educationData = ${stringify(educationData)};
`;
}

/**
 * Parse skills.js content into a plain JSON array of categories.
 * Each category: { category, icon, items: [{ name, iconLib, iconName, color }] }
 * iconLib is the import source prefix: "Fa" → react-icons/fa, "Si" → react-icons/si, etc.
 * lucide icons use iconLib: "lucide"
 */
export function parseSkillsFile(raw) {
  try {
    // Extract import lines to build a reverse map: iconVarName → { lib, iconName }
    const iconMeta = {};
    const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = importRegex.exec(raw)) !== null) {
      const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
      const from = m[2]; // e.g. 'react-icons/fa', 'lucide-react'
      names.forEach(name => {
        if (from === 'lucide-react') {
          iconMeta[name] = { iconLib: 'lucide', iconName: name };
        } else {
          // e.g. react-icons/fa → "Fa", react-icons/si → "Si"
          const lib = from.split('/').pop(); // "fa", "si", "vsc"
          iconMeta[name] = { iconLib: lib, iconName: name };
        }
      });
    }

    // Strip imports and export, evaluate the array
    const stripped = raw
      .replace(/import\s*\{[^}]+\}\s*from\s*['"][^'"]+['"]\s*;?/g, '')
      .replace(/export\s+const\s+skillsData\s*=\s*/, 'return ')
      .replace(/;[\s]*$/, '');

    // We can't eval icon references, so let's use regex to extract the data
    const categories = [];
    // Match each category object
    const catRegex = /\{\s*category:\s*"([^"]+)",\s*icon:\s*"([^"]+)",\s*items:\s*\[([\s\S]*?)\]\s*\}/g;
    let catMatch;
    while ((catMatch = catRegex.exec(raw)) !== null) {
      const catName = catMatch[1];
      const catIcon = catMatch[2];
      const itemsBlock = catMatch[3];

      const items = [];
      const itemRegex = /\{\s*name:\s*"([^"]+)",\s*Icon:\s*(\w+),\s*color:\s*"([^"]+)"\s*\}/g;
      let itemMatch;
      while ((itemMatch = itemRegex.exec(itemsBlock)) !== null) {
        const name = itemMatch[1];
        const iconVar = itemMatch[2];
        const color = itemMatch[3];
        const meta = iconMeta[iconVar] || { iconLib: 'lucide', iconName: iconVar };
        items.push({ name, iconLib: meta.iconLib, iconName: meta.iconName, color });
      }
      categories.push({ category: catName, icon: catIcon, items });
    }
    return categories;
  } catch {
    return null;
  }
}

/**
 * Serialize skills data back to skills.js with auto-generated imports
 */
export function serializeSkillsFile(data) {
  // Collect all icons grouped by library
  const iconsByLib = {}; // { "fa": Set(["FaJava",...]), "lucide": Set(["Lightbulb",...]) }
  data.forEach(cat => {
    cat.items.forEach(item => {
      const lib = item.iconLib || 'lucide';
      if (!iconsByLib[lib]) iconsByLib[lib] = new Set();
      iconsByLib[lib].add(item.iconName);
    });
  });

  // Generate import lines
  const importLines = [];
  Object.entries(iconsByLib).forEach(([lib, names]) => {
    const sorted = [...names].sort();
    if (lib === 'lucide') {
      importLines.push(`import { ${sorted.join(', ')} } from 'lucide-react';`);
    } else {
      importLines.push(`import { ${sorted.join(', ')} } from 'react-icons/${lib}';`);
    }
  });

  // Generate the data array
  const categoriesStr = data.map(cat => {
    const itemsStr = cat.items.map(item =>
      `      { name: "${item.name}", Icon: ${item.iconName}, color: "${item.color}" }`
    ).join(',\n');
    return `  {\n    category: "${cat.category}",\n    icon: "${cat.icon}",\n    items: [\n${itemsStr}\n    ]\n  }`;
  }).join(',\n');

  return `${importLines.join('\n')}\n\nexport const skillsData = [\n${categoriesStr}\n];\n`;
}
