rerum.config(['$routeProvider',
        function ($routeProvider, $locationProvider, Edition) {
            $routeProvider
                .when('/build', {
                    templateUrl: 'app/tools/buildManifest.html',
                    controller: 'buildManifestController',
                    resolve: {
                        context: function(Context){
                            return Context.getJSON.success(function(c){
                                // cached for later consumption
                            });
                        }
                    }
                });
            }]);

rerum.service('Context',function($http,$q){
    var self = this;
    var url = 'http://iiif.io/api/presentation/2/context.json';
    this.getJSON = $http.get(url,{cache:true}).success(function(c){
        self.json = c['@context'][0];
    });
});
rerum.controller('buildManifestController',function($scope,Context){
    Context.getJSON.success(function(c){
        $scope.context = c['@context'][0];
    });
$scope.obj={
    "@id": "new (save to mint a new URI)",
    "@context": "http://iiif.io/api/presentation/2/context.json",
    "@type": "sc:Manifest",
    "label": "",
    "resources": [],
    "sequences": [{
        "@id": "normal sequence",
        "@type": "sc:Sequence",
        "canvases": []
    }]
};
$scope.types = ['number','string','memo','list','object'];
});

rerum.directive('property',function($compile){
    var getTemplate = function(type){
        var tmpl = ['<div class="form-group">'
        +'<label title="{{context[is]}}">{{is}}:</label> <span ng-show="context[is]">'
        + '<i class="fa fa-check"></i></span>',
        null,
        '</div>'];
        var input;
        switch (type) {
            case 'number' : input = '<input type="number" ng-model="for[is]">'; 
                break;
            case 'object' : input = '<ul ng-show="for[is].length"><li ng-repeat="(k,v) in for[is]">'
            + '<property for="for[is]" is="k"></property><li></ul>';
                break;
            case 'memo' : input = '<textarea ng-model="for[is]"></textarea>';
                break;
            case '@list' : input = '<button class="btn btn-xs btn-default" type="button" ng-click="editProp(for[is])">edit</button>'
                + '<ul ng-show="for[is].length"><li ng-repeat="item in for[is]"><ul><li ng-repeat="(k,v) in item">'
                + '<property for="item" is="k"></property><li></ul><li></ul>';
                break;
            case 'image' : input = '[image placeholder]';
                break;
            case 'sound' : input = '[sound placeholder]';
                break;
            case 'video' : input = '[video placeholder]';
                break;
            case 'string' : input = '<input type="text" ng-model="for[is]">';
                break;
                // or display only
            default : input = '<span class="text-overflow">{{for[is]}}</span>'
        };
        tmpl[1]='<div class="positioned">'+input+'<i></i></div>';
        return tmpl.join('');
    };
    var linker = function(scope,el,attrs){
        var props = {
            "rdfs:label":'string',
            "dc:description":'memo',
            'sc:Sequence':'object',
            'sc:Canvas':'object',
            '@id':'string',
            '@type':'string',
            '@list':'@list',
            'xsd:integer':'number'
        };
        var type = (scope.context[scope.is]&&scope.context[scope.is]['@container'])
            || (scope.context[scope.is]&&scope.context[scope.is]['@type'])
            || (scope.context[scope.for[scope.is]]&&scope.context[scope.for[scope.is]]['@type'])
            || props[scope.is] 
            || 'unknown';
        el.html(getTemplate(type)); //.show();
        $compile(el.contents())(scope);
    };
    return {
        restrict:'E',
        link:linker,
        scope:{
            is:'=',
            for:'='
        },
        controller:function($scope,Context){
            $scope.context = Context.json || Context.getJSON.success(function(c){
                $scope.context = c['@context'][0];
            });
        }
    };
});