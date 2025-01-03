declare namespace gapi {
  interface ClientConfig {
    apiKey: string;
    clientId: string;
    discoveryDocs: string[];
    scope: string;
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

declare interface GoogleClassroomCourse {
  id: string;
  name: string;
  section?: string;
  description?: string;
  room?: string;
  ownerId: string;
  creationTime: string;
  updateTime: string;
  enrollmentCode?: string;
  courseState: "ACTIVE" | "ARCHIVED" | "PROVISIONED" | "DECLINED";
  alternateLink: string;
  teacherGroupEmail: string;
  courseGroupEmail: string;
  guardiansEnabled: boolean;
  calendarId?: string;
}

declare interface GoogleClassroomMaterial {
  link?: {
    url: string;
    title: string;
  };
  driveFile?: {
    driveFile: {
      id: string;
      title: string;
    };
    shareMode: "VIEW" | "EDIT" | "STUDENT_COPY";
  };
  youtubeVideo?: {
    id: string;
    title: string;
    alternateLink: string;
    thumbnailUrl: string;
  };
  form?: {
    formUrl: string;
    title: string;
    thumbnailUrl: string;
  };
}

declare interface GoogleClassroomCourseWork {
  courseId: string;
  title: string;
  description?: string;
  materials?: GoogleClassroomMaterial[];
  maxPoints?: number;
  workType: "ASSIGNMENT" | "SHORT_ANSWER_QUESTION" | "MULTIPLE_CHOICE_QUESTION";
  state: "PUBLISHED" | "DRAFT" | "DELETED";
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
  dueTime?: {
    hours: number;
    minutes: number;
  };
}

declare interface GoogleClassroomAssignment extends GoogleClassroomCourseWork {
  id: string;
  creationTime: string;
  updateTime: string;
  alternateLink: string;
  creatorUserId: string;
  topicId?: string;
  scheduledTime?: string;
}

declare interface GoogleClassroomSubmission {
  courseId: string;
  courseWorkId: string;
  id: string;
  userId: string;
  creationTime: string;
  updateTime: string;
  state: "CREATED" | "TURNED_IN" | "RETURNED" | "RECLAIMED_BY_STUDENT";
  assignedGrade?: number;
  draftGrade?: number;
  late: boolean;
  assignmentSubmission?: {
    attachments: GoogleClassroomMaterial[];
  };
  shortAnswerSubmission?: {
    answer: string;
  };
  multipleChoiceSubmission?: {
    answer: string;
  };
}

declare interface Window {
  gapi: typeof gapi;
}
