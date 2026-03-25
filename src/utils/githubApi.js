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
