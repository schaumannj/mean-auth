angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http', '$cookies',
  function ($q, $timeout, $http, $cookies) {

    // create user variable
    var user = null;
    if($cookies.get('token')){
        $http.defaults.headers.common.Authorization = $cookies.get('token');
    }

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      return $http.get('/user/status')
          // handle success
          .success(function (data) {
            if(data.status){
              user = true;
            } else {
              user = false;
            }
          })
          // handle error
          .error(function (data) {
            user = false;
          });
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            console.info('get hash', data.hash)
            user = true;
            $cookies.put('token', data.hash)
            $http.defaults.headers.common.Authorization = data.hash;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .success(function (data) {
          user = false;
          $cookies.remove('token');
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }
}]);