
Flash app
=========

Frontend
--------

3 params, all but message optional, something like:

``` {.javascript org-language="js"}
{
  message,
  type/status,
  duration
}
```

Optional, if time allows:

-   Animation
-   color by param?

Backend
-------

-   use [bolt](https://github.com/slackapi/bolt)
-   env store screencloud api token
-   respond to slash commands
-   send params to frontend app

Presentation
------------

-   concept -- no configuration, quick ephemeral messages
-   differences from noticeboard
-   use cases -- schools, company announcements, store promotions, etc.
-   video, split into \~5sec clip per slide?
