based on article http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.Wrp8aS5uY-V 

$ curl -H "Accept: application/json" -H \
"Content-type: application/json" -X POST \
-d '{"username": "test@test.com", "password": "test"}' \
http://localhost:3000/user/register