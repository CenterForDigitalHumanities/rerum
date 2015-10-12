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
