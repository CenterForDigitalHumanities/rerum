/* global rerum */

rerum.config(['$routeProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/essay', {
                templateUrl: 'app/tools/essay/essay.html',
                controller: 'essayController',
                resolve: {
                    context: function (Context) {
                        return Context.getJSON.success(function (c) {
                            // cached for later consumption
                        });
                    },
                    obj: function (Knowns) {
                        return Knowns.essay;
                        // TODO: preload a known manifest from the URL or memory
                    }
                }
            })
            .when('/essay/edit', {
                templateUrl: 'app/tools/essay/editEssay.html',
                controller: 'editEssayController',
                resolve: {
                    context: function (Context) {
                        return Context.getJSON.success(function (c) {
                            // cached for later consumption
                        });
                    },
                    obj: function () {
                        return false;
                    }
                }
            });
    }]);

rerum.service('EssayService', function () {
    return {};
});

rerum.controller('essayController', function ($scope) {

});
rerum.controller('editEssayController', function ($scope, Knowns, Context, obj) {
    $scope.obj = obj || Knowns.essay;
    Context.getJSON.success(function (c) {
        $scope.context = c['@context'][0];
    });
});