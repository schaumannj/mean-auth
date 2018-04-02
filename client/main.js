var myApp = angular.module('myApp', ['ngRoute', 'ngCookies']);

myApp.config(function ($routeProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        access: {restricted: true}
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginController',
        access: {restricted: false}
      })
      .when('/logout', {
        controller: 'logoutController',
        access: {restricted: true}
      })
      .when('/one', {
        template: '<h1>This is page one!</h1>',
        access: {restricted: true}
      })
      .when('/two', {
        template: '<h1>This is page two!</h1>',
        access: {restricted: false}
      })
      .otherwise({
        redirectTo: '/'
      });
});
myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
      function (event, next, current) {
        AuthService.getUserStatus()
            .then(function(){
              if (next.access.restricted && !AuthService.isLoggedIn()){
                $location.path('/login');
                $route.reload();
              }
            });
      });
});

//myApp.run(function ($rootScope, $location, $route, AuthService) {
//  $rootScope.$on('$routeChangeStart',
//      function (event, next, current) {
//        if (AuthService.isLoggedIn() === false) {
//          $location.path('/login');
//        }
//      });
//});