# API Services Documentation

This directory contains all API services organized in a modular and scalable architecture.

## Structure

```
api/
├── config.js                    # API configuration and endpoints
├── client.js                    # Axios client with interceptors
├── index.js                     # Main export file
├── services/
│   ├── authService.js          # Authentication endpoints
│   ├── documentService.js      # Document management endpoints
│   ├── lobService.js           # Line of Business endpoints
│   ├── productService.js       # Product endpoints
│   ├── sectionService.js       # Section endpoints
│   ├── questionService.js      # FAQ/Question endpoints
│   └── catalogService.js       # Catalog endpoints
└── README.md                    # This file
```

## Usage Examples

### Basic Import and Usage

```javascript
import { authService, documentService } from "@/api";

// Login example
const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: "user@example.com",
      password: "password123",
    });
    console.log("Login successful:", response);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Get documents example
const fetchDocuments = async () => {
  try {
    const documents = await documentService.getAll({
      PageNumber: 1,
      PageSize: 10,
    });
    console.log("Documents:", documents);
  } catch (error) {
    console.error("Failed to fetch documents:", error);
  }
};
```

### Using in React Components

```javascript
import React, { useState, useEffect } from "react";
import { lobService } from "@/api";

const LOBList = () => {
  const [lobs, setLobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLOBs = async () => {
      try {
        setLoading(true);
        const data = await lobService.getAll({
          IsActive: true,
          PageNumber: 1,
          PageSize: 20,
        });
        setLobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLOBs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {lobs.map((lob) => (
        <div key={lob.id}>{lob.name}</div>
      ))}
    </div>
  );
};
```

### File Upload Example

```javascript
import { documentService } from "@/api";

const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append("File", file);
  formData.append("Description", "Document description");
  formData.append("EntityType", "1");
  formData.append("UploadedByName", "John Doe");
  formData.append("IsPublic", "true");
  formData.append("Tags", "tag1,tag2");

  try {
    const response = await documentService.create(formData);
    console.log("Upload successful:", response);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Authentication Check

```javascript
import { authService } from "@/api";

// Check if user is authenticated
if (authService.isAuthenticated()) {
  console.log("User is logged in");
  const userData = authService.getUserData();
  console.log("User data:", userData);
} else {
  console.log("User is not logged in");
}
```

## Adding New Endpoints

### Step 1: Add endpoint to config.js

```javascript
// In config.js, add to API_CONFIG.ENDPOINTS
NEW_SERVICE: {
  GET_ALL: '/new-service/getall',
  CREATE: '/new-service/create',
  GET_BY_ID: (id) => `/new-service/${id}`,
  UPDATE: '/new-service/update',
  DELETE: (id) => `/new-service/${id}`,
}
```

### Step 2: Create service file

Create `src/api/services/newService.js`:

```javascript
import apiClient from "../client";
import { API_CONFIG } from "../config";

const newService = {
  getAll: async (params) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.NEW_SERVICE.GET_ALL, params);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.NEW_SERVICE.CREATE, data);
    return response.data;
  },

  // Add more methods as needed
};

export default newService;
```

### Step 3: Export in index.js

```javascript
// In index.js
import newService from "./services/newService";

export { newService };

// Update default export
export default {
  // ... existing services
  newService,
};
```

## Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:5226/api
```

For production:

```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

## Error Handling

The API client automatically handles:

- 401 Unauthorized: Clears token and redirects to login
- 403 Forbidden: Logs access denied
- 404 Not Found: Logs resource not found
- 500 Server Error: Logs server error
- Network errors: Provides user-friendly message

You can handle errors in your components:

```javascript
try {
  const data = await authService.login(credentials);
} catch (error) {
  // error.message contains the error message
  // error.status contains the HTTP status code (if available)
  console.error("Error:", error);
}
```

## Authentication Token

The authentication token is automatically:

- Stored in localStorage on successful login
- Attached to all API requests via interceptor
- Removed on logout or 401 errors

## Best Practices

1. **Always handle errors**: Use try-catch blocks
2. **Use async/await**: For cleaner asynchronous code
3. **Loading states**: Show loading indicators during API calls
4. **Validation**: Validate data before sending to API
5. **Don't store sensitive data**: Use the provided storage utilities
6. **Environment variables**: Use different API URLs for dev/prod
7. **Type safety**: Consider adding TypeScript for better type checking

## Testing

Example test setup (using Jest):

```javascript
import { authService } from "@/api";

jest.mock("@/api/client");

describe("authService", () => {
  it("should login successfully", async () => {
    const mockData = { token: "abc123" };
    apiClient.post.mockResolvedValue({ data: mockData });

    const result = await authService.login({
      email: "test@test.com",
      password: "password",
    });

    expect(result).toEqual(mockData);
  });
});
```

## Support

For questions or issues, please refer to the API documentation or contact the backend team.
