const GITHUB_USERNAME = "Anastasis1175"; 
const REPO_COUNT_LIMIT = 6;
const SHOW_FORKS = false; // Set to true to show repositories that are forks

// API Endpoint: Fetches repos sorted by the last time they were pushed to
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=100`;

// DOM elements
const reposContainer = document.getElementById('repos-container');
const statusMessage = document.getElementById('status-message');

/**
 * Utility to display a status or error message.
 * @param {string} message - The text content to display.
 * @param {string} type - 'loading', 'error', or 'success'.
 */
function showStatus(message, type) {
    reposContainer.innerHTML = '';
    statusMessage.classList.remove('hidden');
    statusMessage.innerHTML = `<p class="text-xl ${type === 'error' ? 'text-red-500' : 'text-gray-500'}">${message}</p>`;
}

/**
 * Creates the HTML structure for a single repository card.
 * @param {Object} repo - The repository object from the GitHub API.
 * @returns {string} The HTML string for the card.
 */
function createRepoCard(repo) {
    // Determine the language color (this is a simplified mapping, you can expand it)
    const languageColor = {
        'JavaScript': 'bg-yellow-500',
        'TypeScript': 'bg-blue-600',
        'Python': 'bg-indigo-500',
        'HTML': 'bg-red-500',
        'CSS': 'bg-purple-500',
        'Vue': 'bg-green-500',
        'React': 'bg-cyan-500',
        'C#': 'bg-emerald-500',
        'Java': 'bg-orange-600'
    }[repo.language] || 'bg-gray-400';

    const languageTag = repo.language
        ? `<span class="px-3 py-1 text-xs font-semibold text-white ${languageColor} rounded-full">${repo.language}</span>`
        : `<span class="px-3 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">--</span>`;

    const updatedDate = new Date(repo.pushed_at).toLocaleDateString();

    return `
        <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col justify-between">
            <div>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-2xl font-bold text-blue-700 hover:text-blue-500 transition duration-150 block mb-2">
                    ${repo.name}
                </a>
                <p class="text-gray-700 mb-4">${repo.description || 'No description provided.'}</p>
            </div>
            <div>
                <div class="flex items-center space-x-4 mb-4">
                    ${languageTag}
                    <span class="text-sm text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.62-.921 1.92 0l2.455 7.555a1 1 0 00.95.69h7.965c.969 0 1.371 1.243.588 1.81l-6.44 4.686a1 1 0 00-.364 1.118l2.456 7.555c.3.921-.755 1.688-1.54 1.118l-6.44-4.686a1 1 0 00-1.175 0l-6.44 4.686c-.784.57-1.84-.197-1.54-1.118l2.456-7.555a1 1 0 00-.364-1.118L.588 12.982c-.783-.567-.381-1.81.588-1.81h7.965a1 1 0 00.95-.69l2.455-7.555z" />
                        </svg>
                        ${repo.stargazers_count}
                    </span>
                    <span class="text-sm text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 100-12 6 6 0 000 12zM9 9a1 1 0 112 0v3a1 1 0 11-2 0V9z" clip-rule="evenodd" />
                        </svg>
                        ${repo.forks_count}
                    </span>
                </div>
                <p class="text-xs text-gray-500">Last updated: ${updatedDate}</p>
            </div>
        </div>
    `;
}

/**
 * Main function to fetch and display the repositories.
 */
async function fetchGitHubRepos() {
    if (GITHUB_USERNAME === "my-github-username") {
        showStatus("Please update the 'GITHUB_USERNAME' variable in the script to your actual GitHub username to see your repos.", 'error');
        return;
    }

    showStatus('Loading repositories...', 'loading');

    try {
        // Fetch data from the GitHub API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.statusText}`);
        }
        const repos = await response.json();
        
        // Process and filter the data
        const filteredRepos = repos
            .filter(repo => SHOW_FORKS || !repo.fork) // Optionally filter out forks
            .slice(0, REPO_COUNT_LIMIT); // Limit to the desired number

        if (filteredRepos.length === 0) {
            showStatus(`Could not find any public repositories for user "${GITHUB_USERNAME}" (or they were all forks).`, 'error');
            return;
        }

        // Render the cards
        const repoCardsHTML = filteredRepos.map(createRepoCard).join('');
        reposContainer.innerHTML = repoCardsHTML;
        statusMessage.classList.add('hidden'); // Hide status message on success

    } catch (error) {
        console.error("Error fetching GitHub repositories:", error);
        showStatus(`Failed to load repositories. Error: ${error.message}`, 'error');
    }
}

// Initialize the fetch process when the page loads
document.addEventListener('DOMContentLoaded', fetchGitHubRepos);
