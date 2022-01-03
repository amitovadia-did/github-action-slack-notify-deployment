/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 743:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { context } = __nccwpck_require__(82);

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
          value: tag ? `<${repoUrl}/commit/${tag} | ${tag}>` : 'no tag',
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


/***/ }),

/***/ 105:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 82:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 693:
/***/ ((module) => {

module.exports = eval("require")("@slack/web-api");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(105);
const { WebClient } = __nccwpck_require__(693);
const { buildSlackAttachments, formatChannelName } = __nccwpck_require__(743);

(async () => {
  try {
    const channel = core.getInput('channel');
    const status = core.getInput('status');
    const color = core.getInput('color');
    const messageId = core.getInput('message_id');
    const tag = core.getInput('tag');
    const projectName = core.getInput('project_name');
    const actor = core.getInput('actor');
    const message = core.getInput('message');
    const environment = core.getInput('environment');
    const repoUrl = core.getInput('repo_url');
    const token = process.env.SLACK_BOT_TOKEN;
    const slack = new WebClient(token);

    if (!channel && !core.getInput('channel_id')) {
      core.setFailed(`You must provider either a 'channel' or a 'channel_id'.`);
      return;
    }

    const attachments = buildSlackAttachments({
      status,
      color,
      tag,
      projectName,
      actor,
      repoUrl,
      message,
      environment,
    });
    const channelId = core.getInput('channel_id') || (await lookUpChannelId({ slack, channel }));

    if (!channelId) {
      core.setFailed(`Slack channel ${channel} could not be found.`);
      return;
    }

    const apiMethod = Boolean(messageId) ? 'update' : 'postMessage';
    const success = status == 'Success'
    const previewMessage = `${success ? ":white_check_mark:" : ":x:"} Deployment to ${environment} ${success ? "succeeded" : "failed"}.`
    
    const args = {
      channel: channelId,
      blocks: [{"type": "section", "text": {"type": "mrkdwn", "text": previewMessage}}],
      attachments,
    };

    if (messageId) {
      args.ts = messageId;
    }

    const response = await slack.chat[apiMethod](args);

    core.setOutput('message_id', response.ts);
  } catch (error) {
    core.setFailed(error);
  }
})();

async function lookUpChannelId({ slack, channel }) {
  let result;
  const formattedChannel = formatChannelName(channel);

  // Async iteration is similar to a simple for loop.
  // Use only the first two parameters to get an async iterator.
  for await (const page of slack.paginate('conversations.list', { types: 'public_channel, private_channel' })) {
    // You can inspect each page, find your result, and stop the loop with a `break` statement
    const match = page.channels.find(c => c.name === formattedChannel);
    if (match) {
      result = match.id;
      break;
    }
  }

  return result;
}

})();

module.exports = __webpack_exports__;
/******/ })()
;