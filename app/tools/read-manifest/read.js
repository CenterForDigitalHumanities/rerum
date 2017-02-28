/*
 * Read a manifest's transcription.
 * author: cubap@slu.edu
 */

rerum.config(['$routeProvider',
    function ($routeProvider, $locationProvider, Edition) {
        $routeProvider
            .when('/read', {
                templateUrl: 'app/tools/editManifest.html',
                controller: 'buildManifestController',
                resolve: {
                    context: function (Context) {
                        return Context.getJSON.success(function (c) {
                            // cached for later consumption
                        });
                    },
                    obj: function($location,$http){
                        // TODO: preload a known manifest from the URL or memory
                        var mUrl = $location.search().url;
                        var manifest = (mUrl && $http.get(mUrl)) || {};
                        return $http.get(mUrl);
                    }
                }
            });
        }
]);

