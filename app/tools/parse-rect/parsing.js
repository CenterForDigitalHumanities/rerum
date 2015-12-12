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
    };
});
    rerum.controller('parsingController', function ($scope, $rootScope, rerumService, Lists, config, Manifest, drawBoxService) {
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
        var newList = {
            label: prompt("Enter a label for this new Annotation List"),
            motivation: prompt("Enter a motivation for this new Annotation List"),
            "@id": "new",
            "@type": "sc:AnnotationList",
            resources: []
        };
        if (newList.label) {
            $scope.canvas.otherContent.push(newList);
        }
        drawBoxService.activeList = newList;
    };
        var motivations;
    $scope.getMotivations = function () {
        if (!motivations) {
            motivations = Lists.getAllPropValues("motivation", drawBoxService.activeList);
        }
        return motivations;
    };
    $rootScope.$on('change-canvas', function () {
        motivations = [];
        config.currentCanvas = $scope.canvas; // TODO: remove once the jump list is $location linked
        drawBoxService.activeList = $scope.canvas.otherContent && $scope.canvas.otherContent[0];
    });
});

    rerum.directive('annotationLayer', function ($rootScope, drawBoxService) {
    return {
        restrict: 'E',
        replace: true,
        template: '<canvas id="annotationLayer"></canvas>',
        link: function (scope, element) {
            scope.canvasElement = document.getElementById('parseImage').children[1];
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

        rerum.directive('drawBox', function (drawBoxService, Lists, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        template: '<canvas id="drawingLayer"></canvas>',
        link: function (scope, element) {
            scope.canvasElement = document.getElementById('parseImage').children[1];
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

            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            // the last coordinates before the current move
            var centerX;
            var centerY;

            // canvas unit to pixels
            function pixelToUnit (px) {
                return px * (element.attr('width') / element[0].clientWidth);
            }
            function rect (x, y, w, h, color, width) {
                ctx.rect(x, y, w, h);
                ctx.lineWidth = width || 3;
                // color
                ctx.strokeStyle = color || '#fff';
                // draw it
                ctx.stroke();
            }
            element.bind('mousemove', function (event) {
                if (drawBoxService.action === "create" && drawing) {
                            // get current mouse position
                            var currentX = pixelToUnit(event.offsetX);
                            var currentY = pixelToUnit(event.offsetY);
                            draw(centerX, centerY, currentX, currentY);
                        }
            });

            function drawBoxes (annos, restrict) {
                angular.forEach(annos, function (a) {
                    var pos = a.on.substr(a.on.indexOf("xywh=") + 5).split(",").map(function (a) {
                        return parseFloat(a);
                    });
                    var draw = true;
                    if (restrict) {
                        angular.forEach(restrict,function(v,k){
                           if(!a[k] || a[k] != v) { // loose comparision
                               draw = false;
                           }
                        });
                    }
                    if (draw) {
                        rect(pos[0], pos[1], pos[2], pos[3], '#F00');
                    }
                });
            };
            function annotationsAt (xy, collection) {
                var list = [];
                angular.forEach(collection, function (a) {
                    var pos = a.on.substr(a.on.indexOf("xywh=") + 5).split(",").map(function (a) {
                        return parseFloat(a);
                    });
                    if (pos[0] < xy[0] && (pos[0] + pos[2]) > xy[0]
                        && pos[1] < xy[1] && (pos[1] + pos[3]) > xy[1]) {
                        list.push(a);
                    }
                });
                return list;
            };
            element.bind('click', function (event) {
                var xTap = pixelToUnit(event.offsetX);
                var yTap = pixelToUnit(event.offsetY);
                var l = drawBoxService.activeList;
                var boxes = annotationsAt([xTap, yTap], l.resources);
                if (boxes.length === 0) {
                    return false;
                }
                switch (drawBoxService.action) {
                    case "select":
                        if (boxes) {
                            drawBoxes(boxes);
                        }
                        break;
                    case "destroy":
                        if (boxes.length === 1) {
                            l.resources.splice(l.resources.indexOf(boxes[0]), 1);
                            $rootScope.$broadcast('destroy-annotation');
                        } else {
                            alert("Multiple selection not allowed yet.");
                            // TODO: disambiguate selection
                        }
                        break;
                }
            });

            element.bind('mouseup', function (event) {
                // stop drawing
                drawing = false;

                // let the view know there is a new box
                scope.$apply();
            });

            // canvas reset
            function reset () {
                // Does not work because beginPath() is not recalled.
                // ctx.clearRect(0, 0, element[0].width, element[0].height);
                element[0].width = element[0].width;
            }
            function draw (startX, startY, currentX, currentY) {
                reset();
                var sizeX = currentX - startX;
                var sizeY = currentY - startY;
                drawBoxService.newBox = [startX, startY, sizeX, sizeY].join(",");
                rect(startX, startY, sizeX, sizeY);
            }
            element.bind('mousedown', function (event) {
                centerX = pixelToUnit(event.offsetX);
                centerY = pixelToUnit(event.offsetY);
                switch (drawBoxService.action) {
                    case "create":
                        // begins new line
                        ctx.beginPath();

                        drawing = true;
                        break;
                    case "destroy": // confirm delete
                        break;
                    case "select": // pick out an annotation
                        break;
                }
                scope.canvasElement = document.getElementById('parseImage').children[1];
                element.attr({
                    width: scope.canvasElement.width,
                    height: scope.canvasElement.height
                });
            });
            scope.$on('create-annotation', reset);
            scope.$on('destroy-annotation', reset);
            scope.$on('view-canvas', reset);
        },
        controller: 'drawBoxController'
    };
});
            rerum.service('drawBoxService', function (config) {
    this.newBox = "";
    this.canvas = config.currentCanvas;
    this.activeList = {};
    this.restrictMotivations = false;
});
            rerum.controller('drawBoxController', function ($scope, parsingService, drawBoxService) {
    $scope.dbs = drawBoxService;
    $scope.saveAnnotation = function () {
        var pos = drawBoxService.newBox.split(",").map(function (a) {
            return parseFloat(a);
        });
        // allow reverse direction rectangling
        if (pos[2] < 0) {
            pos[0] += pos[2];
            pos[2] = -pos[2];
        }
        if (pos[3] < 0) {
            pos[1] += pos[3];
            pos[3] = -pos[3];
        }
        parsingService.saveAnnotation(pos.join(","), $scope.canvas || drawBoxService.canvas);
        drawBoxService.newBox = {};
    };
    drawBoxService.action = ""; // select, destroy
    if (!drawBoxService.activeList['@id']) {
        drawBoxService.activeList = drawBoxService.canvas.otherContent[0];
    }
});