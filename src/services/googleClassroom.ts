import { Assignment } from "../types/Assignment";
import type { GoogleClassroomAssignment, GoogleClassroomCourse, GoogleClassroomSubmission } from "../types/google-classroom";

class GoogleClassroomService {
  private static instance: GoogleClassroomService;
  private isInitialized = false;
  private courses: GoogleClassroomCourse[] = [];

  private constructor() {}

  static getInstance(): GoogleClassroomService {
    if (!GoogleClassroomService.instance) {
      GoogleClassroomService.instance = new GoogleClassroomService();
    }
    return GoogleClassroomService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load the Google Classroom API client
      await this.loadGoogleClassroomAPI();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Google Classroom:", error);
      throw error;
    }
  }

  private async loadGoogleClassroomAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load the Google API client library
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        gapi.load("client:auth2", async () => {
          try {
            await gapi.client.init({
              apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
              clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              discoveryDocs: [
                "https://classroom.googleapis.com/$discovery/rest?version=v1",
              ],
              scope: [
                "https://www.googleapis.com/auth/classroom.courses.readonly",
                "https://www.googleapis.com/auth/classroom.coursework.students",
                "https://www.googleapis.com/auth/classroom.coursework.me",
                "https://www.googleapis.com/auth/classroom.rosters.readonly",
              ].join(" "),
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = () => reject(new Error("Failed to load Google API"));
      document.body.appendChild(script);
    });
  }

  async signIn(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    await gapi.auth2.getAuthInstance().signIn();
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) return;
    await gapi.auth2.getAuthInstance().signOut();
  }

  async getCourses(): Promise<GoogleClassroomCourse[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const response = await gapi.client.classroom.courses.list({
      pageSize: 100,
      courseStates: ["ACTIVE"],
    });

    this.courses = response.result.courses || [];
    return this.courses;
  }

  async publishAssignment(
    courseId: string,
    assignment: Assignment
  ): Promise<GoogleClassroomAssignment> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Convert our assignment format to Google Classroom format
    const courseWork = {
      courseId,
      title: assignment.title,
      description: assignment.description,
      maxPoints: assignment.max_points || 100,
      workType: "ASSIGNMENT",
      state: "PUBLISHED",
      materials: [
        {
          link: {
            url: `${window.location.origin}/student/assignment/${assignment.id}`,
            title: "Open Assignment",
          },
        },
      ],
    } as GoogleClassroomAssignment;

    const response = await gapi.client.classroom.courses.courseWork.create({
      courseId,
      resource: courseWork,
    });

    return response.result;
  }

  async getStudentSubmissions(
    courseId: string,
    assignmentId: string
  ): Promise<GoogleClassroomSubmission[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const response = await gapi.client.classroom.courses.courseWork.studentSubmissions.list({
      courseId,
      courseWorkId: assignmentId,
    });

    return response.result.studentSubmissions || [];
  }

  async updateAssignmentGrade(
    courseId: string,
    courseWorkId: string,
    studentId: string,
    grade: number
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    await gapi.client.classroom.courses.courseWork.studentSubmissions.patch({
      courseId,
      courseWorkId,
      id: studentId,
      updateMask: "assignedGrade,draftGrade",
      resource: {
        assignedGrade: grade,
        draftGrade: grade,
      },
    });
  }
}

// Export a singleton instance
export const googleClassroom = GoogleClassroomService.getInstance();
