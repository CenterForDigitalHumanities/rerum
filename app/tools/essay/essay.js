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
                controller: 'essayController',
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

rerum.controller('essayController', function ($scope, $uibModal, Context, Knowns, rerumService, obj) {
    var essayContext = {
        "metadataResources": {
            "@type": "@id",
            "@id": "rdf:isDescribedBy",
            "@container": "@list"
        },
        "sections": {
            "@type": "@id",
            "@id": "rr:hasParts",
            "@container": "@list"
        },
        "footnotes": {
            "@type": "@id",
            "@id": "sc:hasAnnotations",
            "@container": "@list"
        },
        "endnotes": {
            "@type": "@id",
            "@id": "sc:hasAnnotations",
            "@container": "@list"
        },
        "indices": {
            "@type": "@id",
            "@id": "sc:hasAnnotations",
            "@container": "@list"
        },
        "comments": {
            "@type": "@id",
            "@id": "sc:hasAnnotations",
            "@container": "@list"
        }
    };
    angular.extend(Context.json, essayContext);
    Knowns.essay = {
//        "@id" : "",
        "@context": "http://iiif.io/api/presentation/2/context.json",
        "@type": "Essay",
        "label": "",
        "metadataResources": [],
        "sections": [],
        "footnotes": [],
        "endnotes": [],
        "indices": [],
        "comments": [],
        "otherContent": []
    };

    $scope.obj = obj || Knowns.essay;
    Context.getJSON.success(function (c) {
        $scope.context = c['@context'][0];
        angular.extend(Context, essayContext);
    });
    $scope.types = Knowns.type;
    $scope.adding = Knowns.adding;
    $scope.cHeight = 1000;

    $scope.editList = function (parent, prop) {
        var self = this;
        var modal = $uibModal.open({
            templateUrl: 'tools/editList.html',
            size: 'lg',
            controller: function ($scope, Knowns, Context) {
                $scope.context = Context.json;
                $scope.list = parent[prop];
                $scope.parent = parent;
                $scope.prop = prop;
                $scope.adding = Knowns.adding;
                $scope.editList = self.editList; // what strange scope hath I wrought?
                $scope.addItem = function (item, parent, list, build) {
                    var newItem = angular.copy(item) || {};
                    if (build) {
                        build(newItem, parent);
                    }
                    list.push(newItem);
                };
            }
        });
    };
});
