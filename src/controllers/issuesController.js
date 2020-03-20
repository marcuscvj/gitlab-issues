/**
 * IssuesController.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

const issuesController = {}

issuesController.webhook = (req, res) => {
  const io = require('../app.js')
  const isAllowed = req.headers['x-gitlab-token'] === process.env.SECRET_TOKEN

  if (isAllowed) {
    const issue = {
      username: req.body.user.username,
      author_avatar_url: req.body.user.avatar_url,
      description: req.body.object_attributes.description,
      comment: req.body.object_attributes.description,
      short_desc: req.body.object_attributes.description,
      id: req.body.object_attributes.id,
      title: req.body.object_attributes.title,
      state: req.body.object_attributes.state,
      changes: req.body.changes
    }

    const short = issue.short_desc
    issue.short_desc = short.substring(0, 100) + '...'

    const comment = issue.comment
    issue.comment = comment.substring(0, 100) + '...'

    if (req.body.object_kind === 'note') {
      if (req.body.object_attributes.type === 'DiscussionNote') {
        issue.note_text = 'replied to comment #' + req.body.object_attributes.id
      } else {
        issue.note_text = 'commented on issue #' + req.body.object_attributes.noteable_id
      }
      io.emit('updateIssue', issue)
      io.emit('addNotification', issue)
    } else if (req.body.object_kind === 'issue') {
      if (req.body.object_attributes.action === 'update') {
        issue.note_text = 'updated issue #' + req.body.object_attributes.id
      } else if (req.body.object_attributes.action === 'close') {
        issue.note_text = 'closed issue #' + req.body.object_attributes.id
      } else if (req.body.object_attributes.action === 'reopen') {
        issue.note_text = 'repopened issue #' + req.body.object_attributes.id
      } else {
        issue.note_text = 'created issue #' + req.body.object_attributes.id
        io.emit('newIssue', issue)
      }
      io.emit('updateIssue', issue)
      io.emit('addNotification', issue)
    }
    res.sendStatus(200)
  } else {
    res.sendStatus(403)
  }
  res.end()
}

module.exports = issuesController
