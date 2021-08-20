# Contribution Guidelines for Slack Deployment Message

## Issues and Feature Requests

To report bugs or to request new features, you may [create a new issue](https://github.com/maikvortx/github-action-slack-notify-deployment/issues) on the repository. Our team will do its best to respond to your request, but we cannot guarantee a response or a solution.

## Releasing a New Version

Please use [semantic versioning](https://semver.org) when releasing new versions of the action, per [GitHub's recommendations](https://help.github.com/en/github/automating-your-workflow-with-github-actions/about-actions#versioning-your-action).

After a new PR has been merged, you should promote unreleased changes in `CHANGELOG.md` to a new heading containing the new version and today's date.

Then, an engineer should run locally:

```bash
# pull down the latest changes
git checkout master && git pull

# build out the new dist code
yarn build

# commit it (where X.X.X is the new version)
git commit -am 'vX.X.X'

# tag the specific version (where X.X.X is the new version)
git tag -a vX.X.X -m 'vX.X.X'

# update the tag for the major version (where X is the major version)
# FIRST: delete the existing major version tag
git tag -d vX

# NEXT: re-add the major version tag
git tag vX

# FINALLY: remove the old major version tag from remote origin:
git push origin :refs/tags/vX

# push up the commit and the new tags
git push && git push --tags
```

Finally, issue a [new GitHub release](https://github.com/maikvortx/github-action-slack-notify-deployment/releases) for the corresponding version, detailing what has changed.
