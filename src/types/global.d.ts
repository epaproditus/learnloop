// src/types/global.d.ts
import { GoogleAuth } from 'google-auth-library';

// Define the expected structure of the response
interface StudentSubmissionsListResponse {
  // Define the properties you expect in the response
  studentSubmissions: Array<{
    courseId: string;
    courseWorkId: string;
    userId: string;
    // other properties...
  }>;
}

declare global {
  interface Window {
    gapi: typeof gapi & {
      auth2: {
        getAuthInstance(): GoogleAuth & {
          isSignedIn: {
            get: () => boolean;
          };
        };
      };
      client: {
        classroom: {
          courses: {
            courseWork: {
              studentSubmissions: {
                list(params: { courseId: string; courseWorkId: string }): Promise<StudentSubmissionsListResponse>;
              };
            };
          };
        };
      };
    };
  }
}

export {}; // This ensures this is a module