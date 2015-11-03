var rerum = angular.module('rerum', ['ui.bootstrap', 'ngRoute', 'angular-loading-bar', 'cfp.hotkeys']);
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
                .when('/objects', {
                    templateUrl: 'app/objects/objects.html'
            })
            .when('/tools', {
                templateUrl: 'app/tools/tools.html'
            })
            .when('/about', {
                templateUrl: 'app/about/about.html'
            })
            .otherwise(({redirectTo: '/welcome'}));
    }]);
rerum.value('Terminal', true); // set Apple IIe style
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
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
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

var dummyDumpURLs = "http://digital.vatlib.it/con/thumb/Cappon.52/0001_al_piatto.anteriore,http://digital.vatlib.it/con/thumb/Cappon.52/0002_ba_risguardia.anteriore,http://digital.vatlib.it/con/thumb/Cappon.52/0003_cy_0001r,http://digital.vatlib.it/con/thumb/Cappon.52/0004_cy_0001v,http://digital.vatlib.it/con/thumb/Cappon.52/0005_cy_0002r,http://digital.vatlib.it/con/thumb/Cappon.52/0006_cy_0002v,http://digital.vatlib.it/con/thumb/Cappon.52/0007_fa_0001r,http://digital.vatlib.it/con/thumb/Cappon.52/0008_fa_0001v,http://digital.vatlib.it/con/thumb/Cappon.52/0009_fa_0002r,http://digital.vatlib.it/con/thumb/Cappon.52/0010_fa_0002v,http://digital.vatlib.it/con/thumb/Cappon.52/0011_fa_0003r,http://digital.vatlib.it/con/thumb/Cappon.52/0012_fa_0003v,http://digital.vatlib.it/con/thumb/Cappon.52/0013_fa_0004r,http://digital.vatlib.it/con/thumb/Cappon.52/0014_fa_0004v,http://digital.vatlib.it/con/thumb/Cappon.52/0015_fa_0006r.%5B01.xy.0002%5D,http://digital.vatlib.it/con/thumb/Cappon.52/0016_fa_0006v,http://digital.vatlib.it/con/thumb/Cappon.52/0017_fa_0007r,http://digital.vatlib.it/con/thumb/Cappon.52/0018_fa_0007v,http://digital.vatlib.it/con/thumb/Cappon.52/0019_fa_0008r,http://digital.vatlib.it/con/thumb/Cappon.52/0020_fa_0008v,http://digital.vatlib.it/con/thumb/Cappon.52/0021_fa_0009r,http://digital.vatlib.it/con/thumb/Cappon.52/0022_fa_0009v,http://digital.vatlib.it/con/thumb/Cappon.52/0023_fa_0010r,http://digital.vatlib.it/con/thumb/Cappon.52/0024_fa_0010v,http://digital.vatlib.it/con/thumb/Cappon.52/0025_fa_0011r,http://digital.vatlib.it/con/thumb/Cappon.52/0026_fa_0011v,http://digital.vatlib.it/con/thumb/Cappon.52/0027_fa_0012r,http://digital.vatlib.it/con/thumb/Cappon.52/0028_fa_0012v,http://digital.vatlib.it/con/thumb/Cappon.52/0029_fa_0013r,http://digital.vatlib.it/con/thumb/Cappon.52/0030_fa_0013v,http://digital.vatlib.it/con/thumb/Cappon.52/0031_fa_0014r,http://digital.vatlib.it/con/thumb/Cappon.52/0032_fa_0014v,http://digital.vatlib.it/con/thumb/Cappon.52/0033_fa_0015r,http://digital.vatlib.it/con/thumb/Cappon.52/0034_fa_0015v,http://digital.vatlib.it/con/thumb/Cappon.52/0035_fa_0016r,http://digital.vatlib.it/con/thumb/Cappon.52/0036_fa_0016v,http://digital.vatlib.it/con/thumb/Cappon.52/0037_fa_0017r,http://digital.vatlib.it/con/thumb/Cappon.52/0038_fa_0017v,http://digital.vatlib.it/con/thumb/Cappon.52/0039_fa_0018r,http://digital.vatlib.it/con/thumb/Cappon.52/0040_fa_0018v,http://digital.vatlib.it/con/thumb/Cappon.52/0041_fa_0019r,http://digital.vatlib.it/con/thumb/Cappon.52/0042_fa_0019v,http://digital.vatlib.it/con/thumb/Cappon.52/0043_fa_0020r,http://digital.vatlib.it/con/thumb/Cappon.52/0044_fa_0020v,http://digital.vatlib.it/con/thumb/Cappon.52/0045_fa_0021r,http://digital.vatlib.it/con/thumb/Cappon.52/0046_fa_0021v,http://digital.vatlib.it/con/thumb/Cappon.52/0047_fa_0022r,http://digital.vatlib.it/con/thumb/Cappon.52/0048_fa_0022v,http://digital.vatlib.it/con/thumb/Cappon.52/0049_fa_0023r,http://digital.vatlib.it/con/thumb/Cappon.52/0050_fa_0023v,http://digital.vatlib.it/con/thumb/Cappon.52/0051_fa_0024r,http://digital.vatlib.it/con/thumb/Cappon.52/0052_fa_0024v,http://digital.vatlib.it/con/thumb/Cappon.52/0053_fa_0025r,http://digital.vatlib.it/con/thumb/Cappon.52/0054_fa_0025v,http://digital.vatlib.it/con/thumb/Cappon.52/0055_fa_0026r,http://digital.vatlib.it/con/thumb/Cappon.52/0056_fa_0026v,http://digital.vatlib.it/con/thumb/Cappon.52/0057_fa_0027r,http://digital.vatlib.it/con/thumb/Cappon.52/0058_fa_0027v,http://digital.vatlib.it/con/thumb/Cappon.52/0059_fa_0028r,http://digital.vatlib.it/con/thumb/Cappon.52/0060_fa_0028v,http://digital.vatlib.it/con/thumb/Cappon.52/0061_fa_0029r,http://digital.vatlib.it/con/thumb/Cappon.52/0062_fa_0029v,http://digital.vatlib.it/con/thumb/Cappon.52/0063_fa_0030r,http://digital.vatlib.it/con/thumb/Cappon.52/0064_fa_0030v,http://digital.vatlib.it/con/thumb/Cappon.52/0065_fa_0031r,http://digital.vatlib.it/con/thumb/Cappon.52/0066_fa_0031v,http://digital.vatlib.it/con/thumb/Cappon.52/0067_fa_0032r,http://digital.vatlib.it/con/thumb/Cappon.52/0068_fa_0032v,http://digital.vatlib.it/con/thumb/Cappon.52/0069_fa_0033r,http://digital.vatlib.it/con/thumb/Cappon.52/0070_fa_0033v,http://digital.vatlib.it/con/thumb/Cappon.52/0071_fa_0034r,http://digital.vatlib.it/con/thumb/Cappon.52/0072_fa_0034v,http://digital.vatlib.it/con/thumb/Cappon.52/0073_fa_0035r,http://digital.vatlib.it/con/thumb/Cappon.52/0074_fa_0035v,http://digital.vatlib.it/con/thumb/Cappon.52/0075_fa_0036r,http://digital.vatlib.it/con/thumb/Cappon.52/0076_fa_0036v,http://digital.vatlib.it/con/thumb/Cappon.52/0077_fa_0037r,http://digital.vatlib.it/con/thumb/Cappon.52/0078_fa_0037v,http://digital.vatlib.it/con/thumb/Cappon.52/0079_fa_0038r,http://digital.vatlib.it/con/thumb/Cappon.52/0080_fa_0038v,http://digital.vatlib.it/con/thumb/Cappon.52/0081_fa_0039r,http://digital.vatlib.it/con/thumb/Cappon.52/0082_fa_0039v,http://digital.vatlib.it/con/thumb/Cappon.52/0083_fa_0040r,http://digital.vatlib.it/con/thumb/Cappon.52/0084_fa_0040v,http://digital.vatlib.it/con/thumb/Cappon.52/0085_fa_0041r,http://digital.vatlib.it/con/thumb/Cappon.52/0086_fa_0041v,http://digital.vatlib.it/con/thumb/Cappon.52/0087_fa_0042r,http://digital.vatlib.it/con/thumb/Cappon.52/0088_fa_0042v,http://digital.vatlib.it/con/thumb/Cappon.52/0089_fa_0043r,http://digital.vatlib.it/con/thumb/Cappon.52/0090_fa_0043v,http://digital.vatlib.it/con/thumb/Cappon.52/0091_fa_0044r,http://digital.vatlib.it/con/thumb/Cappon.52/0092_fa_0044v,http://digital.vatlib.it/con/thumb/Cappon.52/0093_fa_0045r,http://digital.vatlib.it/con/thumb/Cappon.52/0094_fa_0045v,http://digital.vatlib.it/con/thumb/Cappon.52/0095_fa_0046r,http://digital.vatlib.it/con/thumb/Cappon.52/0096_fa_0046v,http://digital.vatlib.it/con/thumb/Cappon.52/0097_fa_0047r,http://digital.vatlib.it/con/thumb/Cappon.52/0098_fa_0047v,http://digital.vatlib.it/con/thumb/Cappon.52/0099_fa_0048r,http://digital.vatlib.it/con/thumb/Cappon.52/0100_fa_0048v,http://digital.vatlib.it/con/thumb/Cappon.52/0101_fa_0049r,http://digital.vatlib.it/con/thumb/Cappon.52/0102_fa_0049v,http://digital.vatlib.it/con/thumb/Cappon.52/0103_fa_0050r,http://digital.vatlib.it/con/thumb/Cappon.52/0104_fa_0050v,http://digital.vatlib.it/con/thumb/Cappon.52/0105_fa_0051r,http://digital.vatlib.it/con/thumb/Cappon.52/0106_fa_0051v,http://digital.vatlib.it/con/thumb/Cappon.52/0107_fa_0052r,http://digital.vatlib.it/con/thumb/Cappon.52/0108_fa_0052v,http://digital.vatlib.it/con/thumb/Cappon.52/0109_fa_0053r,http://digital.vatlib.it/con/thumb/Cappon.52/0110_fa_0053v,http://digital.vatlib.it/con/thumb/Cappon.52/0111_fa_0054r,http://digital.vatlib.it/con/thumb/Cappon.52/0112_fa_0054v,http://digital.vatlib.it/con/thumb/Cappon.52/0113_fa_0055r,http://digital.vatlib.it/con/thumb/Cappon.52/0114_fa_0055v,http://digital.vatlib.it/con/thumb/Cappon.52/0115_fa_0056r,http://digital.vatlib.it/con/thumb/Cappon.52/0116_fa_0056v,http://digital.vatlib.it/con/thumb/Cappon.52/0117_fa_0057r,http://digital.vatlib.it/con/thumb/Cappon.52/0118_fa_0057v,http://digital.vatlib.it/con/thumb/Cappon.52/0119_fa_0058r,http://digital.vatlib.it/con/thumb/Cappon.52/0120_fa_0058v,http://digital.vatlib.it/con/thumb/Cappon.52/0121_fa_0059r,http://digital.vatlib.it/con/thumb/Cappon.52/0122_fa_0059v,http://digital.vatlib.it/con/thumb/Cappon.52/0123_fa_0060r,http://digital.vatlib.it/con/thumb/Cappon.52/0124_fa_0060v,http://digital.vatlib.it/con/thumb/Cappon.52/0125_fa_0061r,http://digital.vatlib.it/con/thumb/Cappon.52/0126_fa_0061v,http://digital.vatlib.it/con/thumb/Cappon.52/0127_fa_0062r,http://digital.vatlib.it/con/thumb/Cappon.52/0128_fa_0062v,http://digital.vatlib.it/con/thumb/Cappon.52/0129_fa_0063r,http://digital.vatlib.it/con/thumb/Cappon.52/0130_fa_0063v,http://digital.vatlib.it/con/thumb/Cappon.52/0131_fa_0064r,http://digital.vatlib.it/con/thumb/Cappon.52/0132_fa_0064v,http://digital.vatlib.it/con/thumb/Cappon.52/0133_sy_0001r,http://digital.vatlib.it/con/thumb/Cappon.52/0134_sy_0001v,http://digital.vatlib.it/con/thumb/Cappon.52/0135_sy_0002r,http://digital.vatlib.it/con/thumb/Cappon.52/0136_sy_0002v,http://digital.vatlib.it/con/thumb/Cappon.52/0137_ye_risguardia.posteriore,http://digital.vatlib.it/con/thumb/Cappon.52/0138_yh_dorso,http://digital.vatlib.it/con/thumb/Cappon.52/0139_yl_taglio.centrale,http://digital.vatlib.it/con/thumb/Cappon.52/0140_yn_taglio.inferiore,http://digital.vatlib.it/con/thumb/Cappon.52/0141_yp_taglio.superiore";