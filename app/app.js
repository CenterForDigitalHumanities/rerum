var rerum = angular.module('rerum', ['ui.bootstrap', 'ngRoute', 'ngAnimate','ngSanitize', 'angular-loading-bar', 'cfp.hotkeys', 'utils']);
rerum.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
//            $locationProvider.html5Mode(true);
            $routeProvider
                .when('/welcome', {
                    templateUrl: 'app/welcome.html'
                })
                .when('/register', {
                    templateUrl: 'app/registration/registration.html'
                })
                .when('/api', {
                    templateUrl: 'app/api/api.html'
                })
                .when('/future', {
                    templateUrl: 'app/future/future.html'
                })
                .when('/annotation', {
                    templateUrl: 'app/annotations/annotations.html'
                })
                .when('/objects', {
                    templateUrl: 'app/objects/objects.html'
                })
                .when('/about', {
                    templateUrl: 'app/about/about.html'
                })
                .when('/connect', {
                    templateUrl : 'app/registration/connecting.html'
                })
                .when('/cases', {
                    templateUrl : 'app/cases/cases.html'
                })
                .otherwise(({redirectTo: '/welcome'}));
    }]);
rerum.value('Backend_ip', '165.134.105.29'); //Store this like a global variables for use throughout, that way we only have to change it here.
rerum.value('API_Path', 'http://165.134.105.29/annotationstore/anno/'); //Store this like a global variables for use throughout, that way we only have to change it here.
rerum.value('API_Key', 'som3_frigg1n_k3y');
rerum.value('Terminal', false); // set Apple IIe style
rerum.value('config', {
    buffer: .05, // percent of canvas height
    closeCrop: false, // show just enough around a slice to view
    currentSequenceIndex: 0,
    currentCanvasIndex: 0
});
rerum.value('Manifest', {});
rerum.controller('mainController', function ($scope, $location, hotkeys, Terminal) {
    // welcome functions
    hotkeys.add({
        combo: 'home',
        description: 'RERUM home',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
            $location.path('/welcome');
        }
    });
    $scope.terminal = Terminal;
    $scope.hotkeys = hotkeys;
    function tabTo (step) {
//        var elem = document.getElementsByClassName('focused')[0];
        var elem = event.target || window;
        if (elem.type === "number") {
            return elem;
        }
        var list = [].filter.call(document.querySelectorAll('input, button, select, textarea, a[href]'), function (item) {
//            angular.element(item).removeClass('focused');
            return item.tabIndex >= "0";
        });
        var index = list.indexOf(elem);
        if (index + step < 0) {
            elem = list.pop();
        } else {
            do {
                elem = list[index + step] || list[0];
                index += step;
            } while (angular.element(elem).hasClass('ng-hide'))
        }
//        angular.element(elem).addClass('focused');
        return elem;
    };
    /**
     * Convert strings like cmd into symbols like ⌘
     * @param  {String} combo Key combination, e.g. 'mod+f'
     * @return {String}       The key combination with symbols
     */
    $scope.symbolize = function (combo) {
        var map = {
            command: '⌘',
            shift: '⇧',
            left: '←',
            right: '→',
            up: '↑',
            down: '↓',
            'return': '↩',
            backspace: '⌫'
        };
        for (var i = 0; i < combo.length; i++) {
            // try to resolve command / ctrl based on OS:
            if (combo[i] === 'mod') {
                if ($window.navigator && $window.navigator.platform.indexOf('Mac') >= 0) {
                    combo[i] = 'command';
                } else {
                    combo[i] = 'ctrl';
                }
            }
            combo[i] = map[combo[i]] || combo[i];
        }
        return combo.join(' + ');
    };
    hotkeys.add({
        combo: 'T',
        description: 'Term',
        allowIn: [],
        callback: function () {
            $scope.terminal = !$scope.terminal;
        }
    });
    hotkeys.add({
        combo: 'down',
        description: 'Next',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
            tabTo(1).focus();
        }
    });
    hotkeys.add({
        combo: 'up',
        description: 'Previous',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function () {
            tabTo(-1).focus();
        }
    });
    $scope.tzOffset = (function(){
        var now = new Date();
                    var tz = -now.getTimezoneOffset()/60;
                    return (tz);
    })();
});
rerum.controller('welcomeController', function ($scope, $location, hotkeys) {
    hotkeys.bindTo($scope)
        .add({
            combo: '1',
            description: 'API',
            callback: function () {
                $location.path('/api');
            }
        })
        .add({
            combo: '2',
            description: 'Register a server',
            callback: function () {
                $location.path('/register');
            }
        })
        .add({
            combo: '3',
            description: 'Discover RERUM objects',
            callback: function () {
                $location.path('/objects');
            }
        })
        .add({
            combo: '4',
            description: 'Tools',
            callback: function () {
                $location.path('/tools');
            }
        })
        .add({
            combo: '5',
            description: 'About us / Contact',
            callback: function () {
                $location.path('/about');
            }
        });
});
rerum.directive('scrollto',
    function ($anchorScroll, $location) {
        return {
            link: function (scope, element, attrs) {
                element.on("click",function (e) {
                    e.preventDefault();
                    $location.hash(attrs["scrollto"]);
                    $anchorScroll();
                });
            }
        };
    });


/*
 * Mock Data
 */

var dummyDumpURLs = "http://digital.vatlib.it/con/thumb/Cappon.52/0001_al_piatto.anteriore,http://digital.vatlib.it/con/thumb/Cappon.52/0002_ba_risguardia.anteriore,http://digital.vatlib.it/con/thumb/Cappon.52/0003_cy_0001r,http://digital.vatlib.it/con/thumb/Cappon.52/0004_cy_0001v,http://digital.vatlib.it/con/thumb/Cappon.52/0005_cy_0002r,http://digital.vatlib.it/con/thumb/Cappon.52/0006_cy_0002v,http://digital.vatlib.it/con/thumb/Cappon.52/0007_fa_0001r,http://digital.vatlib.it/con/thumb/Cappon.52/0008_fa_0001v,http://digital.vatlib.it/con/thumb/Cappon.52/0009_fa_0002r,http://digital.vatlib.it/con/thumb/Cappon.52/0010_fa_0002v,http://digital.vatlib.it/con/thumb/Cappon.52/0011_fa_0003r,http://digital.vatlib.it/con/thumb/Cappon.52/0012_fa_0003v,http://digital.vatlib.it/con/thumb/Cappon.52/0013_fa_0004r,http://digital.vatlib.it/con/thumb/Cappon.52/0014_fa_0004v,http://digital.vatlib.it/con/thumb/Cappon.52/0015_fa_0006r.%5B01.xy.0002%5D,http://digital.vatlib.it/con/thumb/Cappon.52/0016_fa_0006v,http://digital.vatlib.it/con/thumb/Cappon.52/0017_fa_0007r,http://digital.vatlib.it/con/thumb/Cappon.52/0018_fa_0007v,http://digital.vatlib.it/con/thumb/Cappon.52/0019_fa_0008r,http://digital.vatlib.it/con/thumb/Cappon.52/0020_fa_0008v,http://digital.vatlib.it/con/thumb/Cappon.52/0021_fa_0009r,http://digital.vatlib.it/con/thumb/Cappon.52/0022_fa_0009v,http://digital.vatlib.it/con/thumb/Cappon.52/0023_fa_0010r,http://digital.vatlib.it/con/thumb/Cappon.52/0024_fa_0010v,http://digital.vatlib.it/con/thumb/Cappon.52/0025_fa_0011r,http://digital.vatlib.it/con/thumb/Cappon.52/0026_fa_0011v,http://digital.vatlib.it/con/thumb/Cappon.52/0027_fa_0012r,http://digital.vatlib.it/con/thumb/Cappon.52/0028_fa_0012v,http://digital.vatlib.it/con/thumb/Cappon.52/0029_fa_0013r,http://digital.vatlib.it/con/thumb/Cappon.52/0030_fa_0013v,http://digital.vatlib.it/con/thumb/Cappon.52/0031_fa_0014r,http://digital.vatlib.it/con/thumb/Cappon.52/0032_fa_0014v,http://digital.vatlib.it/con/thumb/Cappon.52/0033_fa_0015r,http://digital.vatlib.it/con/thumb/Cappon.52/0034_fa_0015v,http://digital.vatlib.it/con/thumb/Cappon.52/0035_fa_0016r,http://digital.vatlib.it/con/thumb/Cappon.52/0036_fa_0016v,http://digital.vatlib.it/con/thumb/Cappon.52/0037_fa_0017r,http://digital.vatlib.it/con/thumb/Cappon.52/0038_fa_0017v,http://digital.vatlib.it/con/thumb/Cappon.52/0039_fa_0018r,http://digital.vatlib.it/con/thumb/Cappon.52/0040_fa_0018v,http://digital.vatlib.it/con/thumb/Cappon.52/0041_fa_0019r,http://digital.vatlib.it/con/thumb/Cappon.52/0042_fa_0019v,http://digital.vatlib.it/con/thumb/Cappon.52/0043_fa_0020r,http://digital.vatlib.it/con/thumb/Cappon.52/0044_fa_0020v,http://digital.vatlib.it/con/thumb/Cappon.52/0045_fa_0021r,http://digital.vatlib.it/con/thumb/Cappon.52/0046_fa_0021v,http://digital.vatlib.it/con/thumb/Cappon.52/0047_fa_0022r,http://digital.vatlib.it/con/thumb/Cappon.52/0048_fa_0022v,http://digital.vatlib.it/con/thumb/Cappon.52/0049_fa_0023r,http://digital.vatlib.it/con/thumb/Cappon.52/0050_fa_0023v,http://digital.vatlib.it/con/thumb/Cappon.52/0051_fa_0024r,http://digital.vatlib.it/con/thumb/Cappon.52/0052_fa_0024v,http://digital.vatlib.it/con/thumb/Cappon.52/0053_fa_0025r,http://digital.vatlib.it/con/thumb/Cappon.52/0054_fa_0025v,http://digital.vatlib.it/con/thumb/Cappon.52/0055_fa_0026r,http://digital.vatlib.it/con/thumb/Cappon.52/0056_fa_0026v,http://digital.vatlib.it/con/thumb/Cappon.52/0057_fa_0027r,http://digital.vatlib.it/con/thumb/Cappon.52/0058_fa_0027v,http://digital.vatlib.it/con/thumb/Cappon.52/0059_fa_0028r,http://digital.vatlib.it/con/thumb/Cappon.52/0060_fa_0028v,http://digital.vatlib.it/con/thumb/Cappon.52/0061_fa_0029r,http://digital.vatlib.it/con/thumb/Cappon.52/0062_fa_0029v,http://digital.vatlib.it/con/thumb/Cappon.52/0063_fa_0030r,http://digital.vatlib.it/con/thumb/Cappon.52/0064_fa_0030v,http://digital.vatlib.it/con/thumb/Cappon.52/0065_fa_0031r,http://digital.vatlib.it/con/thumb/Cappon.52/0066_fa_0031v,http://digital.vatlib.it/con/thumb/Cappon.52/0067_fa_0032r,http://digital.vatlib.it/con/thumb/Cappon.52/0068_fa_0032v,http://digital.vatlib.it/con/thumb/Cappon.52/0069_fa_0033r,http://digital.vatlib.it/con/thumb/Cappon.52/0070_fa_0033v,http://digital.vatlib.it/con/thumb/Cappon.52/0071_fa_0034r,http://digital.vatlib.it/con/thumb/Cappon.52/0072_fa_0034v,http://digital.vatlib.it/con/thumb/Cappon.52/0073_fa_0035r,http://digital.vatlib.it/con/thumb/Cappon.52/0074_fa_0035v,http://digital.vatlib.it/con/thumb/Cappon.52/0075_fa_0036r,http://digital.vatlib.it/con/thumb/Cappon.52/0076_fa_0036v,http://digital.vatlib.it/con/thumb/Cappon.52/0077_fa_0037r,http://digital.vatlib.it/con/thumb/Cappon.52/0078_fa_0037v,http://digital.vatlib.it/con/thumb/Cappon.52/0079_fa_0038r,http://digital.vatlib.it/con/thumb/Cappon.52/0080_fa_0038v,http://digital.vatlib.it/con/thumb/Cappon.52/0081_fa_0039r,http://digital.vatlib.it/con/thumb/Cappon.52/0082_fa_0039v,http://digital.vatlib.it/con/thumb/Cappon.52/0083_fa_0040r,http://digital.vatlib.it/con/thumb/Cappon.52/0084_fa_0040v,http://digital.vatlib.it/con/thumb/Cappon.52/0085_fa_0041r,http://digital.vatlib.it/con/thumb/Cappon.52/0086_fa_0041v,http://digital.vatlib.it/con/thumb/Cappon.52/0087_fa_0042r,http://digital.vatlib.it/con/thumb/Cappon.52/0088_fa_0042v,http://digital.vatlib.it/con/thumb/Cappon.52/0089_fa_0043r,http://digital.vatlib.it/con/thumb/Cappon.52/0090_fa_0043v,http://digital.vatlib.it/con/thumb/Cappon.52/0091_fa_0044r,http://digital.vatlib.it/con/thumb/Cappon.52/0092_fa_0044v,http://digital.vatlib.it/con/thumb/Cappon.52/0093_fa_0045r,http://digital.vatlib.it/con/thumb/Cappon.52/0094_fa_0045v,http://digital.vatlib.it/con/thumb/Cappon.52/0095_fa_0046r,http://digital.vatlib.it/con/thumb/Cappon.52/0096_fa_0046v,http://digital.vatlib.it/con/thumb/Cappon.52/0097_fa_0047r,http://digital.vatlib.it/con/thumb/Cappon.52/0098_fa_0047v,http://digital.vatlib.it/con/thumb/Cappon.52/0099_fa_0048r,http://digital.vatlib.it/con/thumb/Cappon.52/0100_fa_0048v,http://digital.vatlib.it/con/thumb/Cappon.52/0101_fa_0049r,http://digital.vatlib.it/con/thumb/Cappon.52/0102_fa_0049v,http://digital.vatlib.it/con/thumb/Cappon.52/0103_fa_0050r,http://digital.vatlib.it/con/thumb/Cappon.52/0104_fa_0050v,http://digital.vatlib.it/con/thumb/Cappon.52/0105_fa_0051r,http://digital.vatlib.it/con/thumb/Cappon.52/0106_fa_0051v,http://digital.vatlib.it/con/thumb/Cappon.52/0107_fa_0052r,http://digital.vatlib.it/con/thumb/Cappon.52/0108_fa_0052v,http://digital.vatlib.it/con/thumb/Cappon.52/0109_fa_0053r,http://digital.vatlib.it/con/thumb/Cappon.52/0110_fa_0053v,http://digital.vatlib.it/con/thumb/Cappon.52/0111_fa_0054r,http://digital.vatlib.it/con/thumb/Cappon.52/0112_fa_0054v,http://digital.vatlib.it/con/thumb/Cappon.52/0113_fa_0055r,http://digital.vatlib.it/con/thumb/Cappon.52/0114_fa_0055v,http://digital.vatlib.it/con/thumb/Cappon.52/0115_fa_0056r,http://digital.vatlib.it/con/thumb/Cappon.52/0116_fa_0056v,http://digital.vatlib.it/con/thumb/Cappon.52/0117_fa_0057r,http://digital.vatlib.it/con/thumb/Cappon.52/0118_fa_0057v,http://digital.vatlib.it/con/thumb/Cappon.52/0119_fa_0058r,http://digital.vatlib.it/con/thumb/Cappon.52/0120_fa_0058v,http://digital.vatlib.it/con/thumb/Cappon.52/0121_fa_0059r,http://digital.vatlib.it/con/thumb/Cappon.52/0122_fa_0059v,http://digital.vatlib.it/con/thumb/Cappon.52/0123_fa_0060r,http://digital.vatlib.it/con/thumb/Cappon.52/0124_fa_0060v,http://digital.vatlib.it/con/thumb/Cappon.52/0125_fa_0061r,http://digital.vatlib.it/con/thumb/Cappon.52/0126_fa_0061v,http://digital.vatlib.it/con/thumb/Cappon.52/0127_fa_0062r,http://digital.vatlib.it/con/thumb/Cappon.52/0128_fa_0062v,http://digital.vatlib.it/con/thumb/Cappon.52/0129_fa_0063r,http://digital.vatlib.it/con/thumb/Cappon.52/0130_fa_0063v,http://digital.vatlib.it/con/thumb/Cappon.52/0131_fa_0064r,http://digital.vatlib.it/con/thumb/Cappon.52/0132_fa_0064v,http://digital.vatlib.it/con/thumb/Cappon.52/0133_sy_0001r,http://digital.vatlib.it/con/thumb/Cappon.52/0134_sy_0001v,http://digital.vatlib.it/con/thumb/Cappon.52/0135_sy_0002r,http://digital.vatlib.it/con/thumb/Cappon.52/0136_sy_0002v,http://digital.vatlib.it/con/thumb/Cappon.52/0137_ye_risguardia.posteriore,http://digital.vatlib.it/con/thumb/Cappon.52/0138_yh_dorso,http://digital.vatlib.it/con/thumb/Cappon.52/0139_yl_taglio.centrale,http://digital.vatlib.it/con/thumb/Cappon.52/0140_yn_taglio.inferiore,http://digital.vatlib.it/con/thumb/Cappon.52/0141_yp_taglio.superiore";
// Mock Manifest
rerum.value('Manifest', {
    "@context": "http://iiif.io/api/presentation/2/context.json",
    "@type": "sc:Manifest",
    "label": "New Manifest",
    "resources": [],
    "metadata": [],
    "sequences": [
        {
            "@id": "normal sequence",
            "@type": "sc:Sequence",
            "canvases": [
                {
                    "@id": "canvas_0",
                    "@type": "sc:Canvas",
                    "label": "0001_al_piatto.anteriore",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": "http://digital.vatlib.it/con/thumb/Cappon.52/0001_al_piatto.anteriore",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ],
                    "otherContent": [
                        {
                            "@id": "aList",
                            "@type": "sc:AnnotationList",
                            "motivation": "transcription",
                            "resources": [
                                {
                                    "@id": "A0",
                                    "@type": "oa:Annotation",
                                    "motivation": "transcription",
                                    "chars": "",
                                    "on": "canvas_0#xywh=15,15,700,225"
                                }
                            ]
                        }
                    ]
                },
                {
                    "@id": "canvas_1",
                    "@type": "sc:Canvas",
                    "label": "0002_ba_risguardia.anteriore",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0002_ba_risguardia.anteriore",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_2",
                    "@type": "sc:Canvas",
                    "label": "0003_cy_0001r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0003_cy_0001r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_3",
                    "@type": "sc:Canvas",
                    "label": "0004_cy_0001v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0004_cy_0001v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_4",
                    "@type": "sc:Canvas",
                    "label": "0005_cy_0002r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0005_cy_0002r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_5",
                    "@type": "sc:Canvas",
                    "label": "0006_cy_0002v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0006_cy_0002v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_6",
                    "@type": "sc:Canvas",
                    "label": "0007_fa_0001r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0007_fa_0001r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_7",
                    "@type": "sc:Canvas",
                    "label": "0008_fa_0001v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0008_fa_0001v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_8",
                    "@type": "sc:Canvas",
                    "label": "0009_fa_0002r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0009_fa_0002r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_9",
                    "@type": "sc:Canvas",
                    "label": "0010_fa_0002v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0010_fa_0002v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_10",
                    "@type": "sc:Canvas",
                    "label": "0011_fa_0003r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0011_fa_0003r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_11",
                    "@type": "sc:Canvas",
                    "label": "0012_fa_0003v",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0012_fa_0003v",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_12",
                    "@type": "sc:Canvas",
                    "label": "0013_fa_0004r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0013_fa_0004r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_13",
                    "@type": "sc:Canvas",
                    "label": "0014_fa_0004v",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0014_fa_0004v",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_14",
                    "@type": "sc:Canvas",
                    "label": "0015_fa_0006r.%5B01.xy.0002%5D",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0015_fa_0006r.%5B01.xy.0002%5D",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_15",
                    "@type": "sc:Canvas",
                    "label": "0016_fa_0006v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0016_fa_0006v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_16",
                    "@type": "sc:Canvas",
                    "label": "0017_fa_0007r",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0017_fa_0007r",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_17",
                    "@type": "sc:Canvas",
                    "label": "0018_fa_0007v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0018_fa_0007v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_18",
                    "@type": "sc:Canvas",
                    "label": "0019_fa_0008r",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0019_fa_0008r",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_19",
                    "@type": "sc:Canvas",
                    "label": "0020_fa_0008v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0020_fa_0008v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_20",
                    "@type": "sc:Canvas",
                    "label": "0021_fa_0009r",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0021_fa_0009r",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_21",
                    "@type": "sc:Canvas",
                    "label": "0022_fa_0009v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0022_fa_0009v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_22",
                    "@type": "sc:Canvas",
                    "label": "0023_fa_0010r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0023_fa_0010r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_23",
                    "@type": "sc:Canvas",
                    "label": "0024_fa_0010v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0024_fa_0010v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_24",
                    "@type": "sc:Canvas",
                    "label": "0025_fa_0011r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0025_fa_0011r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_25",
                    "@type": "sc:Canvas",
                    "label": "0026_fa_0011v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0026_fa_0011v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_26",
                    "@type": "sc:Canvas",
                    "label": "0027_fa_0012r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0027_fa_0012r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_27",
                    "@type": "sc:Canvas",
                    "label": "0028_fa_0012v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0028_fa_0012v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_28",
                    "@type": "sc:Canvas",
                    "label": "0029_fa_0013r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0029_fa_0013r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_29",
                    "@type": "sc:Canvas",
                    "label": "0030_fa_0013v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0030_fa_0013v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_30",
                    "@type": "sc:Canvas",
                    "label": "0031_fa_0014r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0031_fa_0014r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_31",
                    "@type": "sc:Canvas",
                    "label": "0032_fa_0014v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0032_fa_0014v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_32",
                    "@type": "sc:Canvas",
                    "label": "0033_fa_0015r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0033_fa_0015r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_33",
                    "@type": "sc:Canvas",
                    "label": "0034_fa_0015v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0034_fa_0015v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_34",
                    "@type": "sc:Canvas",
                    "label": "0035_fa_0016r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0035_fa_0016r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_35",
                    "@type": "sc:Canvas",
                    "label": "0036_fa_0016v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0036_fa_0016v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_36",
                    "@type": "sc:Canvas",
                    "label": "0037_fa_0017r",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0037_fa_0017r",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_37",
                    "@type": "sc:Canvas",
                    "label": "0038_fa_0017v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0038_fa_0017v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_38",
                    "@type": "sc:Canvas",
                    "label": "0039_fa_0018r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0039_fa_0018r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_39",
                    "@type": "sc:Canvas",
                    "label": "0040_fa_0018v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0040_fa_0018v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_40",
                    "@type": "sc:Canvas",
                    "label": "0041_fa_0019r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0041_fa_0019r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_41",
                    "@type": "sc:Canvas",
                    "label": "0042_fa_0019v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0042_fa_0019v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_42",
                    "@type": "sc:Canvas",
                    "label": "0043_fa_0020r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0043_fa_0020r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_43",
                    "@type": "sc:Canvas",
                    "label": "0044_fa_0020v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0044_fa_0020v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_44",
                    "@type": "sc:Canvas",
                    "label": "0045_fa_0021r",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0045_fa_0021r",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_45",
                    "@type": "sc:Canvas",
                    "label": "0046_fa_0021v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0046_fa_0021v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_46",
                    "@type": "sc:Canvas",
                    "label": "0047_fa_0022r",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0047_fa_0022r",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_47",
                    "@type": "sc:Canvas",
                    "label": "0048_fa_0022v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0048_fa_0022v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_48",
                    "@type": "sc:Canvas",
                    "label": "0049_fa_0023r",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0049_fa_0023r",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_49",
                    "@type": "sc:Canvas",
                    "label": "0050_fa_0023v",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0050_fa_0023v",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_50",
                    "@type": "sc:Canvas",
                    "label": "0051_fa_0024r",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0051_fa_0024r",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_51",
                    "@type": "sc:Canvas",
                    "label": "0052_fa_0024v",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0052_fa_0024v",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_52",
                    "@type": "sc:Canvas",
                    "label": "0053_fa_0025r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0053_fa_0025r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_53",
                    "@type": "sc:Canvas",
                    "label": "0054_fa_0025v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0054_fa_0025v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_54",
                    "@type": "sc:Canvas",
                    "label": "0055_fa_0026r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0055_fa_0026r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_55",
                    "@type": "sc:Canvas",
                    "label": "0056_fa_0026v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0056_fa_0026v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_56",
                    "@type": "sc:Canvas",
                    "label": "0057_fa_0027r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0057_fa_0027r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_57",
                    "@type": "sc:Canvas",
                    "label": "0058_fa_0027v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0058_fa_0027v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_58",
                    "@type": "sc:Canvas",
                    "label": "0059_fa_0028r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0059_fa_0028r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_59",
                    "@type": "sc:Canvas",
                    "label": "0060_fa_0028v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0060_fa_0028v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_60",
                    "@type": "sc:Canvas",
                    "label": "0061_fa_0029r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0061_fa_0029r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_61",
                    "@type": "sc:Canvas",
                    "label": "0062_fa_0029v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0062_fa_0029v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_62",
                    "@type": "sc:Canvas",
                    "label": "0063_fa_0030r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0063_fa_0030r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_63",
                    "@type": "sc:Canvas",
                    "label": "0064_fa_0030v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0064_fa_0030v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_64",
                    "@type": "sc:Canvas",
                    "label": "0065_fa_0031r",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0065_fa_0031r",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_65",
                    "@type": "sc:Canvas",
                    "label": "0066_fa_0031v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0066_fa_0031v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_66",
                    "@type": "sc:Canvas",
                    "label": "0067_fa_0032r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0067_fa_0032r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_67",
                    "@type": "sc:Canvas",
                    "label": "0068_fa_0032v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0068_fa_0032v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_68",
                    "@type": "sc:Canvas",
                    "label": "0069_fa_0033r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0069_fa_0033r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_69",
                    "@type": "sc:Canvas",
                    "label": "0070_fa_0033v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0070_fa_0033v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_70",
                    "@type": "sc:Canvas",
                    "label": "0071_fa_0034r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0071_fa_0034r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_71",
                    "@type": "sc:Canvas",
                    "label": "0072_fa_0034v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0072_fa_0034v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_72",
                    "@type": "sc:Canvas",
                    "label": "0073_fa_0035r",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0073_fa_0035r",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_73",
                    "@type": "sc:Canvas",
                    "label": "0074_fa_0035v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0074_fa_0035v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_74",
                    "@type": "sc:Canvas",
                    "label": "0075_fa_0036r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0075_fa_0036r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_75",
                    "@type": "sc:Canvas",
                    "label": "0076_fa_0036v",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0076_fa_0036v",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_76",
                    "@type": "sc:Canvas",
                    "label": "0077_fa_0037r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0077_fa_0037r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_77",
                    "@type": "sc:Canvas",
                    "label": "0078_fa_0037v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0078_fa_0037v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_78",
                    "@type": "sc:Canvas",
                    "label": "0079_fa_0038r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0079_fa_0038r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_79",
                    "@type": "sc:Canvas",
                    "label": "0080_fa_0038v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0080_fa_0038v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_80",
                    "@type": "sc:Canvas",
                    "label": "0081_fa_0039r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0081_fa_0039r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_81",
                    "@type": "sc:Canvas",
                    "label": "0082_fa_0039v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0082_fa_0039v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_82",
                    "@type": "sc:Canvas",
                    "label": "0083_fa_0040r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0083_fa_0040r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_83",
                    "@type": "sc:Canvas",
                    "label": "0084_fa_0040v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0084_fa_0040v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_84",
                    "@type": "sc:Canvas",
                    "label": "0085_fa_0041r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0085_fa_0041r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_85",
                    "@type": "sc:Canvas",
                    "label": "0086_fa_0041v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0086_fa_0041v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_86",
                    "@type": "sc:Canvas",
                    "label": "0087_fa_0042r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0087_fa_0042r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_87",
                    "@type": "sc:Canvas",
                    "label": "0088_fa_0042v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0088_fa_0042v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_88",
                    "@type": "sc:Canvas",
                    "label": "0089_fa_0043r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0089_fa_0043r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_89",
                    "@type": "sc:Canvas",
                    "label": "0090_fa_0043v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0090_fa_0043v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_90",
                    "@type": "sc:Canvas",
                    "label": "0091_fa_0044r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0091_fa_0044r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_91",
                    "@type": "sc:Canvas",
                    "label": "0092_fa_0044v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0092_fa_0044v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_92",
                    "@type": "sc:Canvas",
                    "label": "0093_fa_0045r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0093_fa_0045r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_93",
                    "@type": "sc:Canvas",
                    "label": "0094_fa_0045v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0094_fa_0045v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_94",
                    "@type": "sc:Canvas",
                    "label": "0095_fa_0046r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0095_fa_0046r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_95",
                    "@type": "sc:Canvas",
                    "label": "0096_fa_0046v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0096_fa_0046v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_96",
                    "@type": "sc:Canvas",
                    "label": "0097_fa_0047r",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0097_fa_0047r",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_97",
                    "@type": "sc:Canvas",
                    "label": "0098_fa_0047v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0098_fa_0047v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_98",
                    "@type": "sc:Canvas",
                    "label": "0099_fa_0048r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0099_fa_0048r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_99",
                    "@type": "sc:Canvas",
                    "label": "0100_fa_0048v",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0100_fa_0048v",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_100",
                    "@type": "sc:Canvas",
                    "label": "0101_fa_0049r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0101_fa_0049r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_101",
                    "@type": "sc:Canvas",
                    "label": "0102_fa_0049v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0102_fa_0049v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_102",
                    "@type": "sc:Canvas",
                    "label": "0103_fa_0050r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0103_fa_0050r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_103",
                    "@type": "sc:Canvas",
                    "label": "0104_fa_0050v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0104_fa_0050v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_104",
                    "@type": "sc:Canvas",
                    "label": "0105_fa_0051r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0105_fa_0051r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_105",
                    "@type": "sc:Canvas",
                    "label": "0106_fa_0051v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0106_fa_0051v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_106",
                    "@type": "sc:Canvas",
                    "label": "0107_fa_0052r",
                    "height": 1000,
                    "width": 747,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0107_fa_0052r",
                                "@type": "dcTypes:Image",
                                "width": 112,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_107",
                    "@type": "sc:Canvas",
                    "label": "0108_fa_0052v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0108_fa_0052v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_108",
                    "@type": "sc:Canvas",
                    "label": "0109_fa_0053r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0109_fa_0053r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_109",
                    "@type": "sc:Canvas",
                    "label": "0110_fa_0053v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0110_fa_0053v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_110",
                    "@type": "sc:Canvas",
                    "label": "0111_fa_0054r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0111_fa_0054r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_111",
                    "@type": "sc:Canvas",
                    "label": "0112_fa_0054v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0112_fa_0054v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_112",
                    "@type": "sc:Canvas",
                    "label": "0113_fa_0055r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0113_fa_0055r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_113",
                    "@type": "sc:Canvas",
                    "label": "0114_fa_0055v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0114_fa_0055v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_114",
                    "@type": "sc:Canvas",
                    "label": "0115_fa_0056r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0115_fa_0056r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_115",
                    "@type": "sc:Canvas",
                    "label": "0116_fa_0056v",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0116_fa_0056v",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_116",
                    "@type": "sc:Canvas",
                    "label": "0117_fa_0057r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0117_fa_0057r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_117",
                    "@type": "sc:Canvas",
                    "label": "0118_fa_0057v",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0118_fa_0057v",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_118",
                    "@type": "sc:Canvas",
                    "label": "0119_fa_0058r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0119_fa_0058r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_119",
                    "@type": "sc:Canvas",
                    "label": "0120_fa_0058v",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0120_fa_0058v",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_120",
                    "@type": "sc:Canvas",
                    "label": "0121_fa_0059r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0121_fa_0059r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_121",
                    "@type": "sc:Canvas",
                    "label": "0122_fa_0059v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0122_fa_0059v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_122",
                    "@type": "sc:Canvas",
                    "label": "0123_fa_0060r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0123_fa_0060r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_123",
                    "@type": "sc:Canvas",
                    "label": "0124_fa_0060v",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0124_fa_0060v",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_124",
                    "@type": "sc:Canvas",
                    "label": "0125_fa_0061r",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0125_fa_0061r",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_125",
                    "@type": "sc:Canvas",
                    "label": "0126_fa_0061v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0126_fa_0061v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_126",
                    "@type": "sc:Canvas",
                    "label": "0127_fa_0062r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0127_fa_0062r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_127",
                    "@type": "sc:Canvas",
                    "label": "0128_fa_0062v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0128_fa_0062v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_128",
                    "@type": "sc:Canvas",
                    "label": "0129_fa_0063r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0129_fa_0063r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_129",
                    "@type": "sc:Canvas",
                    "label": "0130_fa_0063v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0130_fa_0063v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_130",
                    "@type": "sc:Canvas",
                    "label": "0131_fa_0064r",
                    "height": 1000,
                    "width": 753,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0131_fa_0064r",
                                "@type": "dcTypes:Image",
                                "width": 113,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_131",
                    "@type": "sc:Canvas",
                    "label": "0132_fa_0064v",
                    "height": 1000,
                    "width": 760,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0132_fa_0064v",
                                "@type": "dcTypes:Image",
                                "width": 114,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_132",
                    "@type": "sc:Canvas",
                    "label": "0133_sy_0001r",
                    "height": 1000,
                    "width": 767,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0133_sy_0001r",
                                "@type": "dcTypes:Image",
                                "width": 115,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_133",
                    "@type": "sc:Canvas",
                    "label": "0134_sy_0001v",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0134_sy_0001v",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_134",
                    "@type": "sc:Canvas",
                    "label": "0135_sy_0002r",
                    "height": 1000,
                    "width": 773,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0135_sy_0002r",
                                "@type": "dcTypes:Image",
                                "width": 116,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_135",
                    "@type": "sc:Canvas",
                    "label": "0136_sy_0002v",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0136_sy_0002v",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_136",
                    "@type": "sc:Canvas",
                    "label": "0137_ye_risguardia.posteriore",
                    "height": 1000,
                    "width": 780,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0137_ye_risguardia.posteriore",
                                "@type": "dcTypes:Image",
                                "width": 117,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_137",
                    "@type": "sc:Canvas",
                    "label": "0138_yh_dorso",
                    "height": 1000,
                    "width": 173,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0138_yh_dorso",
                                "@type": "dcTypes:Image",
                                "width": 26,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_138",
                    "@type": "sc:Canvas",
                    "label": "0139_yl_taglio.centrale",
                    "height": 1000,
                    "width": 173,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0139_yl_taglio.centrale",
                                "@type": "dcTypes:Image",
                                "width": 26,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_139",
                    "@type": "sc:Canvas",
                    "label": "0140_yn_taglio.inferiore",
                    "height": 1000,
                    "width": 227,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0140_yn_taglio.inferiore",
                                "@type": "dcTypes:Image",
                                "width": 34,
                                "height": 150
                            }
                        }
                    ]
                },
                {
                    "@id": "canvas_140",
                    "@type": "sc:Canvas",
                    "label": "0141_yp_taglio.superiore",
                    "height": 1000,
                    "width": 227,
                    "images": [
                        {
                            "@type": "oa:Annotation",
                            "motivation": "sc:painting",
                            "resource": {
                                "@id": " http://digital.vatlib.it/con/thumb/Cappon.52/0141_yp_taglio.superiore",
                                "@type": "dcTypes:Image",
                                "width": 34,
                                "height": 150
                            }
                        }
                    ]
                }
            ]
        }
    ]
});
