/*
 * Read a manifest's transcription.
 * author: cubap@slu.edu
 */

rerum.config(['$routeProvider',
    function ($routeProvider, $locationProvider, Edition) {
        $routeProvider
            .when('/read', {
                templateUrl: 'app/tools/read-manifest/read.html',
                controller: 'readManifestController',
                resolve: {
                    context: function (Context) {
                        return Context.getJSON.success(function (c) {
                            // cached for later consumption
                        });
                    },
                    obj: function($location,$http){
                        // TODO: preload a known manifest from the URL or memory
                        var mUrl = $location.search().url;
                        var manifest = (mUrl && $http.get(mUrl).then(function(m){
                            // success
                            return m.data;
                        },function(err){
                            // error
                            return {
                                error:err
                            };
                        })) || {};
                        return manifest;
                    }
                }
            });
        }
]);

rerum.controller('readManifestController',function($scope,context,obj){
    $scope.obj = obj;
});

