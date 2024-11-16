## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Thu Aug 22 2024 08:37:23 GMT+0000 (Coordinated Universal Time)|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.14.4|
|**Generation Platform**<br>SAP Business Application Studio|
|**Template Used**<br>simple|
|**Service Type**<br>None|
|**Service URL**<br>N/A|
|**Module Name**<br>leftmenu|
|**Application Title**<br>App Title|
|**Namespace**<br>|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.127.1|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|

## Library Management System

An SAP Fiori application.

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from the generated app root folder:

```
    npm start
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)

### Detail Description 
# Library Management System

## Overview
This project is a **Library Management System** designed to streamline the management of library resources, staff, and student interactions. It features a **Staff Login Page** that allows authorized staff to access a suite of functionalities via a left-side navigation menu. Each menu tab corresponds to a specific functionality, including student and book management, as well as report generation.

---

## Features

### 1. Staff Login
- Secure login system for library staff.
- Access to the system based on authenticated credentials.

### 2. Left Navigation Menu
The left menu contains the following tabs:

#### a) Student Registration
- Add and manage student details.
- Fields include student name, ID, contact information, etc.
- View, edit, and delete records via the report page.

#### b) Student Category
- Categorize students based on their year or level.
- Define maximum books allowed per category.
- Report functionality for viewing, editing, or deleting categories.

#### c) Books Issue Log
- Record details of issued books, including:
  - Issued by (staff)
  - Issued to (student)
  - Time and date of issuance
  - Book details
- Generate a detailed report of issued books, with options to edit or delete entries.

#### d) Book Return Form
- Manage the return of books to the library.
- Capture details such as:
  - Returned by (student)
  - Book name and ID
  - Return time and date
- View, edit, and delete return records via the report.

#### e) Books Form
- Add new books to the library inventory.
- Fields include:
  - Book name
  - Author
  - Time added
  - Added by (staff)
- Report feature for managing book records.

#### f) Books Category Form
- Define and manage book categories such as:
  - Science
  - Fictional
  - History
- View, edit, or delete categories through the report page.

---

## Reports
Each form includes a **"View Report"** feature:
- Displays all records for the selected tab.
- Includes options to:
  - **Edit**: Modify existing records.
  - **Delete**: Remove records from the system.

## Technologies Used
### Front-End:
1. XML
2. JavaScript
### Back-End:
SAP ABAP


