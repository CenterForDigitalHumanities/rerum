/*
 * Read a manifest's transcription.
 * author: cubap@slu.edu
 */

rerum.config(['$routeProvider',
    function ($routeProvider) {
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
                    obj: function ($location, $http, rerumService) {
                        // TODO: preload a known manifest from the URL or memory
                        var mUrl = $location.search().url;
                        var manifest = (mUrl && $http.get(mUrl).then(function (m) {
                            // success
                            rerumService.extractResources(m.data);
                            return m.data;
                        }, function (err) {
                            // error
                            return {
                                error: err
                            };
                        })) || {};
                        return manifest;
                    }
                }
            });
    }
]);

rerum.controller('readManifestController', function ($scope, $http,$sce, obj, rerumService) {
    $scope.obj = obj;
    if (obj['@id']) {
        $scope.canvas = $scope.obj.sequences[0].canvases[0];
        angular.forEach(obj.sequences[0].canvases, function (canvas) {
            var uri;
            if (!canvas.otherContent || angular.isArray(canvas.otherContent[0].resources)) {
                return false;
            }
            if (typeof canvas.otherContent[0] === "string") {
                uri = canvas.otherContent[0];
            } else if (!canvas.otherContent[0].resources && canvas.otherContent[0]['@id']) {
                uri = canvas.otherContent[0]['@id'];
            }
            rerumService.resolveURI(uri).then(function (res) {
                canvas.otherContent[0] = res.data;
            }, function (err) { });
        });
    }
    $scope.trustMetadata = function(m){
        return $sce.trustAsHtml(m);
    };
    $scope.screen = {
        viewing: "image",
        language: "en",
        backsplashStyle: "",
        views: {
            image: "annotations",
            annotations: "image"
        },
        murl: ""
    };
    $scope.setDescription = function (desc, lang) {
        $scope.screen.language = lang;
        $scope.description = "";
        if (!desc) {
            return $scope.description;
        }
        if (angular.isArray(desc)) {
            $scope.languages = [];
            angular.forEach(desc, function (o, i) {
                $scope.languages.push(o['@language']);
                if (o['@language'] === lang) {
                    $scope.description = o['@value'];
                }
            });
            return $scope.description;
        }
        if (typeof $scope.description === "string") {
            return $scope.description;
        }
        return $scope.description;
    };
    $scope.setDescription(obj.description, "en");
    $scope.getStyle = function (on) {
        var xywh = on.substring(on.indexOf("xywh=") + 5).split(",");
        var height = $scope.canvas.height;
        var width = $scope.canvas.width;
        return {
            left: xywh[0] / width * 100 + "%",
            top: xywh[1] / height * 100 + "%",
            height: xywh[3] / height * 100 + "%",
            width: xywh[2] / width * 100 + "%"
        };
    };
    $scope.moveBacksplash = function (on) {
        var xywh = on.substring(on.indexOf("xywh=") + 5).split(",");
        var height = $scope.canvas.height;
        var width = $scope.canvas.width;
        var ww = window.innerWidth;
        var iw = ww * width / xywh[2]; // in pixels
        var ih = iw * height / width;
        var ratio = iw / width;
        $scope.screen.backsplashStyle = {
            left: -xywh[0] * ratio + "px",
            top: -xywh[1] * ratio + "px",
            width: iw + "px",
            opacity: .6
        };
    };
    $scope.hideBacksplash = function () {
        $scope.screen.backsplashStyle = null;
    };
    $scope.cycleView = function () {
        $scope.screen.viewing = $scope.screen.views[$scope.screen.viewing];
    };
    $scope.getUniverse = function () {
        return $http.get('http://ryanfb.github.io/iiif-universe/iiif-universe.json').then(function (res) {
            checkResponse(res.data);
            $scope.universe = res.data;
            if (!$scope.universe.collections || $scope.universe.collections.length === 0) {
                showError({
                    statusText: "Collections array is empty, but the call succeeded.",
                    code: 200
                });
            }
        }, showError);
    };
    $scope.updateCollection = function (collectionID) {
        $scope.collection = $http.get(collectionID).then(function (res) {
            checkResponse(res.data);
            if (res.data.manifests) {
                $scope.collection = res.data;
                if ($scope.collection.manifests.length === 0) {
                    showError({
                        statusText: "Manifests array is empty, but the call succeeded.",
                        code: 200
                    });
                }
            }
            if (res.data.collections) {
                $scope.universe = res.data;
            }
        }, showError);
    };
    $scope.getUniverse();
    function showError(err) {
        $scope.obj = {
            status: "ERROR",
            message: err.statusText,
            code: err.status
        };
    }
    function checkResponse(data) {
        if (!data || Object.keys(data).length === 0) {
            showError({
                statusText: "The call succeeded but the response was empty.",
                code: 200
            });
        }
    }
});