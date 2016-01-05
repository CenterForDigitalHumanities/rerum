rerum.directive('drawBox', function (drawBoxService, $compile, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        template: '<canvas id="drawingLayer"></canvas>',
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

            // variable that decides if something should be drawn on mousemove
            var drawing = false;
            var moving = false;

            // the last coordinates before the current move
            var centerX;
            var centerY;
            var aX, aY; // pixel record for moving

            // canvas unit to pixels
            function pixelToUnit (px) {
                return px * (element.attr('width') / element[0].clientWidth);
            }
            function rect (x, y, w, h, color, width, fillStyle, filter) {
                ctx.rect(x, y, w, h);
                ctx.lineWidth = width || 3;
                // color
                ctx.strokeStyle = color || '#fff';
                ctx.fillStyle = fillStyle || 'transparent';
                // filter
                if (filter)
                    ctx.globalCompositeOperation = filter;
                // draw it
                ctx.stroke();
                ctx.fill();
            }
            element.bind('mousemove', function (event) {
                if (moving) {
                    var container = document.getElementById('canvasContainer');
                    container.scrollLeft += aX - event.offsetX;
                    container.scrollTop += aY - event.offsetY;
                } else if (drawBoxService.action === "create" && drawing) {
                    clearTools();
                    // get current mouse position
                    var currentX = pixelToUnit(event.offsetX);
                    var currentY = pixelToUnit(event.offsetY);
                    draw(centerX, centerY, currentX, currentY);
                } else if (drawBoxService.action === "crop" && drawing) {
                    var currentX = pixelToUnit(event.offsetX);
                    var currentY = pixelToUnit(event.offsetY);
                    reset();
                    var w = currentX - centerX;
                    var h = currentY - centerY;
                    if (w * w < 100) {
                        w = 10;
                    }
                    if (h * h < 100) {
                        h = 10;
                    }
                    drawBoxService.newBox = [centerX, centerY, w, h].join(",");
                    rect(0, 0, element[0].width, element[0].height, null, null, 'rgba(0,0,0,.30)');
                    ctx.beginPath();
                    rect(centerX, centerY, w, h, null, 0, '#000', 'destination-out');
                }
            });

            function drawBoxes (annos, restrict, then) {
                angular.forEach(annos, function (a, multiple) {
                    var pos = a.on.substr(a.on.indexOf("xywh=") + 5).split(",").map(function (a) {
                        return parseFloat(a);
                    });
                    var draw = true;
                    if (restrict) {
                        angular.forEach(restrict, function (v, k) {
                            if (!a[k] || a[k] != v) { // loose comparision
                                draw = false;
                            }
                        });
                    }
                    if (draw) {
                        rect(pos[0], pos[1], pos[2], pos[3], '#F00');
                    }
                    if (then) {
                        then(pos, multiple);
                    }
                });
            }
            ;
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
            }
            ;
            element.bind('click', function (event, overEvent) {
                if (overEvent)
                    event = overEvent;
                var xTap = pixelToUnit(event.offsetX);
                var yTap = pixelToUnit(event.offsetY);
                var l = drawBoxService.activeList;
                if (!l) {
                    return;
                }
                var boxes = annotationsAt([xTap, yTap], l.resources);
                if (boxes.length === 0) {
                    if (!drawBoxService.newBox.length)
                        clearTools();
                    return false;
                }
                switch (drawBoxService.action) {
                    case "select":
                        drawBoxService.newBox = "";
                        if (boxes) {
                            drawBoxes(boxes, drawBoxService.restrictMotivations, addTools);
                        }
                        break;
                    case "destroy":
                        if (boxes.length === 1) {
                            l.resources.splice(l.resources.indexOf(boxes[0]), 1);
                            clearTools();
                            $rootScope.$broadcast('destroy-annotation');
                        } else {
                            drawBoxService.action = "select";
                            element.triggerHandler("click", event);
                            drawBoxService.action = "destroy";
                        }
                        break;
                }
            });
            scope.deleteAnno = function (box) {
                if (box) {
                    var l = drawBoxService.activeList;
                    l.resources.splice(l.resources.indexOf(box), 1);
                } else {
                    drawBoxService.newBox = "";
                }
                $rootScope.$broadcast('destroy-annotation');
                clearTools();
            };
            element.bind('mouseup', function (event) {
                // stop drawing
                if (drawing) {
                    addTools([centerX, centerY]);
                    drawing = false;
                }
                moving = false;
                element.removeClass("grabbing");

                // let the view know there is a new box
                scope.$apply();
            });
            scope.$watch('dbs.action', function (n, o) {
                if (n !== o) {
                    clearTools();
                }
            });
            function clearTools () {
                angular.element(document.getElementsByClassName('parse-toolbar')).remove();
            }
            function addTools (pos, multiple) {
                if (!multiple) {
                    clearTools();
                }
                var box;
                if (!angular.isArray(pos) && box.on) {
                    box = pos;
                    pos = box.on.split(",").map(function (a) {
                        return parseFloat(a);
                    });
                }
                var toolbar = document.createElement('div');
                var $t = angular.element(toolbar).addClass("parse-toolbar");
                if (drawBoxService.newBox.length) {
                    $t.append('<button ng-click="saveAnno()" class="btn btn-primary btn-xs"><i class="fa fa-save"></i></button>');
                }
                $t.append('<button ng-click="deleteAnno(' + box + ')" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>')
                    .css({
                        position: "absolute",
                        left: pos[0] / scope.canvas.width * 100 + "%",
                        top: pos[1] / scope.canvas.height * 100 + "%"
                    });
                angular.element(document.getElementById('drawingLayer')).after($compile(toolbar)(scope));
            }
            // canvas reset
            function reset () {
                // Does not work because beginPath() is not recalled.
                // ctx.clearRect(0, 0, element[0].width, element[0].height);
                element[0].width = element[0].width;
            }
            function draw (startX, startY, currentX, currentY) {
                reset();
                var w = currentX - startX;
                var h = currentY - startY;
                if (w * w < 100) {
                    w = 10;
                }
                if (h * h < 100) {
                    h = 10;
                }
                drawBoxService.newBox = [startX, startY, w, h].join(",");
                rect(startX, startY, w, h, 'rgba(255, 255, 0, .25)');
            }
            element.bind('mousedown', function (event) {
                centerX = pixelToUnit(event.offsetX);
                centerY = pixelToUnit(event.offsetY);
                switch (drawBoxService.action) {
                    case "create":
                    case "crop":
                    case "resize":
                        // begins new line
                        ctx.beginPath();
                        drawing = true;
                        break;
                    case "destroy": // confirm delete
                        break;
                    case "select": // pick out an annotation
                    default : // move image
                        aX = event.offsetX;
                        aY = event.offsetY;
                        moving = true;
                        element.addClass("grabbing");
                }
                scope.canvasElement = document.getElementById('canvasImage').children[1];
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
rerum.controller('drawBoxController', function ($scope, parsingService,cropService, drawBoxService, hotkeys) {
    $scope.dbs = drawBoxService;
    $scope.saveAnno = function () {
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
        switch(drawBoxService.action){
            case "crop" :
                cropService.refit(pos.join(","), drawBoxService.activeImage);
                break;
            default : // save newBox as Annotation
                parsingService.saveAnnotation(pos.join(","), $scope.canvas || drawBoxService.canvas);
        }
        // TODO: on success
        drawBoxService.newBox = "";
        angular.element(document.getElementsByClassName('parse-toolbar')).remove(); // clearTools()
    };
    drawBoxService.action = ""; // select, destroy
    if (!drawBoxService.pinch) {
        drawBoxService.pinch = 0;
    }
    $scope.rePinch = function (i) {
        // TODO: keep centered on mouse when zooming
        drawBoxService.pinch -= i * 10;
        if (drawBoxService.pinch > 90) {
            drawBoxService.pinch = 90;
        } else if (drawBoxService.pinch < -200) {
            drawBoxService.pinch = -200;
        }
    };
    hotkeys.add({
        combo: 'ctrl+up',
        description: 'Push In',
        callback: function () {
            $scope.rePinch(5);
        }
    });
    hotkeys.add({
        combo: 'ctrl+down',
        description: 'Pull Out',
        callback: function () {
            $scope.rePinch(-5);
        }
    });

    if (!drawBoxService.activeList['@id'] && drawBoxService.canvas.otherContent) {
        drawBoxService.activeList = drawBoxService.canvas.otherContent[0];
    }
});

rerum.directive('ngMousewheelUp', function () {
    return function (scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function (event) {
            // cross-browser wheel delta
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            if (delta > 0) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngMousewheelUp);
                });
                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if (event.preventDefault) {
                    event.preventDefault();
                }

            }
        });
    };
});

rerum.directive('ngMousewheelDown', function () {
    return function (scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function (event) {
            // cross-browser wheel delta
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            if (delta < 0) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngMousewheelDown);
                });
                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if (event.preventDefault) {
                    event.preventDefault();
                }

            }
        });
    };
});
rerum.directive('focusOn', function () {
    return {
        link: function (scope, element, attrs) {
            setTimeout(function () {
                element[0].focus();
            }, 0);
        }
    };
});
