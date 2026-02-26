const { Octokit } = require('@octokit/rest');

class GithubService {
    constructor(accessToken) {
        this.octokit = new Octokit({ auth: accessToken });
    }

    async initializeRepository(repoName) {
        // Create new public repository
        await this.octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            description: 'My GitHub-powered blogging platform stored contents',
            private: false,
            auto_init: true
        });

        const { data: user } = await this.octokit.rest.users.getAuthenticated();

        // Ensure directories and structural files exist
        await this.createFileInner(
            user.login, repoName, 'config.json',
            JSON.stringify({ platform: "pulsiveblog", built_with: "GitHub API" }, null, 2),
            Buffer.from('init'), // Placeholder content just to create folder if needed, 
            'chore: Initial platform configuration'
        );

        await this.createFileInner(
            user.login, repoName, 'README.md',
            `# ${repoName}\n\nRepository auto-generated as the content store for your blog.`,
            null,
            'chore: Update README'
        );

        await this.createFileInner(user.login, repoName, 'posts/.gitkeep', '', null, 'chore: Keep posts dir');
        await this.createFileInner(user.login, repoName, 'media/.gitkeep', '', null, 'chore: Keep media dir');
    }

    generateSlug(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    async createFileInner(owner, repo, path, rawContent, bufferContent = null, message) {
        const contentBase64 = bufferContent ? bufferContent.toString('base64') : Buffer.from(rawContent).toString('base64');

        try {
            await this.octokit.rest.repos.createOrUpdateFileContents({
                owner,
                repo,
                path,
                message,
                content: contentBase64, // Already base64 here
            });
        } catch (error) {
            console.warn(`File ${path} might already exist or create failed: ${error.message}`);
        }
    }

    async createFile(repoName, path, content, message, isBuffer = false) {
        const { data: user } = await this.octokit.rest.users.getAuthenticated();

        const contentBase64 = isBuffer ? content.toString('base64') : Buffer.from(content).toString('base64');

        await this.octokit.rest.repos.createOrUpdateFileContents({
            owner: user.login,
            repo: repoName,
            path: path,
            message: message,
            content: contentBase64,
        });
    }

    async updateFile(repoName, path, content, message) {
        const { data: user } = await this.octokit.rest.users.getAuthenticated();

        let fileSha;
        try {
            const { data: fileData } = await this.octokit.rest.repos.getContent({
                owner: user.login,
                repo: repoName,
                path: path
            });
            fileSha = fileData.sha;
        } catch (error) {
            throw new Error(`File ${path} not found for updating`);
        }

        await this.octokit.rest.repos.createOrUpdateFileContents({
            owner: user.login,
            repo: repoName,
            path: path,
            message: message,
            content: Buffer.from(content).toString('base64'),
            sha: fileSha
        });
    }

    async deleteFile(repoName, path, message) {
        const { data: user } = await this.octokit.rest.users.getAuthenticated();

        const { data: fileData } = await this.octokit.rest.repos.getContent({
            owner: user.login,
            repo: repoName,
            path: path
        });

        await this.octokit.rest.repos.deleteFile({
            owner: user.login,
            repo: repoName,
            path: path,
            message: message,
            sha: fileData.sha
        });
    }

    async getFileContent(repoName, path) {
        const { data: user } = await this.octokit.rest.users.getAuthenticated();

        const { data: fileData } = await this.octokit.rest.repos.getContent({
            owner: user.login,
            repo: repoName,
            path: path
        });

        if (Array.isArray(fileData)) throw new Error('Path is a directory, not a file');

        return Buffer.from(fileData.content, 'base64').toString('utf8');
    }

    async listFiles(repoName, path) {
        const { data: user } = await this.octokit.rest.users.getAuthenticated();

        try {
            const { data } = await this.octokit.rest.repos.getContent({
                owner: user.login,
                repo: repoName,
                path: path
            });
            return data;
        } catch (error) {
            return [];
        }
    }
}

module.exports = GithubService;
