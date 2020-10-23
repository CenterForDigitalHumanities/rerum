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
                    },
                    canvas: function($location, $http, rerumService) {
                        // TODO: preload a known manifest from the URL or memory
                        var c = $location.search().p;
                        return c || undefined;
                    }
                }
            });
    }
]);

rerum.controller('readManifestController', function ($scope, $http,$sce, obj,canvas, rerumService) {
    $scope.obj = obj;
    $scope.screen = {
        viewing: "image",
        block:true,
        language: "en",
        backsplashStyle: "",
        views: {
            image: "annotations",
            annotations: "image"
        },
        murl: ""
    };
    if (obj['@id']) {
        $scope.screen.canvas = (canvas===undefined) ? $scope.obj.sequences[0].canvases[0] : $scope.obj.sequences[0].canvases[canvas];
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
                $scope.screen.canvas.otherContent[0] = canvas.otherContent[0] = res.data;
            }, function (err) { });
        });
    }
    $scope.trust = function(body){
        return $sce.trustAsHtml(body);
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
    $scope.getStyle = function (on,canvas) {
        var xywh = on.substring(on.indexOf("xywh=") + 5).split(",");
        var height = canvas.height;
        var width = canvas.width;
        return {
            left: xywh[0] / width * 100 + "%",
            top: xywh[1] / height * 100 + "%",
            height: xywh[3] / height * 100 + "%",
            width: xywh[2] / width * 100 + "%"
        };
    };
    $scope.moveBacksplash = function (on,canvas) {
        var xywh = on.substring(on.indexOf("xywh=") + 5).split(",");
        var height = canvas.height;
        var width = canvas.width;
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
    $scope.getValue = function(a){
        let val
        let res = a.resource || a.body
        if(!res) throw new Error("No annotation body detected")
        if(!angular.isArray(res)) res=[res]
        res.forEach(function(body){
            if(val) return // breakout after the first found for now
            val = body['cnt:chars'] 
            || body['chars'] 
            || body['@value'] 
            || body.value 
        })
        return val
    }
});