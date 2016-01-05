/* global tpen, angular */

rerum.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
    $routeProvider
            .when('/crop/:canvasID', {
                templateUrl: 'app/tools/crop-page/cropping.html',
                controller: 'cropController',
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
rerum.service('cropService', function ($rootScope, drawBoxService) {
    var service = this;
    this.saveCrop = function (xywh, image) {
        var selector = image['@id'].lastIndexOf("#xywh=");
        image['@id'] = selector > -1
            ? image['@id'].substring(0, selector) + "#xywh=" + xywh
            : image['@id'] + "#xywh=" + xywh;
        // TODO: load image
        // evaluate dimensions for new width/height

        $rootScope.$broadcast("cropped-image");
        return "success"; // TODO: asych save
    };
    this.resizeCanvas = function (w, h, canvas) {
        canvas.width = w;
        canvas.height = h;
        $rootScope.$broadcast("resized-canvas");
        return "success"; // TODO: asych save
    };
    this.refit = function (pos, image, canvas) {
        this.saveCrop(pos, image.resource).then(function (img) {
            // receives the cropped image object
            var iw, ih, cw, ch;
            iw = img.naturalWidth;
            ih = img.naturalHeight;
            cw = canvas.width;
            ch = canvas.height;
            if (pos.indexOf)
                true;
                // TODO: evaluate if IIIF pre-cropped image is received

        }, function (err) {
            console.log(err);
        });
    };
});
rerum.controller('cropController', function ($scope, $rootScope, $uibModal, rerumService, Lists, config, Manifest, drawBoxService, hotkeys) {
    $scope.config = config;
    $scope.manifest = Manifest;
    rerumService.extractResources(Manifest);
    $scope.canvas = config.currentCanvas
        ? config.currentCanvas
        : Manifest.sequences[config.currentSequenceIndex].canvases[config.currentCanvasIndex];
    $rootScope.$broadcast('view-canvas');
    $scope.setAction = function (set) {
        drawBoxService.action = set === drawBoxService.action ? "" : set;
    };

    $rootScope.$on('change-canvas', function () {
        config.currentCanvas = $scope.canvas; // TODO: remove once the jump list is $location linked
        drawBoxService.activeImage = $scope.canvas.images && $scope.canvas.images[0];
    });
// REFACTOR FROM HERE

    /*
     *      ||
     *      ||
     *      ||
     *    \\||//
     *     \||/
     *      \/
     */

//
    $scope.hotkeys = hotkeys;
    hotkeys.add({
        combo: 'ctrl+`',
        description: 'Show Objects',
        callback: function () {
            $scope.dbs.showObject = !$scope.dbs.showObject;
        }
    });
});
