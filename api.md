---
layout: default
title: API Documentation
permalink: /api/
---

<div class="container">
    <style>
        #objects p {
            display: inline-grid;
        }
    </style>
    <p>
        To limit the possibility of abuse without putting too many obstacles up,
        writing to the annotation store is restricted to servers (no CORS) who have
        <a href="https://store.rerum.io">registered themselves</a>. The full plans for RERUM can be found
        <a href="{{ '/future' | relative_url }}">elsewhere on the site</a>.
    </p>
    <p>
        The current public RERUM service is hosted on
        a virtual server at Saint Louis University and is maintained by the Research Computing Group.
        It is written in NodeJS and connects to a cloud hosted MongoDB, with all requests currently over
        HTTP.
    </p>
    <p>
        All read requests (GET) are open by default. To write to RERUM, Follow
        these simple steps:
    </p>
    <div id="objects">
        <h1>RERUM Objects</h1>
        <p>
            The following object types are
            currently encouraged in RERUM, though anything can be accepted:
        </p>
        <h5>Annotations:</h5>
        <p>
            Annotation<code>http://www.w3.org/ns/oa#Annotation</code>
        </p>
        <h5>Manifests:</h5>
        <p>
            Manifest<code>http://iiif.io/api/presentation/3#Manifest</code>
        </p>
        <h5>Canvases:</h5>
        <p>
            Canvas<code>http://iiif.io/api/presentation/3#Canvas</code>
        </p>
        <h5>List Objects:</h5>
        <p>
            Annotation&nbsp;Collection<code>http://www.w3.org/ns/activitystreams#AnnotationCollection</code>
        </p>
        <p>
            Annotation&nbsp;Page<code>http://www.w3.org/ns/activitystreams#AnnotationPage</code>
        </p>
        <p>
            Range<code>https://iiif.io/api/presentation/3#Range</code>
        </p>
        <p>
            Aggregation<code>http://www.openarchives.org/ore/1.0/datamodel#Aggregation</code>
        </p>
        <h5>Plaintext Resources:</h5>
        <p>
            Content&nbsp;Literals<code>http://www.w3.org/2011/content#chars</code>
        </p>
        <h5>Agents:</h5>
        <p>
            Agent<code>http://xmlns.com/foaf/spec/#term_Agent</code>
        </p>
        <p>
            Person<code>http://xmlns.com/foaf/spec/#term_Person</code>
        </p>
        <p>
            Group<code>http://xmlns.com/foaf/spec/#term_Group</code>
        </p>
        <p>
            Organization<code>http://xmlns.com/foaf/spec/#term_Organization</code>
        </p>
        <p>
            Project<code>http://xmlns.com/foaf/spec/#term_Project</code>
        </p>
    </div>
    <h1 id="api">API</h1>
    <section>
        <h2>Version 1</h2> store.rerum.io/v1
        <a href="https://store.rerum.io/v1/API.html">link</a>
        <p>All the following interactions will take place between
            the server running RERUM and the application server. Direct connection from client script
            to the RERUM server is not allowed. Please note that all
            examples are pointing at the development version of the RERUM API, not the
            production version. Only point to the production version once you have
            tested with the development version.</p>

        <p>If you would like to see an example of a web application leveraging the RERUM API visit the
            testbed at https://tinydev.rerum.io or the <a
                href="https://github.com/CenterForDigitalHumanities/TinyNode">GitHub codebase for TinyThings</a>.</p>

        <p>To have simple CRUD ability from client script without using a back end proxy, you can
            use our public test endpoints. Note: Your data will be public and could be removed at any time. This is for
            testing only
            and will not be attributed to you in any way.</p>
        <ul>
            <li>https://tinydev.rerum.io/app/create Uses the rules established by RERUM <a href="#create">create</a></li>
            <li>https://tinydev.rerum.io/app/update Uses the rules established by RERUM PUT <a href="#update">update</a>
            </li>
            <li>https://tinydev.rerum.io/app/delete Uses the rules established by RERUM <a href="#delete">delete</a></li>
            <li>https://tinydev.rerum.io/app/query Uses the rules established by RERUM <a href="#custom-query">Custom
                    Query</a></li>
        </ul>

        <h2 id="get">GET<a class="anchorjs-link " href="#get" aria-label="Anchor" data-anchorjs-icon=""
                style="font: 1em / 1 anchorjs-icons; padding-left: 0.375em;"></a></h2>

        <h3 id="single-object-by-id">Single object by id<a class="anchorjs-link " href="#single-object-by-id"
                aria-label="Anchor" data-anchorjs-icon=""
                style="font: 1em / 1 anchorjs-icons; padding-left: 0.375em;"></a></h3>

        <table>
            <thead>
                <tr>
                    <th scope="col">Patterns</th>
                    <th scope="col">Payloads</th>
                    <th scope="col">Responses</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="language-plaintext highlighter-rouge">/id/_id</code></td>
                    <td><code class="language-plaintext highlighter-rouge">empty</code></td>
                    <td>200 <code class="language-plaintext highlighter-rouge">{JSON}</code></td>
                </tr>
            </tbody>
        </table>

        <ul>
            <li><strong><code class="language-plaintext highlighter-rouge">_id</code></strong>—the id of the object in
                RERUM.</li>
            <li><strong>Response: <code class="language-plaintext highlighter-rouge">{JSON}</code></strong>—The object
                at <code class="language-plaintext highlighter-rouge">_id</code></li>
        </ul>

        <p>Example: https://devstore.rerum.io/v1/id/11111</p>

        <h3 id="history-tree-before-this-version">History tree before this version<a class="anchorjs-link "
                href="#history-tree-before-this-version" aria-label="Anchor" data-anchorjs-icon=""
                style="font: 1em / 1 anchorjs-icons; padding-left: 0.375em;"></a></h3>

        <table>
            <thead>
                <tr>
                    <th scope="col">Patterns</th>
                    <th scope="col">Payloads</th>
                    <th scope="col">Responses</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code class="language-plaintext highlighter-rouge">/history/_id</code></td>
                    <td><code class="language-plaintext highlighter-rouge">empty</code></td>
                    <td>200 <code class="language-plaintext highlighter-rouge">[{JSON}]</code></td>
                </tr>
            </tbody>
        </table>

        <ul>
            <li><strong><code class="language-plaintext highlighter-rouge">_id</code></strong>—the id of the object in
                RERUM.</li>
            <li><strong>Response: <code class="language-plaintext highlighter-rouge">[{JSON}]</code></strong>—an array
                of the resolved objects of all parent history objects</li>
        </ul>

        <p>As objects in RERUM are altered, the previous state is retained in
            a history tree. Requests return ancestors of this object on it's
            branch. The objects in the array are listed in inorder traversal but
            ignoring other branches.</p>

        <p>Example: https://devstore.rerum.io/v1/history/11111</p>

        <!-- Continue with rest of API documentation... truncated for brevity -->
        <!-- The full API documentation would continue here -->
        
    </section>
</div>