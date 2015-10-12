/* global angular, rerum */

rerum.config(['$routeProvider',
    function ($routeProvider, $locationProvider, Edition) {
        $routeProvider
            .when('/edit', {
                templateUrl: 'app/tools/editManifest.html',
                controller: 'buildManifestController',
                resolve: {
                    context: function (Context) {
                        return Context.getJSON.success(function (c) {
                            // cached for later consumption
                        });
                    },
                    obj: function(Knowns){
                        return Knowns.obj;
                        // TODO: preload a known manifest from the URL or memory
                    }
                }
            })
            .when('/build', {
                templateUrl: 'app/tools/manifestFromImages.html',
                controller: 'buildManifestController',
                resolve: {
                    context: function (Context) {
                        return Context.getJSON.success(function (c) {
                            // cached for later consumption
                        });
                    },
                    obj: function(){return false;}
                }
            });
    }]);

rerum.service('Context', function ($http, $q) {
    var self = this;
    var url = 'http://iiif.io/api/presentation/2/context.json';
    this.getJSON = $http.get(url, {cache: true}).success(function (c) {
        self.json = c['@context'][0];
    });
});
rerum.value('Knowns',{
    obj : {
//        "@id": "",
        "@context": "http://iiif.io/api/presentation/2/context.json",
        "@type": "sc:Manifest",
        "label": "",
        "resources": [],
        "metadata":[],
        "sequences": [{
                "@id": "normal sequence",
                "@type": "sc:Sequence",
                "canvases": []
            }]
    },
    types: ['number', 'string', 'memo', 'list', 'object', 'canvas'],
    adding : {
        sequences: {
            item: 'sequences',
            single: 'sequence',
            init: {
                '@id':"",
                '@type':"sc:Sequence",
                label:"unlabeled",
                viewingDirection:"left-to-right",
                viewingHint:"paged",
                canvases:[]
            }
        },
        resources: {
            item: 'resources',
            single: 'resource',
            init: {
                '@id':"",
                '@type':"oa:Annotation",
                motivation:"",
                on:""
            },
            build: function(item,parent){
                item.on = parent['@id'];
                return item;
            }
        },
        collections: {},
        manifests: {},
        canvases: {
            item: 'canvases',
            single: 'canvas',
            init: {
                '@id':"",
                '@type':"sc:Canvas",
                label:"",
                height:undefined,
                width:undefined,
                images:[]
            }
        },
        images: {
            item: 'image annotations',
            single: 'image annotation',
            init: {
                '@id':"",
                '@type':"oa:Annotation",
                motivation:"sc:painting",
                resource:{
                    '@id':"",
                    '@type':"dctypes:Image",
                    format:"unknown",
                    service:{},
                    height:undefined,
                    width:undefined
                },
                on:""
            },
            build: function(item,parent){
                item.on = parent['@id'];
                return item;
            }
        },
        otherContent: {
            item: 'lists',
            single: 'list',
            init: {
                '@id':"",
                '@type':"sc:AnnotationList",
                label:"",
                resources:[]
            }
        },
        structures: {
            item: 'structures',
            single: 'structure',
            init: {
                '@id':"",
                '@type':"sc:Range",
                label:"",
                canvases:[]
            }
        },
        ranges: {
            item: 'ranges',
            single: 'range',
            init: {
                '@id':"",
                '@type':"sc:Range",
                label:"",
                canvases:[],
                within:""
            }
        },
        metadata: {
            item: 'metadata pairs',
            single: 'metadata pair',
            init: {
                label:"",
                '@value':""
            }
        }
    }
});

rerum.service('RERUM', function($http,$q){
    var self = this;
    this.resolve = function(uri){
        if(angular.isArray(uri)){
            return $q.all(uri.map(self.resolve));
        }
        return $http.get(uri)
            .success(function(res){
                return res;
            }).error(function(err){
                return err;
            });
    };
    this.save = function(obj){
        var url = obj['@id']
            ? "http://165.134.241.141/annotationstore/anno/updateAnnotation.action"
            : "http://165.134.241.141/annotationstore/anno/saveNewAnnotation.action";
//        var url = "api/res/"+obj['@id']; // live server test
        return $http.post(url, {content: obj});
    };
});

rerum.controller('buildManifestController', function ($scope, $modal, Context, Knowns, RERUM, obj) {
    Context.getJSON.success(function (c) {
        $scope.context = c['@context'][0];
    });
    $scope.obj = obj || Knowns.obj;
    $scope.types = Knowns.type;
    $scope.adding = Knowns.adding;
    $scope.cHeight = 1000;

    $scope.editList = function (parent,prop) {
        var self = this;
        var modal = $modal.open({
            templateUrl: 'app/tools/editList.html',
            size: 'lg',
            controller: function ($scope,Knowns,Context) {
                $scope.context = Context.json;
                $scope.list = parent[prop];
                $scope.parent = parent;
                $scope.prop = prop;
                $scope.adding = Knowns.adding;
                $scope.editList = self.editList; // what strange scope hath I wrought?
                $scope.addItem = function(item,parent,list,build){
                    var newItem = angular.copy(item) || {};
                    if(build){
                        build(newItem,parent);
                    }
                    list.push(newItem);
                };
            }
        });
    };

/**
 * create manifest from comma separated list of img urls
 **/
    $scope.loadImages = function (imgStr, height) {
        if (!$scope.cHeight) {
            $scope.cHeight = height;
        }
        $scope.msg = {
            type:"success",
            text:"That was easy! Looks like we did it."
        };
        $scope.canvases = imgStr.split(",").map(function(src){
            return {
                //src: src, // prevent digest by holding this in an unchanging prop
                height: height,
                images: [{
                        resource: {
                            '@id': src
                        }
                    }]
            };
        });
        Knowns.obj.label = "New Manifest";
        Knowns.obj.sequences[0].canvases = $scope.canvases;
        if(!$scope.canvases.length){
            $scope.msg = {
                type:"error",
                text:"The string didn't seem to have any content."
            };
        }
        $scope.imgStr = "";
    };

    $scope.defaultCanvas = function(index,event){
        var img = event.target;
        // {} to preserve original inits
        // .merge is EXPENSIVE! TODO: consider alternatives that don't know what is incoming
//        $scope.canvases[index] = angular.merge({}, $scope.adding.canvases.init, $scope.canvases[index]
//            , {
//            label: img.src.substring(img.src.lastIndexOf("/") + 1),
//            images: [{
//                    '@type': "oa:Annotation",
//                    motivation: "sc:painting",
//                    resource: {
//                        '@type': "dcTypes:Image",
//                        width: img.naturalWidth,
//                        height: img.naturalHeight
//                    }
////                    ,
////                    on:""
//                }],
//            width: (0.5 + $scope.cHeight * img.naturalWidth / img.naturalHeight) | 0,
//            height: $scope.cHeight
//        });
        var src = $scope.canvases[index].images[0].resource['@id'];
        $scope.canvases[index] = angular.extend({}, $scope.adding.canvases.init, $scope.canvases[index]
            , {
                label: img.src.substring(img.src.lastIndexOf("/") + 1),
                images: [{
                        '@type': "oa:Annotation",
                        motivation: "sc:painting",
                        resource: {
                            '@id': src,
                            '@type': "dcTypes:Image",
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        }
//                    ,
//                    on:""
                    }],
                width: (0.5 + $scope.cHeight * img.naturalWidth / img.naturalHeight) | 0,
                height: $scope.cHeight
            });
    };

    $scope.saveManifest = RERUM.save;
});

rerum.directive('ngLoad', function($parse){
        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['ngLoad']);
                return function(scope, element, attr) {
                element.on('load', function (event) {
                        scope.$apply(function() {
                        fn(scope, {$event: event});

                        });
                    });
                };

            }
        };

    });


rerum.directive('addProperty',function(){
    return {
        restrict: 'E',
        templateUrl:'app/tools/addProperty.html',
        scope: {
            obj:'='
        },
        controller: function($scope,Knowns){
            $scope.types = Knowns.types;
            $scope.newProp = "";
            $scope.newType = "string";
            $scope.addProp = function(prop,type){
                if(!$scope.obj.hasOwnProperty(prop)){
                    $scope.obj[prop]={
                        '@type':type,
                        '@value':undefined
                    };
                }
                $scope.newProp = "";
                $scope.newType = "string";
            };
        }
    };
});
rerum.directive('property', function ($compile) {
    var getTemplate = function (type, insert) {
        var tmpl = ['<div class="form-group">'
                + '<label class="{{labelClass}}" title="{{context[is][\'@id\']||context[is]}}"><span ng-show="context[is]">'
                + '<i class="fa fa-check"></i></span> {{is}}:</label>',
            null,
            insert,
            '</div>'];
        var input;
        switch (type) {
            case 'number' :
            case 'xsd:integer' :
                input = '<input type="number" min=0 step=1 ng-pattern="\'\d+\'" ng-model="for[is]">';
                break;
            case 'object' :
                input = '<ul ng-show="Object(for[is]).keys.length"><li ng-repeat="(k,v) in for[is]" ng-show="angular.isDefined(k)">'
                    + '<property for="for[is]" is="k"></property></li></ul>';
                break;
            case 'memo' :
                input = '<textarea ng-model="for[is]"></textarea>';
                break;
            case 'pairs' :
                input = '<button class="btn btn-xs btn-default" type="button" ng-click="editList(for,is)">'
                    + '<i class="fa fa-list-ol"></i> edit</button>'
                    + '<dl class="dl-horizontal"><dt title="{{item.label}}" ng-repeat-start="item in for[is]">{{item.label}}</dt>'
                    + '<dd ng-repeat-end>{{item["@value"]}}</dd></dl>';
                break;
            case '@list' :
            case 'list'  :
                input = '<button class="btn btn-xs btn-default" type="button" ng-click="editList(for,is)">'
                    + '<i class="fa fa-list-ol"></i> edit</button>'
                    + '<ol ng-show="for[is].length"><li ng-repeat="item in for[is]">'
                    + '{{item.label||item["@id"]||item["@value"]||item["@type"]||item}}</li></ol>';
                break;
            case 'image' :
                input = '[image placeholder]';
                break;
            case 'sound' :
                input = '[sound placeholder]';
                break;
            case 'video' :
                input = '[video placeholder]';
                break;
            case 'string' :
                input = '<input type="text" ng-model="for[is]">';
                break;
                // or display only
            default :
                input = '<span class="text-overflow">{{for[is]}}</span>'
        }
        ;
        tmpl[1] = '<div class="positioned">' + input + '<i></i></div>';
        return tmpl.join('');
    };
    var props = {
        "rdfs:label": 'string',
        'label': 'string',
        "dc:description": 'memo',
        '@id': 'string',
        '@type': 'string',
        '@value':'string',
        '@list': '@list',
        'xsd:integer': 'number',
        'exif:height': 'number',
        'exif:width': 'number',
        'dcTypes:Image': 'image'
    };

    var linker = function (scope, el, attrs) {
        var type = props[scope.for['@type']]
            || (scope.types.indexOf(scope.for[scope.is] && scope.for[scope.is]['@type']) > -1) && scope.for[scope.is]['@type']
            || (scope.context[scope.is] && scope.context[scope.is]['@container'])
            || angular.isObject(scope.is) && 'object'
            || angular.isObject(scope.for[scope.is]) && 'object'
            || (scope.context[scope.is] && scope.context[scope.is]['@type'])
            || (scope.context[scope.for[scope.is]] && scope.context[scope.for[scope.is]]['@type'])
            || props[scope.is]
            || props[scope.for[scope.is]]
            || 'unknown';
            if(type.indexOf('list')>-1){
                scope.$watchCollection('for[is]',function(newVal,oldVal){
                if (newVal && newVal.length) {
                        // maybe just a k-v pair setup, like metadata
                        if (angular.isDefined(scope.for[scope.is].length
                            && !scope.for[scope.is][0]['@id']
                            && scope.for[scope.is][0].label
                            && scope.for[scope.is][0]['@value'])) {
                            type = "pairs";
                        }
                        el.html(getTemplate(type));
                        $compile(el.contents())(scope);
                    }
                });
            }
        scope.labelClass = attrs.labelClass;
        if (scope.is === '@id' && scope.for['@type'] === 'sc:Canvas') {
            var insert = '<figure class="pull-right">'
                + '<figcaption>{{::for.label.substring(0,10)||"no label"}}</figcaption>'
                + '<img ng-src="{{::for.images[0].resource[\'@id\']||for.images[0]}}" ng-load="defaultCanvas($index,$event)">'
                + '</figure>';
        }
        el.html(getTemplate(type, insert)); //.show();
        $compile(el.contents())(scope);
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
            is: '=',
            for : '='
        },
        controller: function ($scope, Context, Knowns) {
            $scope.types = Knowns.types;
            $scope.context = Context.json || Context.getJSON.success(function (c) {
                $scope.context = c['@context'][0];
            });
            if (!$scope.editList) {
                $scope.editList = $scope.$parent.editList;
            }
        }
    };
});