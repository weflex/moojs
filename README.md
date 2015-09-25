# moojs

[LoopBack](https://github.com/strongloop/loopback) is a highly framed and 
flexible HTTP/Restful framework for Node.js platform. So Moojs is a series 
of modules to compute the latest backwards version for a Github-based repository.

Moojs supports the following components:

+ a command-line tool: `moo` to get started with how moojs works for your 
  LoopBack apps.
+ a service app to integrate with your Github repository's webhooks.

## Requirements

+ To run the service and CLI, we recommend using io.js 2.5.0
+ To enable to use moojs service on your public/private repository, you need:
  - moojs is based on git's `refs/tags`, so you have to use tags and 
    semantic version as tag name.
  - moojs needs the ability to comment, label and push status for your repository,
    so you have to set the environment variable `GITHUB_ACCESS_TOKEN` when you
    start the service.
  - moojs needs a field `backwards` in your `package.json`.

## Installation

```
$ npm install moojs -g
```

### Deployment on [Heroku](https://herokuapp.com)

Because of builtin `Procfile` in this project, so you could easily by connecting one
fork of this project to deploy Moojs on [Heroku](https://herokuapp.com).

### Webhooks Setup

You have to setup webhook mannually for now, the steps are below shown:

+ click `settings` on the right bar of your repository.
+ click `Webhooks & services`.
+ click `Add webhook`.
+ type your deployed moojs like `https://your-moojs-server/hook/github/push` at
  "Payload Url" input.
+ make sure "Content type" should be "application/json".
+ jump to "Which events would you like to trigger this webhook?".
+ select the last one, then you will get a list of events.
+ check the "Pull Request" box only
+ click the green button "Add webhook" to submit.
+ working

### How does Moojs service work?

When you successfully deployed moojs and added webhook to your repository, you would
see the following 2 things in your later PR page:

+ if the current `backwards` value is not equal to the computed value, the service would
  comment on this discussion with some descriptive text to tell the condition.
+ if the current `backwards` value is not equal to the computed value, the service would
  add the `compatible` label under this issue/pr. Otherwise, once any commit get this
  `backwards` be equal to the expected value, the `compatible` label would also be 
  removed.

## License

MPL-2.0
