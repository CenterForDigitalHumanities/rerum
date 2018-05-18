/* global angular, rerum */

rerum.config(['$routeProvider',
    function ($routeProvider, $locationProvider, Edition) {
        $routeProvider
            .when('/tools', {
                templateUrl: 'app/tools/tools.html'
            });
    }]);

rerum.controller('toolsController', function ($scope) {
    $scope.tools = {
    community: [
        {
            label: "Mirador",
            link: "https://universalviewer.io",
            version: "2.1",
            tags: ["viewer","annotator","manuscripts","iiif","browser"],
            notes: "The official viewer for the IIIF standard and sc:Manifest objects."
        },
        {
            label: "Universal Viewer",
            link: "http://leafletjs.com/",
            version: "2.0.2",
            tags: ["viewer","manuscripts","maps","iiif","browser","pdf"],
            notes: "A flexible viewer designed for viewing anything, including IIIF."
        },
        {
            label: "TextLab",
            link: "https://mel.hofstra.edu/textlab.html",
            version: "1.2",
            tags: ["annotator","manuscripts","text","browser"],
            notes: "A browser-based text editor and annotation tool."
        },
        {
            label: "Leaflet",
            link: "http://leafletjs.com/",
            version: "1.0.3",
            tags: ["viewer","manuscripts","maps","iiif","browser"],
            notes: "A flexible viewer designed for maps, but compatible with tiled images, such as with IIIF."
        },
        {
            label: "From the Page",
            link: "https://fromthepage.com",
            version: "2",
            tags: ["transcriber","annotator","manuscripts","iiif","tei","omeka","browser"],
            notes: "Premier crowdsourced transcription in a simple interface."
        },
        {
            label: "TPEN",
            link: "http://t-pen.org",
            version: "2.8",
            tags: ["transcriber","annotator","manuscripts","iiif","browser"],
            notes: "The only line-by-line transcription tool that is OAC and IIIF compliant in an open environment."
        },
        {
            label: "Mirador Twig",
            link: "https://github.com/CenterForDigitalHumanities/mirador",
            version: "2.x",
            tags: ["viewer","manuscripts","iiif"],
            notes: "The fork for OngCDH which supports non-IIIF images."
        },
        {
            label: "Broken Books",
            link: "http://brokenbooks.org",
            version: "0.8",
            tags: ["sequences","annotator","manuscripts","canvas","iiif","oac","metadata"],
            notes: "A beta project for reassembling manuscripts that are no longer intact."
        }
    ],
    rerum:[
        {
            label: "Manifest from Images",
            link: "#/build",
            version: "0.6",
            tags: ["creator","iiif","images","manifest"],
            notes: "Create a new Manifest from a list of image URLs."
        },{
            label: "Manifest Transcription Reader",
            link: "#/read",
            version: "0.2",
            tags: ["viewer","reader","manuscripts","transcription","iiif"],
            notes: "Simple reading of Manifest annotations, metadata, and images."
        },{
            label: "Edit a Manifest",
            link: "#/edit",
            version: "0.2",
            tags: ["editor","annotator","manuscripts","iiif"],
            notes: "Minor editing of existing Manifests and save changes."
        },{
            label: "Canvas Annotator",
            link: "app/tools/annotation-tool/proto.html",
            version: "0.1",
            tags: ["annotator","canvas","images","iiif"],
            notes: "An undergraduate project in OngCDH to create a simple Canvas annotation tool."
        },{
            label: "TPWN",
            link: "https://github.com/cubap/TPWN",
            version: "0.0.1",
            tags: ["transcriber","manuscripts","manifest","iiif"],
            notes: "A very early proof-of-concept of a completely stand-alone front-end based on T-PEN for 3.0 planning."
        },
        {
            label: "Validators",
            link: "#/validate",
            version: "0.5",
            tags: ["IIIF","JSON","RERUM","validation"],
            notes: "Various validation tools for data types involved with RERUM."
        }
    ]};
});