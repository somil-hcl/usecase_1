#!/usr/bin/env node

/**
 * DevOps Integration Helper
 * Facilitates integration between different DevOps platforms
 */

const https = require('https');
const { execSync } = require('child_process');

class DevOpsIntegrator {
  constructor() {
    this.platforms = {
      github: {
        api: 'https://api.github.com',
        token: process.env.GITHUB_TOKEN
      },
      gitlab: {
        api: process.env.GITLAB_URL || 'https://gitlab.com/api/v4',
        token: process.env.GITLAB_TOKEN
      },
      jenkins: {
        url: process.env.JENKINS_URL,
        token: process.env.JENKINS_TOKEN,
        user: process.env.JENKINS_USER
      }
    };
  }

  // GitHub Integration
  async createGitHubWebhook(repo, events, endpoint) {
    const data = JSON.stringify({
      name: 'web',
      active: true,
      events: events,
      config: {
        url: endpoint,
        content_type: 'json',
        secret: process.env.WEBHOOK_SECRET
      }
    });

    return this.makeRequest('POST', `${this.platforms.github.api}/repos/${repo}/hooks`, data);
  }

  // GitLab Integration
  async createGitLabWebhook(projectId, events, endpoint) {
    const data = JSON.stringify({
      url: endpoint,
      push_events: events.includes('push'),
      merge_requests_events: events.includes('merge_request'),
      enable_ssl_verification: true
    });

    return this.makeRequest('POST', `${this.platforms.gitlab.api}/projects/${projectId}/hooks`, data, {
      'PRIVATE-TOKEN': this.platforms.gitlab.token
    });
  }

  // Jenkins Integration
  async triggerJenkinsJob(jobName, parameters = {}) {
    const auth = Buffer.from(`${this.platforms.jenkins.user}:${this.platforms.jenkins.token}`).toString('base64');
    const paramString = Object.entries(parameters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${this.platforms.jenkins.url}/job/${jobName}/buildWithParameters?${paramString}`;

    return this.makeRequest('POST', url, null, {
      'Authorization': `Basic ${auth}`
    });
  }

  // Generic HTTP Request Helper
  async makeRequest(method, url, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DevOps-Integrator/1.0',
          ...headers
        }
      };

      if (this.platforms.github.token && url.includes('github.com')) {
        options.headers['Authorization'] = `token ${this.platforms.github.token}`;
      }

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = body ? JSON.parse(body) : {};
            resolve({ status: res.statusCode, data: response });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(data);
      }

      req.end();
    });
  }

  // Sync Repository Status
  async syncStatus(sourcePlatform, targetPlatform, repo, status) {
    // Implementation for syncing status between platforms
    console.log(`Syncing ${status} status from ${sourcePlatform} to ${targetPlatform} for ${repo}`);
    // Add specific platform sync logic here
  }

  // Validate Integration
  async validateIntegration(platform) {
    try {
      switch (platform) {
        case 'github':
          const ghResponse = await this.makeRequest('GET', `${this.platforms.github.api}/user`);
          return ghResponse.status === 200;

        case 'gitlab':
          const glResponse = await this.makeRequest('GET', `${this.platforms.gitlab.api}/user`, null, {
            'PRIVATE-TOKEN': this.platforms.gitlab.token
          });
          return glResponse.status === 200;

        case 'jenkins':
          const jenkinsResponse = await this.makeRequest('GET', `${this.platforms.jenkins.url}/api/json`, null, {
            'Authorization': `Basic ${Buffer.from(`${this.platforms.jenkins.user}:${this.platforms.jenkins.token}`).toString('base64')}`
          });
          return jenkinsResponse.status === 200;

        default:
          return false;
      }
    } catch (error) {
      console.error(`Integration validation failed for ${platform}:`, error.message);
      return false;
    }
  }
}

// CLI Interface
async function main() {
  const integrator = new DevOpsIntegrator();
  const command = process.argv[2];

  switch (command) {
    case 'validate':
      const platform = process.argv[3];
      const isValid = await integrator.validateIntegration(platform);
      console.log(`${platform} integration: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      break;

    case 'webhook':
      const platform = process.argv[3];
      const repo = process.argv[4];
      const events = process.argv[5].split(',');
      const endpoint = process.argv[6];

      if (platform === 'github') {
        const result = await integrator.createGitHubWebhook(repo, events, endpoint);
        console.log('GitHub webhook created:', result);
      } else if (platform === 'gitlab') {
        const result = await integrator.createGitLabWebhook(repo, events, endpoint);
        console.log('GitLab webhook created:', result);
      }
      break;

    case 'trigger':
      const jobName = process.argv[3];
      const params = {};
      // Parse additional parameters
      for (let i = 4; i < process.argv.length; i += 2) {
        params[process.argv[i]] = process.argv[i + 1];
      }

      const result = await integrator.triggerJenkinsJob(jobName, params);
      console.log('Jenkins job triggered:', result);
      break;

    default:
      console.log('Usage:');
      console.log('  validate <platform>          - Validate platform integration');
      console.log('  webhook <platform> <repo> <events> <endpoint> - Create webhook');
      console.log('  trigger <jobName> [params]   - Trigger Jenkins job');
      console.log('');
      console.log('Platforms: github, gitlab, jenkins');
      console.log('Events: push,merge_request,pull_request (comma-separated)');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DevOpsIntegrator;