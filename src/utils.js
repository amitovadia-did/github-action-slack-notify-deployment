const { context } = require('@actions/github');

function buildSlackAttachments({ status, color, tag, projectName, actor, repoUrl, message, environment }) {
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
          title: 'Tag',
          value: tag ? `<${repoUrl}/commit/${tag} | ${tag.substring(0, 7)}>` : 'no tag',
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
        {
          title: 'Message',
          value: message,
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
