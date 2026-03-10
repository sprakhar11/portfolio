import { siteConfig } from '../config/siteConfig';

const GITHUB_API_URL = `https://api.github.com/users/${siteConfig.githubUsername}/repos`;

const PROJECT_WHITELIST = [
  'jssaten_invoice_gen', 
  'kavach_backend',
  'Competitive_programming_',
  'incode_backend',
  'onlinecomplier',
  'SIH2022-biochain'
];

const CUSTOM_DESCRIPTIONS = {
  'jssaten_invoice_gen': "An automated invoice generation system built for JSS Academy of Technical Education, streamlining administrative workflows and record-keeping.",
  'kavach_backend': "The robust backend architecture powering Kavach, focusing on secure data transmission, scalable API endpoints, and optimized database queries.",
  'Competitive_programming_': "A comprehensive collection of 1000+ algorithmic problem solutions and data structure implementations across platforms like LeetCode and Codeforces.",
  'incode_backend': "Backend services and API layer developed for InCode, featuring efficient routing, authentication, and core application logic.",
  'onlinecomplier': "A web-based code compilation execution engine capable of safely running user-submitted code snippets across multiple programming languages.",
  'SIH2022-biochain': "National finals winning project for Smart India Hackathon 2022: A blockchain-based supply chain solution for transparent biomedical tracking."
};

export const fetchGithubProjects = async () => {
  try {
    const response = await fetch(`${GITHUB_API_URL}?sort=updated&per_page=100`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const repos = await response.json();
    
    // Filter out forks and archived repos, then sort by stars
    // ADDITIONALLY filter by the whitelist and inject custom descriptions
    return repos
      .filter(repo => !repo.fork && !repo.archived && PROJECT_WHITELIST.includes(repo.name))
      .map(repo => ({
        ...repo,
        description: CUSTOM_DESCRIPTIONS[repo.name] || repo.description
      }))
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    return [];
  }
};
