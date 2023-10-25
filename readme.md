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
        fine folks in the Researching Computing Group. RERUM is meant to be used as 
        as a cost friendly place to encode, store, and present data
        in a public place that is not too expensive.
        
Our goal is to provide a simple, out-of-the box connection that reduces
        concerns and costs about data storage and management while making
        interoperability, standards compliance, and attribution automatic.
        
Originally conceived as a "IIIF Store" (iiif.io), RERUM is designed to act as an
        open node for annotation and references that need to be made in an interoperable
        world of scholarly assertions.

Through this site you can gain access to the existing public instance or even
        get the knowledge and tools to create and host your own instance. However useful this may be for private
        projects, applications in development, or because of funding requirements, we
        hope that your machine enjoys talking to others and releases its gnats of
        knowledge into the Interwebs.

## Core Pieces of RERUM
RERUM's existence as an interactive node on the web requires a software stack, and the pieces of that stack are all open source.
Where and how you start to interact with RERUM depends on your specific needs and skills.

### [RERUM Informational Website](https://rerum.io) <a href='https://github.com/CenterForDigitalHumanities/rerum'>
_YOU ARE HERE_ <img height="15" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/>.  This is a static web site hosted on GitHub Pages for typical web users looking for information and links.

### [RERUM Client](https://tiny.rerum.io) <a href='https://github.com/CenterForDigitalHumanities/TinyNode'> <img height="25" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/></a>
Formally known as TinyThings, this is a NodeJS client web application that is already set up to use the RERUM API.  This client app takes user input and makes requests to the RERUM API then processes the responses back into the UI.  It is of interest to software developers looking to build front end interfaces who do not want to set up their own back end.

### [RERUM Client Sandbox API](https://store.rerum.io/v1/API.html#tldr-i-just-want-to-use-it) <a href='https://github.com/CenterForDigitalHumanities/TinyNode'> <img height="25" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/></a>
As a registered RERUM application, TinyThings exposes its internal API as a publicly available API.  This gives applications the chance to use the RERUM API without signing up as an individual registered RERUM application.  This is most useful to a software developer when they already have a front end and just want to start using the RERUM API right away.  It is primed for "proof of concept" development stages.

### [RERUM API](https://store.rerum.io/v1/) <a href='https://github.com/CenterForDigitalHumanities/rerum_server_nodejs'> <img height="25" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/></a>
Think of this like a typical bot.  The bot itself is a NodeJS Express web application that exposes API hooks - it waits for requests to do some action (create - delete - update - find), processes those requests, then responds to the web application that initiated those requests about what happened.  Back end software developers utilize the programmatic RERUM API for data transfer and storage.
   
## 🌟👍 Contributors 👍🌟
Click on the GitHub icon to go to the code repositories of the RERUM cores listed above.
Trying to make a change to this website?  We appreciate it!  Head to the [Contributors Guide](CONTRIBUTING.md)!
