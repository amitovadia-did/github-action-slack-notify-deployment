const { context } = require('@actions/github');

function buildSlackAttachments({ status, color, commit, projectName, actor, repoUrl, environment }) {
  const { owner, repo } = context.repo;
  repoUrl = repoUrl || `https://github.com/${owner}/${repo}`;

  return [
    {
      color,
      fields: [
        {
          title: 'Project',
          value: `<${repoUrl} | ${projectName || repo}>`,
          short: false,
        },
        {
          title: 'Environment',
          value: environment,
          short: false,
        },
        {
          title: 'Commit',
          value: tag ? `<${repoUrl}/commit/${commit} | ${commit.substring(0, 7)}>` : 'no tag',
          short: false,
        },
        {
          title: 'Initiated by',
          value: actor || context.actor,
          short: false,
        },
        {
          title: 'Status',
          value: `<https://github.com/${owner}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID} | ${status}>`,
          short: false,
        },
      ],
      footer_icon: 'https://github.githubassets.com/favicon.ico',
      footer: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
      ts: Math.floor(Date.now() / 1000),
    },
  ];
}

module.exports.buildSlackAttachments = buildSlackAttachments;

function formatChannelName(channel) {
  return channel.replace(/[#@]/g, '');
}

module.exports.formatChannelName = formatChannelName;
