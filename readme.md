```
██████╗ ███████╗██████╗ ██╗   ██╗███╗   ███╗
██╔══██╗██╔════╝██╔══██╗██║   ██║████╗ ████║
██████╔╝█████╗  ██████╔╝██║   ██║██╔████╔██║
██╔══██╗██╔══╝  ██╔══██╗██║   ██║██║╚██╔╝██║
██║  ██║███████╗██║  ██║╚██████╔╝██║ ╚═╝ ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
```
reconditorium eximium rerum universalium mutabiliumque

RERUM is a product of the Center for Digital Humanities at Saint Louis
        University and is (currently) completely funded and maintained by the
        fine folks in the Researching Computing Group. This site is meant to be used by
        developers and programmers who need a good place to put some data and
        prefer that it be a public place that is not too expensive.
        
Our goal is to provide a simple, out-of-the box connection that reduces
        concerns and costs about data storage and management while making
        interoperability, standards compliance, and attribution automatic.
        
Originally conceived as a "IIIF Store" (iiif.io), RERUM is designed to act as an
open node for annotation and references that need to be made in an interoperable
world of scholarly assertions.

This project is not only access to the existing instance, maintained and hosted by
the Research Computing Group at Saint Louis University, but
also the complete cut list for making your own. However useful this may be for private
projects, applications in development, or because of funding requirements, we
hope that your machine enjoys talking to others and releases its gnats of
knowledge into the Interwebs.

## Core Pieces of RERUM
RERUM's existence as an interactive node on the web requires a software stack, and the pieces of that stack are all open source.
Where you start to interact with RERUM depends on your specific needs and skills.

### RERUM Informational Website <a href='https://github.com/CenterForDigitalHumanities/rerum'> <img height="25" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/></a>
_YOU ARE HERE_.  This is a static web site hosted on GitHub Pages.

### [RERUM Client](https://tiny.rerum.io) <a href='https://github.com/CenterForDigitalHumanities/TinyNode'> <img height="25" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/></a>
Formally known as Tiny Things, this is a client web application that is already set up to make requests to the RERUM API.  This client app has a front end and middleware that takes user input and makes requests to RERUM and processes the responses into the UI.  This is an entire web application with a front end and a back end from which you can make your own front end interfaces that work with RERUM.  You can have your own RERUM API powered web application in 10 minutes or less!

### [RERUM Client Sandbox API](https://store.rerum.io/v1/API.html#tldr-i-just-want-to-use-it) <a href='https://github.com/CenterForDigitalHumanities/TinyNode'> <img height="25" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/></a>
This is actually just the Tiny Things web application.  As a registered RERUM application Tiny Things exposes its internal API as a publicly available API.  This gives applications the chance to use the RERUM API without signing up as an individual registered RERUM application.  This is most useful when you already have a front end and just want to start using the API right away.  Just have your web application's HTTP requests go to the RERUM Sandbox API!

### [RERUM API](https://store.rerum.io/v1/) <a href='https://github.com/CenterForDigitalHumanities/rerum_server_nodejs'> <img height="25" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/></a>
Think of this like a typical bot.  This bot exists on the web so that registered applications can make requests to it.  The bot itself is a web application that exposes API hooks - it waits for requests to do some action (create - delete - update - find), processes those requests, then responds to the web application that initiated those requests about what happened.  Requests and responses follow RESTful best practices.  The bot interacts with a database to store and query for data.  As such, the public RERUM API application can supplement a web application as the entire "back end" and remain uniquely attributed in the Linked Data graph.  
   
