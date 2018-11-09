function generateApiMock(method, data){
  return {
    "method": method,
    "response": {
      "data": {
        "success": true,
        "data": data || null,
      }
    }
  }
}

const errorResponse = {
  "data": {
    success: false,
    message: "fail",
  }
}

module.exports = {
  "data": {
    "mockCreated": {
      "id": "5be40349380a47002f437483",
      "url": "/api/status",
      "method": "get",
      "project_id": "5be139e9380a47002f437422",
      "description": "status dem", "mode": "{\n  \"status\": 0\n}", "parameters": null, "response_model": null
    },
    "projectCreated": {
      "id": "5be139e9380a47002f437422",
      "name": "mock",
      "url": "/app",
      "description": "mock demo"
    }
  },
  "route": {
    "login": "/api/u/login",
    "listProjects": "/api/project",
    "getMock": "/api/mock",
    "createMock": "/api/mock/create",
    "createProject": "/api/project/create",
    "updateMock": "/api/mock/update",
    "deleteMock": "/api/mock/delete",
    "deleteProject": "/api/project/delete"
  },
  "api": {
    "/api/project": generateApiMock('GET', {
      "project": {},
      "mocks": []
    }),
    "/api/mock": generateApiMock('GET', []),
    "/api/u/login": generateApiMock('POST', {
      "token": "mock_token",
      "user": "liuwill"
    }),
    "/api/project/create": generateApiMock('POST'),
    "/api/project/delete": generateApiMock('POST'),
    "/api/mock/delete": generateApiMock('POST'),
    "/api/mock/create": generateApiMock('POST'),
    "/api/mock/update": generateApiMock('POST'),
    "/api/error/post": {
      "method": "POST",
      "response": errorResponse,
    },
    "/api/error/get": {
      "method": "GET",
      "response": errorResponse,
    }
  }
}
