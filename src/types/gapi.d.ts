// gapi.d.ts
declare namespace gapi {
  interface ClientConfig {
    apiKey: string;
    clientId: string;
    discoveryDocs: string[];
    scope: string;
  }

  interface GoogleClassroomCourseWork {
    courseId: string;
    title: string;
    description: string;
    maxPoints: number;
    workType: string;
    state: string;
    materials: { link: { url: string; title: string } }[];
  }
  interface Client {
    init(config: ClientConfig): Promise<void>;
        classroom: {
          courses: {
        list(params: { pageSize: number; courseStates: string[] }): Promise<{
          result: {
            courses: GoogleClassroomCourse[];
            };
        }>;
        };
      courseWork: {
        create(params: {
          courseId: string;
          resource: GoogleClassroomCourseWork;
        }): Promise<{
          result: GoogleClassroomAssignment;
        }>;
        studentSubmissions: {
          list(params: {
            courseId: string;
            courseWorkId: string;
          }): Promise<{
            result: {
              studentSubmissions: GoogleClassroomSubmission[];
    };
          }>;
          patch(params: {
            courseId: string;
            courseWorkId: string;
            id: string;
            updateMask: string;
            resource: {
              assignedGrade: number;
              draftGrade: number;
            };
          }): Promise<void>;
        };
      };
    };
  }

  interface Auth2 {
    getAuthInstance(): {
      signIn(): Promise<void>;
      signOut(): Promise<void>;
    };
}

  const client: Client;
  const auth2: Auth2;

  function load(
    service: string,
    callback: () => void | Promise<void>
  ): void;
}

declare global {
  interface Window {
    gapi: typeof gapi;
  }
}

export {};
