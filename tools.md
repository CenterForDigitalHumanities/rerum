---
layout: default
title: Tools
permalink: /tools/
---

<div class="container">
    <div>
        <label>
            Filter by Tag
            <span style="opacity:.5;">
                Browse our collection of RERUM and community tools
            </span>
        </label>
        <h4>RERUM Components</h4>
        <p>
            These tools are designed to create or manage resources on RERUM or to
            be used as modules away from rerum.io. As they are generated, additional
            resources (Web Components, simple libraries, etc.) will also be included
            here.
        </p>
        <table class="columns twelve" aria-describedby="Rerum tools">
            <style>
                td code {
                    display:inline-block;
                }
            </style>
            <thead>
                <tr  class="row">
                    <th scope="col" class="columns four">Name</th>
                    <th scope="col" class="columns one">Version</th>
                    <th scope="col" class="columns three">Tags</th>
                    <th scope="col" class="columns four">Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row">
                    <td class="columns four">
                        <a href="app/tools/read-manifest/read.html" class="nowrap">Manifest Transcription Reader</a>
                    </td>
                    <td class="columns one">
                        0.4
                    </td>
                    <td class="columns three">
                        <code>viewer</code><code>reader</code><code>manuscripts</code><code>transcription</code><code>iiif</code>
                    </td>
                    <td class="columns four">
                        Simple reading of Manifest annotations, metadata, and images.
                    </td>
                </tr>
                <tr class="row">
                    <td class="columns four">
                        <a href="app/tools/aybee/aybee.html" class="nowrap">Transcription Search Tool</a>
                    </td>
                    <td class="columns one">
                        0.3
                    </td>
                    <td class="columns three">
                        <code>viewer</code><code>reader</code><code>manuscripts</code><code>transcription</code><code>iiif</code>
                    </td>
                    <td class="columns four">
                        View and filter Manifest annotations and images by letter or phrase.
                    </td>
                </tr>
                <tr class="row">
                    <td class="columns four">
                        <a href="app/tools/manifestFromImages.html" class="nowrap">Manifest from Images</a>
                    </td>
                    <td class="columns one">
                        0.6
                    </td>
                    <td class="columns three">
                        <code>creator</code><code>iiif</code><code>images</code><code>manifest</code><code>prezi-2</code>
                    </td>
                    <td class="columns four">
                        Create a new Manifest from a list of image URLs.
                    </td>
                </tr>
                <tr class="row">
                    <td class="columns four">
                        <a href="app/tools/editManifest.html" class="nowrap">Edit a Manifest</a>
                    </td>
                    <td class="columns one">
                        0.2
                    </td>
                    <td class="columns three">
                        <code>archived</code><code>editor</code><code>annotator</code><code>manuscripts</code><code>iiif</code>
                    </td>
                    <td class="columns four">
                        Minor editing of existing Manifests and save changes.
                    </td>
                </tr>
                <tr class="row">
                    <td class="columns four">
                        <a href="app/tools/annotation-tool/proto.html" class="nowrap">Canvas Annotator</a>
                    </td>
                    <td class="columns one">
                        0.1
                    </td>
                    <td class="columns three">
                        <code>student project</code><code>annotator</code><code>canvas</code><code>images</code><code>iiif</code>
                    </td>
                    <td class="columns four">
                        An undergraduate project in OngCDH to create a simple Canvas annotation tool.
                    </td>
                </tr>
                <tr class="row">
                    <td class="columns four">
                        <a href="https://github.com/cubap/TPWN" class="nowrap">TPWN</a>
                    </td>
                    <td class="columns one">
                        0.0.1
                    </td>
                    <td class="columns three">
                        <code>archived</code><code>transcriber</code><code>manuscripts</code><code>manifest</code><code>iiif</code><code>proof-of-concept</code>
                    </td>
                    <td class="columns four">
                        A very early proof-of-concept of a completely stand-alone front-end based on T-PEN for 3.0 planning.
                    </td>
                </tr>
                <tr class="row">
                    <td class="columns four">
                        <a href="app/tools/validate.html" class="nowrap">Validators</a>
                    </td>
                    <td class="columns one">
                        0.5
                    </td>
                    <td class="columns three">
                        <code>IIIF</code><code>JSON</code><code>RERUM</code><code>validation</code><code>prezi-2</code>
                    </td>
                    <td class="columns four">
                        Various validation tools for data types involved with RERUM.
                    </td>
                </tr>
            </tbody>
        </table>
        <h4>Community Tools</h4>
        <p>
            These applications are not part of RERUM, but allow
            for the use, distribution, or viewing of RERUM resources.
        </p>
        <table aria-describedby="Community tools">
            <thead>
            <th scope="col">Name</th>
            <th scope="col">Version</th>
            <th scope="col">Tags</th>
            <th scope="col">Notes</th>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <a href="https://projectmirador.org" class="nowrap">Mirador</a>
                    </td>
                    <td>
                        3.1.1
                    </td>
                    <td>
                        <code>viewer</code><code>annotator</code><code>manuscripts</code><code>iiif</code><code>browser</code>
                    </td>
                    <td>
                        The official viewer for the IIIF standard and sc:Manifest objects.
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href="https://universalviewer.io" class="nowrap">Universal Viewer</a>
                    </td>
                    <td>
                        3.1.1
                    </td>
                    <td>
                        <code>viewer</code><code>manuscripts</code><code>maps</code><code>iiif</code><code>browser</code><code>pdf</code>
                    </td>
                    <td>
                        A flexible viewer designed for viewing anything, including IIIF.
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href="http://concordance.rerum.io" class="nowrap">IIIF Concordance</a>
                    </td>
                    <td>
                        0.2
                    </td>
                    <td>
                        <code>viewer</code><code>reader</code><code>manuscripts</code><code>transcription</code><code>iiif</code>
                    </td>
                    <td>
                        Filter and sort words from a transcription of a IIIF Manifest.
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href="http://t-pen.org" class="nowrap">TPEN</a>
                    </td>
                    <td>
                        2.8
                    </td>
                    <td>
                        <code>transcriber</code><code>annotator</code><code>manuscripts</code><code>iiif</code><code>browser</code>
                    </td>
                    <td>
                        The only line-by-line transcription tool that is OAC and IIIF compliant in an open environment.
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href="https://github.com/CenterForDigitalHumanities/mirador" class="nowrap">Mirador Twig</a>
                    </td>
                    <td>
                        2.x
                    </td>
                    <td>
                        <code>viewer</code><code>manuscripts</code><code>iiif</code>
                    </td>
                    <td>
                        The fork for OngCDH which supports non-IIIF images.
                    </td>
                </tr>
                <tr>
                    <td>
                        <a href="http://reform.rerum.io" class="nowrap">ReForm</a>
                    </td>
                    <td>
                        0.8
                    </td>
                    <td>
                        <code>sequences</code><code>annotator</code><code>manuscripts</code><code>canvas</code><code>iiif</code><code>oac</code><code>metadata</code>
                    </td>
                    <td>
                        A developing project for rearranging or combining manuscripts.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>