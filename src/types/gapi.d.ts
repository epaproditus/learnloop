import { GoogleClassroomCourse, GoogleClassroomAssignment, GoogleClassroomSubmission } from "./google-classroom";

declare global {
  interface Window {
    gapi: {
      client: {
        classroom: {
          courses: {
            list: (params: { pageSize: number, courseStates: string[] }) => Promise<{ result: { courses: GoogleClassroomCourse[] } }>;
          };
          courseWork: {
            create: (params: { courseId: string, resource: { courseId: string, title: string, description: string, maxPoints: number, workType: string, state: string, materials: { link: { url: string, title: string } }[] } }) => Promise<{ result: GoogleClassroomAssignment }>;
            studentSubmissions: {
              list: (params: { courseId: string, courseWorkId: string }) => Promise<{ result: { studentSubmissions: GoogleClassroomSubmission[] } }>;
              patch: (params: { courseId: string, courseWorkId: string, id: string, updateMask: string, resource: { assignedGrade: number, draftGrade: number } }) => Promise<void>;
            };
          };
        };
      };
    };
  }
}

export {};
