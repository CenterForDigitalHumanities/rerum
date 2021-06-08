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
            link: "https://projectmirador.org",
            version: "3.1.1",
            tags: ["viewer","annotator","manuscripts","iiif","browser"],
            notes: "The official viewer for the IIIF standard and sc:Manifest objects."
        },
        {
            label: "Universal Viewer",
            link: "https://universalviewer.io",
            version: "3.1.1",
            tags: ["viewer","manuscripts","maps","iiif","browser","pdf"],
            notes: "A flexible viewer designed for viewing anything, including IIIF."
        },{
            label: "IIIF Concordance",
            link: "http://concordance.rerum.io",
            version: "0.2",
            tags: ["viewer","reader","manuscripts","transcription","iiif"],
            notes: "Filter and sort words from a transcription of a IIIF Manifest."
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
            label: "ReForm",
            link: "http://reform.rerum.io",
            version: "0.8",
            tags: ["sequences","annotator","manuscripts","canvas","iiif","oac","metadata"],
            notes: "A developing project for rearranging or combining manuscripts."
        }
    ],
    rerum:[
        {
            label: "Manifest Transcription Reader",
            link: "#/read",
            version: "0.4",
            tags: ["viewer","reader","manuscripts","transcription","iiif"],
            notes: "Simple reading of Manifest annotations, metadata, and images."
        },{
            label: "Transcription Search Tool",
            link: "#/aybee",
            version: "0.3",
            tags: ["viewer","reader","manuscripts","transcription","iiif"],
            notes: "View and filter Manifest annotations and images by letter or phrase."
        },{
            label: "Manifest from Images",
            link: "#/build",
            version: "0.6",
            tags: ["creator","iiif","images","manifest","prezi-2"],
            notes: "Create a new Manifest from a list of image URLs."
        },{
            label: "Edit a Manifest",
            link: "#/edit",
            version: "0.2",
            tags: ["archived","editor","annotator","manuscripts","iiif"],
            notes: "Minor editing of existing Manifests and save changes."
        },{
            label: "Canvas Annotator",
            link: "tools/annotation-tool/proto.html",
            version: "0.1",
            tags: ["student project","annotator","canvas","images","iiif"],
            notes: "An undergraduate project in OngCDH to create a simple Canvas annotation tool."
        },{
            label: "TPWN",
            link: "https://github.com/cubap/TPWN",
            version: "0.0.1",
            tags: ["archived","transcriber","manuscripts","manifest","iiif","proof-of-concept"],
            notes: "A very early proof-of-concept of a completely stand-alone front-end based on T-PEN for 3.0 planning."
        },
        {
            label: "Validators",
            link: "#/validate",
            version: "0.5",
            tags: ["IIIF","JSON","RERUM","validation","prezi-2"],
            notes: "Various validation tools for data types involved with RERUM."
        }
    ]};
});
