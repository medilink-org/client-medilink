# MediLink

MediLink addresses these challenges by providing a modern, user-friendly healthcare management system that streamlines medical recordkeeping and enhances communication between departments. By automating tasks like patient data entry and appointment scheduling, MediLink improves efficiency and ensures accurate, up-to-date information is readily available to healthcare providers, ultimately leading to better patient outcomes and more efficient use of resources.

Please visit our notion page [here](https://brunchlabs.notion.site/MediLink-c0234435571f4924b23366ffe9bd1b17) for more details.

## Architecture

Our application is built in React and uses RTK Query to handle API requests and responses. We use Material UI and Ant Design for most of our styling and Plotly.js for data visualization. The app uses React-Router for navigation, and it is built with a browser in mind and so some pages, specifically the practitioner's views were not at all configured for mobile use, as we assume that anytime a practitioner is seeing a patient they will have access to a computer.

We built this app with the intention of it being a tech demo, and as such we have not implemented any sort of real user authentication. You can log in to the demo accounts using the following credentials:

### Practitioners

#### Dr. Demo, MD

- Username: `demo1`
- Password: `password`

#### Dr. Demo Jr. MD

- Username: `demo2`
- Password: `password`

### Receptionist

- Username: `receptionist1`
- Password: `password1`

### Admin

- Username: `admin1`
- Password: `password1`

Additionally, one can easily create any account of any role using the admin's dashboard.

## Setup

- `npm install` to install dependencies.
- `npm run dev` to start the development server with Vite.
- `npm run build` to build the project for production.
- `npm run preview` to preview the production build locally.
- `npm run lint` to run ESLint and check for linting issues.
- `npm run lint:fix` to run ESLint and automatically fix linting issues.
- `npx depcheck` to review unused dependencies.

### Development

To start the development server:

```sh
npm run dev
```

This will start the Vite development server, and you can view your application in the browser.

### Building

To build the project for production:

```sh
npm run build
```

This will create an optimized production build of your project.

### Previewing

To preview the production build locally:

```sh
npm run preview
```

This will serve the production build locally, allowing you to verify it before deploying.

### Linting

To check for linting issues:

```sh
npm run lint
```

This will run ESLint on your codebase and report any linting issues.

To automatically fix linting issues:

```sh
npm run lint:fix
```

This will run ESLint with the `--fix` option, automatically fixing any fixable issues.

### Checking for Unused Dependencies

To review unused dependencies:

```sh
npx depcheck
```

This will analyze your project and report any dependencies that are not being used.

## Deployment

A deployed version of the frontend lives at [medilink-frontend](https://medilink-frontend.onrender.com/)

## Authors

Aimen Abdulaziz, Sajjad Kareem, Caleb Ash, Tayeb Mohammedi

## Acknowledgments

EasyEMR project
