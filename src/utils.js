const { context } = require('@actions/github');

function buildSlackAttachments({ status, color, tag, projectName, actor, repoUrl, message }) {
  const { owner, repo, ref } = context.repo;
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
          title: 'Branch',
          value: ref,
          short: false,
        },
        {
          title: 'Tag',
          value: `<${repoUrl}/commit/${tag} | ${tag}>`,
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
        }
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
