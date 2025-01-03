"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleClassroom = void 0;
var GoogleClassroomService = /** @class */ (function () {
    function GoogleClassroomService() {
        this.isInitialized = false;
        this.courses = [];
    }
    GoogleClassroomService.getInstance = function () {
        if (!GoogleClassroomService.instance) {
            GoogleClassroomService.instance = new GoogleClassroomService();
        }
        return GoogleClassroomService.instance;
    };
    GoogleClassroomService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isInitialized)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('Initializing Google Classroom API...');
                        return [4 /*yield*/, this.loadGoogleClassroomAPI()];
                    case 2:
                        _a.sent();
                        this.isInitialized = true;
                        console.log('Google Classroom API initialized successfully');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Failed to initialize Google Classroom:", error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GoogleClassroomService.prototype.loadGoogleClassroomAPI = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        console.log('Loading Google API client...');
                        var script = document.createElement("script");
                        script.src = "https://apis.google.com/js/api.js";
                        script.onload = function () {
                            console.log('Google API client loaded, initializing...');
                            window.gapi.load("client:auth2", {
                                callback: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var error_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, window.gapi.client.init({
                                                        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
                                                        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                                                        discoveryDocs: [
                                                            "https://classroom.googleapis.com/$discovery/rest?version=v1",
                                                        ],
                                                        scope: [
                                                            "https://www.googleapis.com/auth/classroom.courses.readonly",
                                                            "https://www.googleapis.com/auth/classroom.coursework.students",
                                                            "https://www.googleapis.com/auth/classroom.rosters.readonly",
                                                        ].join(" "),
                                                    })];
                                            case 1:
                                                _a.sent();
                                                console.log('Google API client initialized successfully');
                                                resolve();
                                                return [3 /*break*/, 3];
                                            case 2:
                                                error_2 = _a.sent();
                                                console.error('Failed to initialize Google API client:', error_2);
                                                reject(error_2);
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); },
                                onerror: function (error) {
                                    console.error('Failed to load Google API client:', error);
                                    reject(error);
                                }
                            });
                        };
                        script.onerror = function (error) {
                            console.error('Failed to load Google API script');
                            reject(new Error("Failed to load Google API"));
                        };
                        document.body.appendChild(script);
                    })];
            });
        });
    };
    GoogleClassroomService.prototype.signIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isInitialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        console.log('Signing in to Google...');
                        return [4 /*yield*/, window.gapi.auth2.getAuthInstance().signIn()];
                    case 3:
                        _a.sent();
                        console.log('Successfully signed in to Google');
                        return [2 /*return*/];
                }
            });
        });
    };
    GoogleClassroomService.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isInitialized)
                            return [2 /*return*/];
                        return [4 /*yield*/, window.gapi.auth2.getAuthInstance().signOut()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GoogleClassroomService.prototype.getCourses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var auth, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isInitialized) return [3 /*break*/, 2];
                        console.log('Initializing before getting courses...');
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        console.log('Fetching courses from Google Classroom...');
                        auth = window.gapi.auth2.getAuthInstance();
                        if (!!auth.isSignedIn.get()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.signIn()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, window.gapi.client.classroom.courses.list({
                            pageSize: 100,
                            courseStates: ["ACTIVE"],
                        })];
                    case 5:
                        response = _a.sent();
                        this.courses = response.result.courses || [];
                        console.log('Fetched courses:', this.courses);
                        return [2 /*return*/, this.courses];
                    case 6:
                        error_3 = _a.sent();
                        console.error('Error fetching courses:', error_3);
                        throw error_3;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    GoogleClassroomService.prototype.publishAssignment = function (courseId, assignment) {
        return __awaiter(this, void 0, void 0, function () {
            var auth, courseWork, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isInitialized) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        auth = window.gapi.auth2.getAuthInstance();
                        if (!!auth.isSignedIn.get()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.signIn()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        courseWork = {
                            courseId: courseId,
                            title: assignment.title,
                            description: assignment.description,
                            maxPoints: assignment.max_points || 100,
                            workType: "ASSIGNMENT",
                            state: "PUBLISHED",
                            materials: [
                                {
                                    link: {
                                        url: "".concat(window.location.origin, "/student/assignment/").concat(assignment.id),
                                        title: "Open Assignment",
                                    },
                                },
                            ],
                        };
                        return [4 /*yield*/, window.gapi.client.classroom.courses.courseWork.create({
                                courseId: courseId,
                                resource: courseWork,
                            })];
                    case 5:
                        response = _a.sent();
                        return [2 /*return*/, response.result];
                }
            });
        });
    };
    GoogleClassroomService.prototype.getStudentSubmissions = function (courseId, assignmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isInitialized) return [3 /*break*/, 2];
                        console.log('Initializing before getting student submissions...');
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, window.gapi.client.classroom.courses.courseWork.studentSubmissions.list({
                                courseId: courseId,
                                courseWorkId: assignmentId,
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.result.studentSubmissions || []];
                    case 4:
                        error_4 = _a.sent();
                        console.error('Error fetching student submissions:', error_4);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GoogleClassroomService.prototype.updateAssignmentGrade = function (courseId, courseWorkId, studentId, grade) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isInitialized) return [3 /*break*/, 2];
                        console.log('Initializing before updating assignment grade...');
                        return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, window.gapi.client.classroom.courses.courseWork.studentSubmissions.patch({
                                courseId: courseId,
                                courseWorkId: courseWorkId,
                                id: studentId,
                                updateMask: "assignedGrade,draftGrade",
                                resource: {
                                    assignedGrade: grade,
                                    draftGrade: grade,
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.error('Error updating assignment grade:', error_5);
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return GoogleClassroomService;
}());
// Export a singleton instance
exports.googleClassroom = GoogleClassroomService.getInstance();
