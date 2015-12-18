/* global tpen, angular */

rerum.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/parse/:canvasID', {
                templateUrl: 'app/tools/parse-rect/parsing.html',
            controller: 'parsingController',
            resolve: {
            currentCanvas: function (config, rerumService, $route, $q, Manifest, Lists) {
            var cId = $route.current.params.canvasID;
                if (cId.indexOf("%2F") > - 1) {
            cId = decodeURIComponent(cId);
            }
            if (config.currentCanvas && config.currentCanvas['@id'] === cId) {
            return config.currentCanvas;
            }
            angular.forEach(Manifest.sequences, function (s) {
            config.currentCanvas = Lists.getAllByProp("@id", cId, s.canvases)[0];
            });
                if (config.currentCanvas) {
            return config.currentCanvas;
            }
            return $q.when(rerumService.getResource(cId)).then(function (res) {
            config.currentCanvas = res;
            });
            }
            }
        });
    }]);
    rerum.service('parsingService', function ($rootScope, drawBoxService) {
    var service = this;
    this.saveAnnotation = function (xywh, on) {
        if (!on.otherContent) {
            on.otherContent = [
                {
                    "@id": "list" + on['@id'],
                    "@type": "sc:AnnotationList",
                    "motivation": "transcription",
                    "resources": []
                }
            ];
        }
        var list = drawBoxService.activeList.resources || on.otherContent[0].resources;
        var anno = {
            "@id": "A" + list.length,
            "@type": "oa:Annotation",
            "motivation": "transcription",
            "chars": "",
            "on": on['@id'] + "#xywh=" + xywh
        };
        list.push(anno);
        $rootScope.$broadcast("create-annotation");
        return "success"; // TODO: asych save
    };
});
rerum.controller('parsingController', function ($scope, $rootScope, $uibModal, rerumService, Lists, config, Manifest, drawBoxService, hotkeys) {
    $scope.config = config;
    $scope.manifest = Manifest;
    rerumService.extractResources(Manifest);
    $scope.canvas = config.currentCanvas
        ? config.currentCanvas
        : Manifest.sequences[config.currentSequenceIndex].canvases[config.currentCanvasIndex];
    $rootScope.$broadcast('view-canvas');
    $scope.addList = function () {
        if (!$scope.canvas.otherContent) {
            $scope.canvas.otherContent = [];
        }
        $scope.list = {
            motivation: "transcription",
            "@id": "new",
            "@type": "sc:AnnotationList",
            resources: []
        };
        $scope.modal = $uibModal.open({
            templateUrl: "app/tools/parse-rect/addAnnotationList.html",
            scope: $scope
        });
    };
    $scope.pushList = function () {
        $scope.canvas.otherContent.push($scope.list);
        drawBoxService.activeList = $scope.list;
        $scope.modal.close();
    };
        var motivations;
    $scope.getMotivations = function () {
        if (!motivations) {
            motivations = Lists.getAllPropValues("motivation", drawBoxService.activeList);
        }
        return motivations;
    };
    $scope.setAction = function (set) {
        drawBoxService.action = set === drawBoxService.action ? "" : set;
    };

    $rootScope.$on('change-canvas', function () {
        motivations = [];
        config.currentCanvas = $scope.canvas; // TODO: remove once the jump list is $location linked
        drawBoxService.activeList = $scope.canvas.otherContent && $scope.canvas.otherContent[0];
    });

    $scope.hotkeys = hotkeys;
    hotkeys.add({
        combo: 'ctrl+`',
        description: 'Show Objects',
        callback: function () {
            $scope.dbs.showObject = !$scope.dbs.showObject;
        }
    });
});

rerum.directive('annotationLayer', function ($rootScope, drawBoxService) {
    return {
        restrict: 'E',
        replace: true,
        template: '<canvas id="annotationLayer"></canvas>',
        link: function (scope, element) {
            scope.canvasElement = document.getElementById('canvasImage').children[1];
            element.css({
                width: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            });
            element.attr({
                width: scope.canvasElement.width,
                height: scope.canvasElement.height
            });
            var ctx = element[0].getContext('2d');

            // canvas reset
            function reset () {
                ctx.clearRect(0, 0, element[0].width, element[0].height);
            }
            function defaultDraw () {
                return drawAnnotations();
            }
            function drawAnnotations (motive, type) {
                if (!motive) {
                    motive = drawBoxService.restrictMotivations;
                }
                reset();
                scope.canvasElement = document.getElementById('annotationLayer');
                element.attr({
                    width: scope.canvasElement.width,
                    height: scope.canvasElement.height
                });
                if (!drawBoxService.activeList) {
                    return false;
                }
                ctx.beginPath();
                angular.forEach(drawBoxService.activeList.resources, function (a) {
                    if (a.on.startsWith(scope.canvas['@id'])
                        && (!motive || motive === a.motivation)
                        && (!type || type === a['@type'])) {
                        var pos = a.on.substr(a.on.indexOf("xywh=") + 5).split(",").map(function (a) {
                            return parseFloat(a);
                        });
                        ctx.rect(pos[0], pos[1], pos[2], pos[3]);
                    }
                });
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#00F';
                ctx.stroke();
            }
            scope.$on('create-annotation', defaultDraw);
            scope.$on('destroy-annotation', defaultDraw);
            scope.$on('view-canvas', defaultDraw);
            scope.$on('change-canvas', defaultDraw);
            scope.$on('view-list', defaultDraw);
            scope.$watch('dbs.activeList', defaultDraw);
            scope.$watch('dbs.restrictMotivations', defaultDraw);
            scope.$watch('canvas["@id"]', function () {
                $rootScope.$broadcast('change-canvas');
            });
        },
        controller: 'parsingController'
    };
});

