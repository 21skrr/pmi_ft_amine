<<<<<<< HEAD
SELECT * FROM pmi_onboarding.users;
=======
-- Create database
CREATE DATABASE IF NOT EXISTS pmi_onboarding;
USE pmi_onboarding;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('employee', 'supervisor', 'manager', 'hr') NOT NULL,
    department VARCHAR(255),
    startDate DATE,
    programType ENUM('inkompass', 'earlyTalent', 'apprenticeship', 'academicPlacement', 'workExperience'),
    supervisorId CHAR(36),
    onboardingProgress INT DEFAULT 0,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (supervisorId) REFERENCES Users(id)
);

-- OnboardingProgress table
CREATE TABLE IF NOT EXISTS OnboardingProgress (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    stage ENUM('prepare', 'orient', 'land', 'integrate', 'excel') NOT NULL DEFAULT 'prepare',
    progress INT NOT NULL DEFAULT 0,
    stageStartDate DATETIME NOT NULL,
    estimatedCompletionDate DATETIME,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS Tasks (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    dueDate DATETIME,
    isCompleted BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    onboardingStage ENUM('prepare', 'orient', 'land', 'integrate', 'excel'),
    controlledBy ENUM('hr', 'supervisor', 'employee') DEFAULT 'hr',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Events table
CREATE TABLE IF NOT EXISTS Events (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    location VARCHAR(255),
    type ENUM('meeting', 'training', 'event', 'planning') DEFAULT 'meeting',
    createdBy CHAR(36) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- EventParticipants table
CREATE TABLE IF NOT EXISTS EventParticipants (
    id CHAR(36) PRIMARY KEY,
    eventId CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    status ENUM('attending', 'declined', 'pending') DEFAULT 'pending',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (eventId) REFERENCES Events(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Courses table
CREATE TABLE IF NOT EXISTS Courses (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    totalModules INT NOT NULL DEFAULT 1,
    programType ENUM('inkompass', 'earlyTalent', 'apprenticeship', 'academicPlacement', 'workExperience', 'all') DEFAULT 'all',
    isRequired BOOLEAN DEFAULT TRUE,
    createdBy CHAR(36) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- UserCourses table
CREATE TABLE IF NOT EXISTS UserCourses (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    courseId CHAR(36) NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    modulesCompleted INT NOT NULL DEFAULT 0,
    completedAt DATETIME,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (courseId) REFERENCES Courses(id)
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS Evaluations (
    id CHAR(36) PRIMARY KEY,
    employeeId CHAR(36) NOT NULL,
    evaluatorId CHAR(36) NOT NULL,
    type ENUM('3-month', '6-month', '12-month', 'training', 'general') NOT NULL,
    status ENUM('draft', 'in_progress', 'completed') DEFAULT 'draft',
    completedAt DATETIME,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (employeeId) REFERENCES Users(id),
    FOREIGN KEY (evaluatorId) REFERENCES Users(id)
);

-- EvaluationCriteria table
CREATE TABLE IF NOT EXISTS EvaluationCriteria (
    id CHAR(36) PRIMARY KEY,
    evaluationId CHAR(36) NOT NULL,
    category VARCHAR(255) NOT NULL,
    criteria VARCHAR(255) NOT NULL,
    rating INT,
    comments TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (evaluationId) REFERENCES Evaluations(id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS Feedback (
    id CHAR(36) PRIMARY KEY,
    fromUserId CHAR(36) NOT NULL,
    toUserId CHAR(36),
    toDepartment VARCHAR(255),
    type ENUM('onboarding', 'training', 'support', 'general') DEFAULT 'general',
    message TEXT NOT NULL,
    isAnonymous BOOLEAN DEFAULT FALSE,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (fromUserId) REFERENCES Users(id),
    FOREIGN KEY (toUserId) REFERENCES Users(id)
);

-- Documents table
CREATE TABLE IF NOT EXISTS Documents (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    filePath VARCHAR(255) NOT NULL,
    fileType VARCHAR(50),
    fileSize INT,
    uploadedBy CHAR(36) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (uploadedBy) REFERENCES Users(id)
);

-- DocumentAccess table
CREATE TABLE IF NOT EXISTS DocumentAccess (
    id CHAR(36) PRIMARY KEY,
    documentId CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    accessType ENUM('view', 'edit', 'admin') DEFAULT 'view',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (documentId) REFERENCES Documents(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS Notifications (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('task', 'event', 'evaluation', 'feedback', 'system') NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Surveys table
CREATE TABLE IF NOT EXISTS Surveys (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('3-month', '6-month', '12-month', 'training', 'general') DEFAULT 'general',
    status ENUM('draft', 'active', 'completed') DEFAULT 'draft',
    createdBy CHAR(36) NOT NULL,
    dueDate DATETIME,
    targetRole ENUM('employee', 'supervisor', 'manager', 'hr', 'all') DEFAULT 'employee',
    targetProgram ENUM('inkompass', 'earlyTalent', 'apprenticeship', 'academicPlacement', 'workExperience', 'all') DEFAULT 'all',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (createdBy) REFERENCES Users(id)
);

-- SurveyQuestions table
CREATE TABLE IF NOT EXISTS SurveyQuestions (
    id CHAR(36) PRIMARY KEY,
    surveyId CHAR(36) NOT NULL,
    question TEXT NOT NULL,
	type ENUM('text', 'multiple_choice', 'rating') NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    options JSON,
    questionOrder INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (surveyId) REFERENCES Surveys(id)
);

-- SurveyResponses table
CREATE TABLE IF NOT EXISTS SurveyResponses (
    id CHAR(36) PRIMARY KEY,
    surveyId CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    submittedAt DATETIME NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (surveyId) REFERENCES Surveys(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- SurveyQuestionResponses table
CREATE TABLE IF NOT EXISTS SurveyQuestionResponses (
    id CHAR(36) PRIMARY KEY,
    responseId CHAR(36) NOT NULL,
    questionId CHAR(36) NOT NULL,
    answer TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (responseId) REFERENCES SurveyResponses(id),
    FOREIGN KEY (questionId) REFERENCES SurveyQuestions(id)
);

-- CoachingSessions table
CREATE TABLE IF NOT EXISTS CoachingSessions (
    id CHAR(36) PRIMARY KEY,
    supervisorId CHAR(36) NOT NULL,
    employeeId CHAR(36) NOT NULL,
    scheduledDate DATETIME NOT NULL,
    actualDate DATETIME,
    status ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    goal TEXT,
    notes TEXT,
    outcome TEXT,
    topicTags JSON,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (supervisorId) REFERENCES Users(id),
    FOREIGN KEY (employeeId) REFERENCES Users(id)
);
>>>>>>> e45d5af2f3b656e78bbe5d47b3b66f4e245b16ef
