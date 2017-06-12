/* global angular, rerum */

/* This is here to make it modular.  It connects to app.js routeProvider */
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
                        return Knowns.manifest;
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
            })
            .when('/validate', {
                templateUrl: 'app/tools/validate.html',
                controller: 'validationController',
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
    manifest: {
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
                '@id': "",
                '@type': "sc:AnnotationList",
                label: "",
                resources: []
            }
        },
        sections: {
            item: 'sections',
            single: 'section',
            init: {
                '@id': "",
                '@type': "oa:Annotation",
                motivation: "rr:sectioning",
                on: ""
            },
            build: function (item, parent) {
                item.on = parent['@id'];
                return item;
            }
        },
        metadataResources: {
            item: 'resources',
            single: 'resource',
            init: {
                '@id': "",
                '@type': "oa:Annotation",
                motivation: "rr:describing",
                on: ""
            },
            build: function (item, parent) {
                item.on = parent['@id'];
                return item;
            }
        },
        footnotes: {
            item: 'footnotes',
            single: 'footnote',
            init: {
                '@id': "",
                '@type': "oa:Annotation",
                motivation: "",
                on: ""
            },
            build: function (item, parent) {
                item.on = parent['@id'];
                return item;
            }
        },
        endnotes: {
            item: 'endnotes',
            single: 'endnote',
            init: {
                '@id': "",
                '@type': "oa:Annotation",
                motivation: "",
                on: ""
            },
            build: function (item, parent) {
                item.on = parent['@id'];
                return item;
            }
        },
        indices: {
            item: 'indices',
            single: 'index',
            init: {
                '@id': "",
                '@type': "oa:Annotation",
                motivation: "",
                on: ""
            },
            build: function (item, parent) {
                item.on = parent['@id'];
                return item;
            }
        },
        comments: {
            item: 'comments',
            single: 'comment',
            init: {
                '@id': "",
                '@type': "oa:Annotation",
                motivation: "",
                on: ""
            },
            build: function (item, parent) {
                item.on = parent['@id'];
                return item;
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

rerum.controller('buildManifestController', function ($scope, $uibModal, Context, Knowns, rerumService, API_Service, obj) {
    Context.getJSON.success(function (c) {
        $scope.context = c['@context'][0];
    });
    $scope.obj = obj || Knowns.manifest;
    $scope.types = Knowns.type;
    $scope.adding = Knowns.adding;
    $scope.cHeight = 1000;
    $scope.mLabel = obj.label || "New RERUM Manifest";
    $scope.mCreator = {"label":"Manifest Creator", "value":"OngCDH@SLU_RERUM_"};
    $scope.previewManifest =  "";
    $scope.stillLocal = true;
    $scope.manifestID = "";
    $scope.imagesVisible = true;
    $scope.filManifest = "";
    $scope.jsonManifest = {"json":{}};
    $scope.uriManifest = {"@id" : ""};
    $scope.manifestValidated = false;
    $scope.contextvisible = false;

/*
 *   Edit already existing manifests
 */
    $scope.editList = function (parent,prop) {
        var self = this;
        var modal = $uibModal.open({
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

    /* varius validators */

    //Here, the input could be an object or a string.

    $scope.validIIIF = function(input){
        //hit the IIIF validator endpoint and return that result.  That could
        //this could maybe be a RERUM service in this app.
        return rerumService.validateIIIF(input);
    };

    $scope.validRerumManifest = function(input){
        //Hit an advanced internal RERUM viewer/validator ?
        return rerumService.validateRerumManifest(input);
    };
    
    $scope.validJSON = function(input){
        return rerumService.validateJSON(input);
    };

    $scope.validURI = function(input){
        return rerumService.validateURI(input);
    };

    /* End validators.  Check you don't repeat a rerumService */

    /* manifest gatherers */
    $scope.uploadManifestFile = function($fileContent){
        var file = $fileContent;
        if($scope.validJSONM(file)){
            $scope.fileManifest = JSON.parse(file);
            $scope.obj = $scope.fileManifest;
            $scope.manifestValidated = true;
            //Check if it is a RERUM manifest?
        }
        else{
            $scope.fileManifest = "";
            $scope.obj = Knowns.manifest;
        }
     };

    $scope.submitManifestURI = function(){
        var potentialURI = $scope.uriManifest["@id"];
        if($scope.validURI(potentialURI)){
            var potentialManifest = $scope.resolveURI(potentialURI);
            if($scope.validJSON(potentialManifest)){
                $scope.obj = JSON.parse(potentialManifest);
                $scope.manifestValidated = true;
                //Check if it is a RERUM manifest?
            }
            else{
                alert("URI resolved manifest is not valid JSON.  Please check for errors. ");
            }
        }
        else{
            alert("URI "+potentialURI+" was not valid");
            $scope.uriManifest = "";
            $scope.obj = Knowns.manifest;
        }
     };

    $scope.submitJSONManifest = function(){
        var potentialJSON = $scope.jsonManifest.json;
        if($scope.validJSON(potentialJSON)){
            $scope.obj = JSON.parse(potentialJSON);
            $scope.manifestValidated = true;
            //check if it is a rerum manifest?
        }
        else{
            alert("The manifest provided is not valid and cannot be used.  Fix the JSON errors and try again.");
            $scope.jsonManifest.json = {};
            $scope.obj = Knowns.manifest;
        }
     };

     /* End gatherers */

/* End Manifest Edit stuff */

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
        $scope.canvases = imgStr.split(",").map(function (src, index) {
            return {
                //src: src, // prevent digest by holding this in an unchanging prop
                label: "canvas " + index,
                "@id": "canvas " + index,
                height: height,
                images: [{
                        resource: {
                            '@id': src
                        }
                    }]
            };
        });
        Knowns.manifest.label = $scope.mLabel;
        Knowns.manifest.sequences[0].canvases = $scope.canvases;
        Knowns.manifest.metadata.push($scope.mCreator);
        if(!$scope.canvases.length){
            $scope.msg = {
                type:"error",
                text:"The string didn't seem to have any content."
            };
        }
        $scope.imgStr = "";
    };

    $scope.resolveURI = function(){
        return rerumService.resolveURI($scope.uriManifest["@id"]);
    };

    $scope.saveManifest = function(){

        var manifestToSave = $scope.obj; //This is the mainfest we have been manipulating in this $scope
        var savePromise = API_Service.save(manifestToSave); //Rerum service to $post into anno store
        //Cannot access success or fail from the save here.
            savePromise.success(function(data, status, headers, config){ //manifest saved
                var newID = data["@id"].split("/").pop();
                $scope.obj["@id"] = "http://object.rerum.io/" + newID;
                $scope.imagesVisible = false;
                //inform user of a successful save, have the UI react accordingly
            });
            savePromise.error(function(data, status, headers, config){ //maniest did not save
                $scope.imagesVisible = true;
                //inform user of an unseuccesful save, have the UI react accordingly
            });
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

    /* End Manifest Create stuff */

    $scope.preview = function(){
        $scope.previewManifest = JSON.stringify($scope.obj,null,4);
        $scope.imagesVisible = false;
    };

    $scope.closePreview = function(){
        $scope.previewManifest = "";
        $scope.imagesVisible = true;
    };

    $scope.showContext = function(){
       $scope.contextVisible = true;
     };

    $scope.hideContext = function(){
        $scope.contextVisible = false;
    };

});

rerum.controller('thumbsController', function ($scope, Display) {
   $scope.display = Display;
   $scope.getBoundaryTip = function (page) {
       if (!page.text || page.text.length === 0) {
           return false;
       }
       if ($scope.display['cache' + page.id + 'tip']) {
           return $scope.display['cache' + page.id + 'tip'];
       }
       var charin = 25;
       var charout = 15;
       var tip = (page.text.length > (charin + charout + 3))
           ? page.text.substr(0, charin) + "…<br><span class='text-right'>…" + page.text.substr(-charout) + "</span>"
           : page.text;
       $scope.display['cache' + page.id + 'tip'] = tip;
       return tip;
   };
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
        var tmpl = ['<div class="form-group clearfix">'
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
                input = '<textarea ng-if="for[is].hasOwnProperty(\'@value\')" ng-model="for[is][\'@value\']"></textarea>'
                    + '<textarea ng-if="!for[is].hasOwnProperty(\'@value\')" ng-model="for[is]"></textarea>';
                break;
            case 'pairs' :
                input = '<button class="btn btn-xs btn-default" type="button" ng-click="editList(for,is)">'
                    + '<i class="fa fa-list-ol"></i> edit</button>'
                    + '<dl class="dl-horizontal"><dt title="{{item.label}}" ng-repeat-start="item in for[is]">'
                    + '{{item.label||item["@id"]||item["@value"]||item["@type"]||item}}</dt>'
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
                input = '<input ng-if="for[is].hasOwnProperty(\'@value\')" type="text" ng-model="for[is][\'@value\']">'
                    + '<input ng-if="!for[is].hasOwnProperty(\'@value\')" type="text" ng-model="for[is]">';
                break;
                // or display only
            default :
                input = '<span class="text-overflow">{{for[is]}}</span>'
        };
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

rerum.directive('thumbsCanvas', function () {
   return {
       restrict: "EA",
       scope: {
           slides: '=',
           sortable: '='
       },
       replace: true,
       controller: "thumbsController",
       templateUrl: "app/thumbsCanvas.html"
   };
});

//  https://veamospues.wordpress.com/2014/01/27/reading-files-with-angularjs/
//  http://jsfiddle.net/alexsuch/6aG4x/535/
// Designed to work with $scope.uploadManifest() here, which works to control $fileManifest.  Perhaps this could be a rerumService.
rerum.directive('onReadFile', function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.onReadFile);
      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();
        reader.onload = function(onLoadEvent) {
          scope.$apply(function() {
            fn(scope, {$fileContent:onLoadEvent.target.result});
          });
        };
        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
});