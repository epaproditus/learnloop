export interface GoogleClassroomCourse {
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

export interface GoogleClassroomAssignment {
  courseId: string;
  id: string;
  title: string;
  description?: string;
  materials?: GoogleClassroomMaterial[];
  maxPoints?: number;
  workType: "ASSIGNMENT" | "SHORT_ANSWER_QUESTION" | "MULTIPLE_CHOICE_QUESTION";
  state: "PUBLISHED" | "DRAFT" | "DELETED";
  alternateLink: string;
  creationTime: string;
  updateTime: string;
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
  dueTime?: {
    hours: number;
    minutes: number;
  };
  scheduledTime?: string;
  creatorUserId: string;
  topicId?: string;
}

export interface GoogleClassroomMaterial {
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

export interface GoogleClassroomSubmission {
  courseId: string;
  courseWorkId: string;
  id: string;
  userId: string;
  creationTime: string;
  updateTime: string;
  state: "CREATED" | "TURNED_IN" | "RETURNED" | "RECLAIMED_BY_STUDENT";
  assignedGrade?: number;
  alternateLink?: string;
  courseWorkType?: string;
  associatedWithDeveloper?: boolean;
  submissionHistory?: {
    stateHistory?: {
      state: string;
      stateTimestamp: string;
      actorUserId: string;
    };
    gradeHistory?: {
      maxPoints: number;
      gradeTimestamp: string;
      actorUserId: string;
      gradeChangeType: string;
    };
  }[];
}
