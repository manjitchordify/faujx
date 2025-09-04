'use client';

import { ChangeEvent, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  OnMove,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Root from '@/components/roadmap/Root';
import Topic from '@/components/roadmap/Topic';
import Module from '@/components/roadmap/Module';
import Assignment from '@/components/roadmap/Assignment';
import { ASSIGNMENT, MODULE, SPACE, TOPIC } from '@/constants/roadmap';
import {
  NodeEdge,
  NodeItem,
  NodeItemData,
  NodeItemStatus,
  NodeItemType,
  NodeType,
  NodeStatus,
} from '@/types/roadmap';
import { Heart, Star, X } from 'lucide-react';

const nodeTypes = {
  [NodeType.Root]: Root,
  [NodeType.Topic]: Topic,
  [NodeType.Module]: Module,
  [NodeType.Assignment]: Assignment,
};

const rawNodes = [
  {
    id: '1',
    type: NodeType.Module,
    data: {
      label: 'Module 1: HTML & CSS Foundation',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'This module deeply explores how to craft modern, accessible, and responsive web experiences with HTML and CSS. You’ll engage with semantic markup, forms and accessibility best practices, the CSS box model, display and positioning strategies, typography, color contrast, units (rem, em, vh/vw), Flexbox and Grid for layouts, media queries for responsive design, and practical usage of frameworks (Tailwind, Bootstrap) to build scalable, theme-aware, and optimized user interfaces.',
      resources: {
        free: [
          'https://developer.mozilla.org/en-US/docs/Web',
          'https://www.freecodecamp.org/learn/responsive-web-design/',
          'https://www.w3schools.com',
          'http://www.csszengarden.com/',
        ],
        premium: [
          'https://www.udemy.com/course/modern-html-css-from-scratch/',
          'https://frontendmasters.com',
          'https://www.coursera.org/specializations/web-design',
          'https://teamtreehouse.com/tracks/front-end-web-development',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '1.1 HTML Essentials',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Dive deep into the essentials of HTML, the backbone of the web. This topic covers the foundational structure of HTML documents, semantic tags like <header>, <section>, and <article>, and how to structure content meaningfully. You’ll explore form creation, input types (text, email, radio, etc.), labels, fieldsets, and buttons while learning accessibility best practices like ARIA roles and semantic labeling to build inclusive websites.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Web/HTML',
              'https://www.freecodecamp.org/learn/responsive-web-design/basic-html-and-html5/',
              'https://www.w3schools.com/html/',
              'https://htmlreference.io/',
            ],
            premium: [
              'https://www.udemy.com/course/html-the-structure-of-web-pages/',
              'https://frontendmasters.com/courses/semantic-html/',
              'https://www.coursera.org/learn/html',
              'https://www.linkedin.com/learning/html-essential-training-4',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '1.2 CSS Fundamentals',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Explore the fundamentals of Cascading Style Sheets (CSS), including syntax, selectors, and declaration blocks. Learn how to style text, colors, backgrounds, borders, and spacing. This topic covers the box model in depth—content, padding, border, and margin—and includes understanding display types (block, inline, inline-block), positioning schemes (relative, absolute, fixed, sticky), and how CSS cascades and inherits styles across the DOM.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Web/CSS',
              'https://www.freecodecamp.org/learn/responsive-web-design/basic-css/',
              'https://www.w3schools.com/css/',
              'https://web.dev/learn/css/',
            ],
            premium: [
              'https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/',
              'https://frontendmasters.com/courses/css-fundamentals/',
              'https://www.coursera.org/learn/introcss',
              'https://teamtreehouse.com/library/css-basics',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '3',
        type: NodeType.Topic,
        data: {
          label: '1.3 Responsive Design',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Master responsive web design by learning mobile-first development principles. This topic introduces media queries, breakpoints, and relative units like %, rem, em, vw, and vh. You’ll learn how to structure flexible layouts using CSS Flexbox and Grid to accommodate different screen sizes and devices. Understand the importance of content hierarchy, fluid images, and touch-friendly design to create user-centric experiences across desktops, tablets, and smartphones.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design',
              'https://web.dev/responsive-web-design-basics/',
              'https://www.freecodecamp.org/learn/responsive-web-design/',
              'https://css-tricks.com/snippets/css/media-queries-for-standard-devices/',
            ],
            premium: [
              'https://www.udemy.com/course/responsive-web-design/',
              'https://frontendmasters.com/courses/responsive-web-design-v2/',
              'https://www.linkedin.com/learning/responsive-web-design-in-practice',
              'https://www.coursera.org/learn/responsivedesign',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '4',
        type: NodeType.Topic,
        data: {
          label: '1.4 CSS Frameworks',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Discover how CSS frameworks like Tailwind CSS and Bootstrap accelerate development and maintain consistency in UI design. Learn the utility-first approach with Tailwind, customizing components using configuration files, and best practices for responsive utility usage. Explore Bootstrap’s grid system, components, JavaScript plugins, and theme customization. Compare the strengths of both frameworks and understand how to choose the right one for your project needs.',
          resources: {
            free: [
              'https://tailwindcss.com/docs',
              'https://getbootstrap.com/docs/',
              'https://www.freecodecamp.org/news/an-introduction-to-tailwind-css/',
              'https://www.w3schools.com/bootstrap5/',
            ],
            premium: [
              'https://www.udemy.com/course/tailwind-from-scratch/',
              'https://frontendmasters.com/courses/tailwind-css/',
              'https://www.linkedin.com/learning/bootstrap-5-essential-training',
              'https://www.coursera.org/projects/website-bootstrap',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label: 'Create a fully responsive personal portfolio website.',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Design and develop a fully responsive personal portfolio website that showcases your skills and projects. Focus on building a clean, semantic HTML structure and applying mobile-first design principles. Use CSS Flexbox and Grid for layout management, ensuring the site adapts seamlessly to different screen sizes. Incorporate advanced CSS features such as transitions and animations for interactivity, and implement a dark/light theme toggle for user preference. This project will help solidify your understanding of modern web design best practices, accessibility, and responsive UI techniques.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design',
              'https://css-tricks.com/snippets/css/complete-guide-grid/',
              'https://www.freecodecamp.org/learn/responsive-web-design/',
              'https://www.w3schools.com/howto/howto_css_toggle_dark_mode.asp',
            ],
            premium: [
              'https://www.udemy.com/course/design-and-develop-a-killer-portfolio-website/',
              'https://frontendmasters.com/courses/responsive-web-design/',
              'https://www.pluralsight.com/courses/css-responsive-design',
              'https://teamtreehouse.com/library/build-a-portfolio-site',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
  {
    id: '2',
    type: NodeType.Module,
    data: {
      label: 'Module 2: JavaScript Fundamentals',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'Delve into JavaScript fundamentals to build dynamic web interfaces. Explore variables, types, operators, functions, control flow, loops, array methods, destructuring, rest/spread operators, async/await, error handling, DOM manipulation, event-driven programming, form validation, local storage, and integrating external APIs using Fetch—all to establish a strong base for interactive applications.',
      resources: {
        free: [
          'https://www.freecodecamp.org',
          'https://javascript.info',
          'https://javascript30.com',
          'https://www.theodinproject.com',
        ],
        premium: [
          'https://www.udemy.com',
          'https://www.udacity.com/course/full-stack-javascript-developer-nanodegree',
          'https://www.codecademy.com',
          'https://www.coursera.org',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '2.1 Core JavaScript',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'This topic introduces the building blocks of JavaScript, including variables (var, let, const), primitive and reference data types, arithmetic and logical operators, and core control structures like conditionals (if/else, switch) and loops (for, while, do-while). You’ll learn how to declare and invoke functions (including arrow functions), use template literals, and develop logic-driven functionality. These fundamentals provide the necessary foundation for all advanced JavaScript development.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
              'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
              'https://javascript.info/first-steps',
              'https://www.w3schools.com/js/',
            ],
            premium: [
              'https://www.udemy.com/course/the-complete-javascript-course/',
              'https://frontendmasters.com/courses/javascript-foundations/',
              'https://www.codecademy.com/learn/introduction-to-javascript',
              'https://www.linkedin.com/learning/javascript-essential-training-3',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '2.2 Advanced JavaScript',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Take your JavaScript skills to the next level by mastering higher-order functions, array methods (map, filter, reduce, forEach), destructuring arrays and objects, the spread and rest operators, and modern asynchronous programming with promises and async/await. You’ll also learn how to manage errors using try/catch and understand how JavaScript handles execution context, scope, and closures. This topic prepares you for writing clean, maintainable, and performant code.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
              'https://javascript.info/array-methods',
              'https://www.freecodecamp.org/news/learn-javascript-full-course/',
              'https://www.javascripttutorial.net/',
            ],
            premium: [
              'https://frontendmasters.com/courses/advanced-javascript/',
              'https://www.udemy.com/course/advanced-javascript-concepts/',
              'https://www.pluralsight.com/courses/javascript-advanced',
              'https://www.linkedin.com/learning/advanced-javascript',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '3',
        type: NodeType.Topic,
        data: {
          label: '2.3 DOM & Events',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'In this topic, you’ll learn how to interact with the Document Object Model (DOM) using JavaScript to dynamically update and manipulate HTML elements. Discover how to use methods like `querySelector`, `getElementById`, and `createElement`, and manage user interactions through event listeners (`click`, `input`, `submit`, etc.). You’ll also explore form validation techniques, event delegation, and how to persist data using local storage and session storage to build rich, interactive web experiences.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model',
              'https://javascript.info/dom-nodes',
              'https://www.freecodecamp.org/news/what-is-the-dom-document-object-model-meaning-in-javascript/',
              'https://www.w3schools.com/js/js_htmldom.asp',
            ],
            premium: [
              'https://frontendmasters.com/courses/javascript-hard-parts/',
              'https://www.udemy.com/course/javascript-dom-manipulation/',
              'https://www.codecademy.com/learn/learn-intermediate-javascript/modules/working-with-the-dom',
              'https://www.linkedin.com/learning/javascript-dom-1',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '4',
        type: NodeType.Topic,
        data: {
          label: '2.4 API Integration',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Learn how to work with external APIs to bring dynamic data into your web applications. This topic covers the fundamentals of RESTful APIs, making HTTP requests using the Fetch API, handling JSON data, and working with asynchronous operations using Promises and async/await. You’ll also understand how to implement error handling, manage loading states, and update the DOM with fetched data. Real-world examples include working with APIs like OpenWeather, JSONPlaceholder, and others.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
              'https://www.freecodecamp.org/news/javascript-fetch-api-tutorial-with-js-fetch-post-and-header-examples/',
              'https://www.javascripttutorial.net/javascript-fetch-api/',
              'https://rapidapi.com/blog/api-glossary/rest-api/',
            ],
            premium: [
              'https://www.udemy.com/course/api-javascript/',
              'https://frontendmasters.com/courses/intermediate-javascript/',
              'https://www.linkedin.com/learning/javascript-working-with-apis',
              'https://www.codecademy.com/learn/learn-intermediate-javascript/modules/requests',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label:
            "Build a 'Weather Dashboard' application with API integration.",
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Develop a dynamic Weather Dashboard application that integrates with a weather API (such as OpenWeatherMap or WeatherAPI). The app should allow users to search for cities and display current weather conditions, extended forecasts, temperature, humidity, wind speed, and weather icons. Implement features like storing recent searches in local storage for quick access, displaying error messages for invalid inputs or network issues, and ensuring the UI is responsive and user-friendly. This project enhances your skills in API consumption, asynchronous JavaScript, DOM manipulation, and error handling.',
          resources: {
            free: [
              'https://openweathermap.org/api',
              'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
              'https://www.freecodecamp.org/news/how-to-build-a-weather-app-with-javascript/',
              'https://css-tricks.com/using-localstorage-web-storage-api/',
            ],
            premium: [
              'https://www.udemy.com/course/javascript-api-requests-build-a-weather-app/',
              'https://frontendmasters.com/courses/web-app-from-scratch/',
              'https://egghead.io/courses/building-an-api-client-with-fetch',
              'https://www.pluralsight.com/courses/javascript-building-weather-dashboard-app',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
  {
    id: '3',
    type: NodeType.Module,
    data: {
      label: 'Module 3: React Development',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'Master the React ecosystem—create functional components with JSX, manage props and state, use hooks like useState and useEffect, handle global state via Context API or Redux, set up routing with React Router including dynamic and protected routes, and implement forms and validation using Formik or React Hook Form to build rich, scalable front-end applications.',
      resources: {
        free: [
          'https://reactjs.org/docs/getting-started.html',
          'https://www.freecodecamp.org/news/tag/react/',
          'https://scrimba.com/learn/learnreact',
          'https://www.youtube.com/c/TheNetNinja',
        ],
        premium: [
          'https://frontendmasters.com',
          'https://www.udemy.com',
          'https://www.coursera.org',
          'https://egghead.io',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '3.1 React Basics',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Start your journey into modern front-end development with React. This topic introduces the concept of declarative UI with reusable components, the importance of JSX syntax, and how React’s virtual DOM enhances performance. You’ll learn how to build functional components, pass data via props, and render dynamic content using JavaScript expressions inside JSX. By the end, you’ll be able to create simple, reusable, and interactive UI components that serve as the building blocks of any React application.',
          resources: {
            free: [
              'https://react.dev/learn',
              'https://www.w3schools.com/react/',
              'https://legacy.reactjs.org/docs/getting-started.html',
              'https://www.freecodecamp.org/news/learn-react-by-building-a-simple-app-d7f4fdea8e16/',
            ],
            premium: [
              'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
              'https://frontendmasters.com/courses/react/',
              'https://www.codecademy.com/learn/react-101',
              'https://www.linkedin.com/learning/react-js-essential-training',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '3.2 React Hooks',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'React Hooks revolutionized state and side-effect management in functional components. In this topic, you’ll explore essential built-in hooks including `useState` for managing local state, `useEffect` for handling side effects like fetching data or updating the DOM, and `useContext` for accessing shared state across components. Understanding how and when to use these hooks allows you to write cleaner, more concise code without relying on class-based components. You’ll also learn the rules of hooks and how they replace lifecycle methods.',
          resources: {
            free: [
              'https://react.dev/learn/state-a-components-memory',
              'https://reactjs.org/docs/hooks-intro.html',
              'https://www.freecodecamp.org/news/an-introduction-to-react-hooks/',
              'https://blog.logrocket.com/a-guide-to-react-useeffect-hook/',
            ],
            premium: [
              'https://www.udemy.com/course/react-hooks/',
              'https://frontendmasters.com/courses/react-hooks/',
              'https://www.codecademy.com/learn/react-102',
              'https://www.linkedin.com/learning/learning-react-hooks',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '3',
        type: NodeType.Topic,
        data: {
          label: '3.3 State Management',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Effective state management is critical in building scalable React apps. This topic covers the distinction between local component state and global application state. You’ll first deepen your knowledge of React’s Context API for managing global state across components without prop drilling. Then, explore Redux—an industry-standard library for managing complex state with a centralized store, actions, and reducers. You’ll learn how to connect Redux with React using `react-redux` and middleware like Redux Thunk or Redux Toolkit.',
          resources: {
            free: [
              'https://react.dev/learn/passing-data-deeply-with-context',
              'https://redux.js.org/introduction/getting-started',
              'https://www.freecodecamp.org/news/state-management-in-react/',
              'https://daveceddia.com/where-to-hold-react-state/',
            ],
            premium: [
              'https://www.udemy.com/course/react-redux/',
              'https://frontendmasters.com/courses/redux-fundamentals/',
              'https://www.pluralsight.com/courses/react-redux-react-router-es6',
              'https://www.linkedin.com/learning/react-state-management',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '4',
        type: NodeType.Topic,
        data: {
          label: '3.4 React Router',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'React Router enables seamless navigation in single-page applications. This topic teaches how to use `react-router-dom` to create client-side routing. You’ll learn how to define and render routes using `<Route>` and `<Switch>`, create navigation links with `<Link>`, and handle route parameters and wildcards. Additional topics include protected/private routes for authenticated users, nested routes for complex layouts, and programmatic navigation using `useNavigate`. These skills are crucial for structuring multi-page user flows in modern apps.',
          resources: {
            free: [
              'https://reactrouter.com/en/main',
              'https://www.freecodecamp.org/news/react-router-tutorial/',
              'https://blog.logrocket.com/getting-started-with-react-router-v6/',
              'https://www.w3schools.com/react/react_router.asp',
            ],
            premium: [
              'https://www.udemy.com/course/react-router/',
              'https://frontendmasters.com/courses/intermediate-react-v5/',
              'https://www.linkedin.com/learning/react-routing',
              'https://www.pluralsight.com/courses/react-router',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '5',
        type: NodeType.Topic,
        data: {
          label: '3.5 Forms & Validation',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'This topic dives into building and managing forms in React. You’ll understand the difference between controlled and uncontrolled components, how to handle form inputs, and maintain form state using `useState`. You’ll also work with form libraries such as Formik and React Hook Form to simplify form handling and improve performance. Validation is covered using both built-in methods and libraries like Yup. Learn how to show error messages, manage submission states, and handle dynamic or nested fields.',
          resources: {
            free: [
              'https://react.dev/learn/sharing-state-between-components#sharing-state-between-components',
              'https://react-hook-form.com/get-started',
              'https://formik.org/docs/overview',
              'https://www.freecodecamp.org/news/how-to-build-forms-in-react/',
            ],
            premium: [
              'https://www.udemy.com/course/react-form-validation/',
              'https://frontendmasters.com/courses/react-forms/',
              'https://www.linkedin.com/learning/learning-react-form-building',
              'https://www.pluralsight.com/courses/react-form-handling-validation',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label: "Create a 'Task Management App' with React.",
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Develop a fully featured Task Management application using React. Your app should include project boards where users can create, edit, and delete tasks. Implement drag-and-drop functionality to reorder tasks and move them between different columns, enhancing usability and interactivity. Integrate user authentication for secure access and ensure protected routes so only authorized users can view or modify their tasks. Manage global state effectively using React Context or Redux to synchronize task data throughout the app. Focus on clean, modular code and responsive design to provide an intuitive user experience.',
          resources: {
            free: [
              'https://reactjs.org/docs/getting-started.html',
              'https://www.freecodecamp.org/news/how-to-build-a-kanban-board-in-react/',
              'https://react-dnd.github.io/react-dnd/about',
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
            ],
            premium: [
              'https://www.udemy.com/course/react-redux/',
              'https://frontendmasters.com/courses/react-router/',
              'https://egghead.io/courses/manage-global-state-with-react-context',
              'https://www.pluralsight.com/courses/react-building-a-kanban-board',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
  {
    id: '4',
    type: NodeType.Module,
    data: {
      label: 'Module 4: Testing',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'This module equips you for robust and reliable software by teaching the types of testing—unit, integration, end-to-end—and test-driven development. You’ll work with Jest and React Testing Library to write component tests, custom hook tests, simulate user interactions, and aim for high code coverage to ensure maintainable, resilient React applications.',
      resources: {
        free: [
          'https://jestjs.io',
          'https://testing-library.com/docs/react-testing-library/intro',
          'https://www.freecodecamp.org/news/testing-react-apps/',
          'https://developer.mozilla.org',
        ],
        premium: [
          'https://frontendmasters.com',
          'https://www.udemy.com',
          'https://www.pluralsight.com',
          'https://www.coursera.org',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '4.1 Testing Fundamentals',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'This topic introduces the core principles and types of software testing: unit testing, integration testing, and end-to-end (E2E) testing. You’ll learn how to structure test suites, write test cases, and choose the appropriate level of testing for your code. It also covers the concept of test-driven development (TDD), where tests are written before the implementation code. Best practices such as mocking, assertions, and ensuring test coverage will be emphasized to help maintain code quality, reduce bugs, and support scalable applications.',
          resources: {
            free: [
              'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Testing',
              'https://www.freecodecamp.org/news/software-testing-methodologies/',
              'https://www.geeksforgeeks.org/software-testing-basics/',
              'https://www.codecademy.com/article/what-is-test-driven-development',
            ],
            premium: [
              'https://www.udemy.com/course/software-testing/',
              'https://frontendmasters.com/courses/testing-practices/',
              'https://www.linkedin.com/learning/test-driven-development-in-javascript',
              'https://www.pluralsight.com/courses/software-testing-introduction',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '4.2 React Testing',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Master testing strategies specific to React applications using tools like Jest and React Testing Library (RTL). This topic covers writing unit tests for components and hooks, mocking API calls and external modules, and simulating user interactions. You’ll learn to test form behavior, component rendering, conditional logic, and state changes. Emphasis is placed on writing accessible and maintainable tests that mirror real-world usage. You’ll also explore snapshot testing, coverage reports, and integration with CI/CD workflows.',
          resources: {
            free: [
              'https://react.dev/learn/testing',
              'https://testing-library.com/docs/react-testing-library/intro/',
              'https://jestjs.io/docs/getting-started',
              'https://www.freecodecamp.org/news/testing-react-hooks/',
            ],
            premium: [
              'https://www.udemy.com/course/react-testing-library/',
              'https://frontendmasters.com/courses/react-testing/',
              'https://www.linkedin.com/learning/react-testing-library',
              'https://www.pluralsight.com/courses/react-testing-library',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label: 'Add comprehensive testing to your Task Management App.',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Enhance the reliability of your Task Management App by writing comprehensive tests. Focus on creating unit tests for at least 5 components to ensure their logic works correctly. Include tests for custom hooks to verify their behavior across various states. Add user interaction tests that simulate real user events such as clicks, form inputs, and drag-and-drop actions. Aim to achieve a minimum of 80% code coverage, using tools like Jest and React Testing Library. This assignment will help you adopt test-driven development best practices and improve your application’s stability and maintainability.',
          resources: {
            free: [
              'https://jestjs.io/docs/getting-started',
              'https://testing-library.com/docs/react-testing-library/intro/',
              'https://kentcdodds.com/blog/testing-react-hooks',
              'https://www.freecodecamp.org/news/react-testing-library-tutorial/',
            ],
            premium: [
              'https://www.udemy.com/course/react-testing-with-jest-and-react-testing-library/',
              'https://frontendmasters.com/courses/testing-react/',
              'https://egghead.io/courses/test-your-react-app-with-jest-and-react-testing-library',
              'https://pluralsight.pxf.io/c/1369533/356949/7490?u=https%3A%2F%2Fwww.pluralsight.com%2Fcourses%2Freact-testing',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
  {
    id: '5',
    type: NodeType.Module,
    data: {
      label: 'Module 5: Payment Integration',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'Learn to securely integrate payment flows using Stripe, PayPal, and others. Explore payment gateway workflows, payment intents, secure form handling, webhooks for asynchronous event handling, error handling, validation, and receipt generation. Build a complete e-commerce checkout system that covers cart management and transaction flows end-to-end.',
      resources: {
        free: [
          'https://stripe.com/docs',
          'https://developer.paypal.com/docs/api/overview/',
          'https://www.smashingmagazine.com/2020/05/payment-gateway-integration-guide/',
          'https://www.freecodecamp.org/news/stripe-js-payment-gateway/',
        ],
        premium: [
          'https://www.udemy.com/course/stripe-payment-gateway/',
          'https://frontendmasters.com/courses/full-stack-v3/',
          'https://www.pluralsight.com/courses/stripe-payments',
          'https://www.linkedin.com/learning/topics/payment-gateways',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '5.1 Payment Gateway Basics',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Gain a foundational understanding of how online payment gateways work, including the roles of merchants, customers, banks, and payment processors. This topic covers secure payment workflows, PCI compliance, HTTPS requirements, and data encryption techniques. You’ll also explore common issues like failed payments, transaction validation, fraud prevention, and webhook-based notifications to confirm successful transactions. These principles apply universally across all major payment platforms.',
          resources: {
            free: [
              'https://www.cloudflare.com/learning/ddos/glossary/payment-gateway/',
              'https://razorpay.com/learn/how-payment-gateway-works/',
              'https://stripe.com/docs/security',
              'https://www.freecodecamp.org/news/how-does-a-payment-gateway-work/',
            ],
            premium: [
              'https://www.udemy.com/course/payment-gateway-integration/',
              'https://www.linkedin.com/learning/secure-payment-processing-for-developers',
              'https://www.pluralsight.com/courses/payment-processing-for-developers',
              'https://www.educba.com/payment-gateway-training/',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '5.2 Stripe Integration',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Learn to integrate Stripe into your web applications for secure and efficient payment processing. This topic walks you through setting up a Stripe account, using Stripe’s client and server SDKs, handling `payment_intents`, and implementing secure payment forms with Stripe Elements. You’ll also explore saving cards, handling subscriptions, and listening to webhook events to track payment status and automate post-payment workflows. This integration allows businesses to handle everything from one-time payments to complex recurring billing.',
          resources: {
            free: [
              'https://stripe.com/docs',
              'https://stripe.com/docs/payments/accept-a-payment',
              'https://www.freecodecamp.org/news/integrate-stripe-with-react-and-node/',
              'https://blog.logrocket.com/complete-guide-stripe-payments-react/',
            ],
            premium: [
              'https://www.udemy.com/course/stripe-payment/',
              'https://frontendmasters.com/courses/stripe/',
              'https://www.linkedin.com/learning/stripe-payments-integration',
              'https://www.pluralsight.com/courses/stripe-payments-integration',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '3',
        type: NodeType.Topic,
        data: {
          label: '5.3 Alternative Gateways',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Explore how to integrate various alternative payment gateways such as PayPal, Razorpay, and Square. This topic covers the unique features, use cases, and pros/cons of each platform. You’ll learn to implement client-side SDKs, generate server-side orders or tokens, and validate payments. Compare platform-specific flows such as PayPal checkout buttons, Razorpay modal popups, and Square’s Web Payments SDK. By the end, you’ll be equipped to choose and integrate the right gateway for different business models.',
          resources: {
            free: [
              'https://developer.paypal.com/docs/checkout/',
              'https://razorpay.com/docs/',
              'https://developer.squareup.com/docs/web-payments/overview',
              'https://www.freecodecamp.org/news/paypal-nodejs-tutorial/',
            ],
            premium: [
              'https://www.udemy.com/course/payment-gateway-integration-nodejs/',
              'https://www.linkedin.com/learning/paypal-integration-for-developers',
              'https://www.educba.com/razorpay-training/',
              'https://www.pluralsight.com/courses/alternative-payment-gateways',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label: "Build an 'E-commerce Checkout System' with Stripe.",
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Create a secure and efficient e-commerce checkout system integrated with Stripe as the payment gateway. Your app should include product listing pages with add-to-cart functionality and a shopping cart to review and modify items. Implement smooth cart management features such as updating quantities and removing products. Integrate Stripe payment processing securely using Stripe Elements or Stripe Checkout, handling payment intents and confirmation flows. After successful payments, generate detailed receipts and order confirmations. Focus on security best practices, error handling, and providing an intuitive, user-friendly checkout experience.',
          resources: {
            free: [
              'https://stripe.com/docs/payments/checkout',
              'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
              'https://www.freecodecamp.org/news/stripe-payment-integration-guide/',
              'https://css-tricks.com/integrating-stripe-payment-react/',
            ],
            premium: [
              'https://www.udemy.com/course/stripe-payment-integration-with-react-and-nodejs/',
              'https://frontendmasters.com/courses/stripe-payments/',
              'https://egghead.io/courses/accept-payments-with-stripe',
              'https://www.pluralsight.com/courses/building-ecommerce-checkout-react-stripe',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
  {
    id: '6',
    type: NodeType.Module,
    data: {
      label: 'Module 6: Development Tools & Workflow',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'Set up a professional development workflow using Git for version control, GitHub for collaboration, npm/Yarn for package management, script automation, and build tools like Webpack, Babel, and Gulp. Incorporate linters and formatters (ESLint, Prettier), and automate testing to enforce code quality and maintain development efficiency.',
      resources: {
        free: [
          'https://git-scm.com/docs',
          'https://webpack.js.org/concepts/',
          'https://babeljs.io/docs/',
          'https://eslint.org/docs/latest/',
        ],
        premium: [
          'https://www.udemy.com/course/git-complete/',
          'https://frontendmasters.com/courses/web-performance/',
          'https://www.pluralsight.com/courses/webpack-fundamentals',
          'https://egghead.io/courses/optimize-your-dev-environment',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '6.1 Version Control',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Version control is essential for managing source code and collaboration in software development. In this topic, you’ll master Git commands for tracking changes, branching, merging, and resolving conflicts. You’ll also learn to work with remote repositories using GitHub, manage pull requests, fork repositories, and contribute to open source. Real-world workflows like Git Flow and trunk-based development are covered, along with tips for writing meaningful commit messages and maintaining clean version histories.',
          resources: {
            free: [
              'https://git-scm.com/doc',
              'https://www.freecodecamp.org/news/learn-the-basics-of-git-in-under-10-minutes-948203d43dee/',
              'https://docs.github.com/en/get-started/quickstart',
              'https://www.atlassian.com/git/tutorials',
            ],
            premium: [
              'https://www.udemy.com/course/git-complete/',
              'https://www.linkedin.com/learning/learning-git-and-github',
              'https://www.codecademy.com/learn/learn-git',
              'https://frontendmasters.com/courses/git-in-depth/',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '6.2 Package Management',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Package managers like npm and Yarn are essential for managing third-party libraries and tools in modern JavaScript projects. This topic covers installing, updating, and removing packages; understanding `package.json` and `package-lock.json`; using semantic versioning; and creating custom scripts for automation. You’ll also learn about dependency management best practices, monorepo structures, and handling development vs. production dependencies effectively.',
          resources: {
            free: [
              'https://docs.npmjs.com/',
              'https://classic.yarnpkg.com/en/docs/',
              'https://www.freecodecamp.org/news/npm-crash-course/',
              'https://nodejs.dev/en/learn/an-introduction-to-the-npm-package-manager/',
            ],
            premium: [
              'https://www.udemy.com/course/npm-complete-guide/',
              'https://frontendmasters.com/courses/npm/',
              'https://www.linkedin.com/learning/npm-essential-training',
              'https://www.pluralsight.com/courses/npm-yarn-dependency-management',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '3',
        type: NodeType.Topic,
        data: {
          label: '6.3 Build Tools',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Build tools streamline and optimize the development process by transforming and bundling code. In this topic, you’ll explore Webpack for bundling assets, Babel for transpiling modern JavaScript to backward-compatible versions, and task runners like Gulp for automating repetitive tasks such as minification, compilation, and live reloading. You’ll also understand how these tools fit into modern front-end workflows and CI/CD pipelines, and how to configure them to boost productivity and performance.',
          resources: {
            free: [
              'https://webpack.js.org/concepts/',
              'https://babeljs.io/learn',
              'https://gulpjs.com/docs/en/getting-started/quick-start/',
              'https://www.freecodecamp.org/news/an-intro-to-webpack-what-it-is-and-how-to-use-it-83065c2faeff/',
            ],
            premium: [
              'https://www.udemy.com/course/webpack-2-the-complete-developer-s-guide/',
              'https://frontendmasters.com/courses/webpack-fundamentals/',
              'https://www.linkedin.com/learning/javascript-build-tools',
              'https://www.pluralsight.com/courses/webpack-big-picture',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '4',
        type: NodeType.Topic,
        data: {
          label: '6.4 Code Quality',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Maintaining high code quality ensures better readability, fewer bugs, and easier maintenance. This topic introduces code quality tools like linters (ESLint) and formatters (Prettier), which enforce consistent coding standards. You’ll learn how to integrate these tools with your IDE, Git hooks, and CI pipelines. The topic also touches on static analysis, code smell detection, and setting up `.eslintrc` and `.prettierrc` configuration files for teams. These tools are vital for collaborative and scalable development.',
          resources: {
            free: [
              'https://eslint.org/docs/latest/user-guide/getting-started',
              'https://prettier.io/docs/en/index.html',
              'https://www.freecodecamp.org/news/linting-and-formatting-javascript/',
              'https://blog.logrocket.com/how-to-use-eslint-and-prettier-in-react/',
            ],
            premium: [
              'https://www.udemy.com/course/code-quality-javascript-eslint-prettier/',
              'https://frontendmasters.com/courses/linting-prettier/',
              'https://www.linkedin.com/learning/javascript-code-quality',
              'https://www.pluralsight.com/courses/javascript-code-quality',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label:
            'Set up complete development workflow with Git and code quality tools.',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Establish a robust development workflow by mastering Git for version control, including branching, merging, and pull requests to collaborate efficiently. Automate your testing process with Jest to run unit and integration tests seamlessly as part of your development cycle. Ensure consistent and maintainable code style by configuring ESLint for linting and Prettier for code formatting. Integrate these tools with your code editor and CI/CD pipeline to enforce quality standards and streamline your development process.',
          resources: {
            free: [
              'https://git-scm.com/book/en/v2',
              'https://jestjs.io/docs/getting-started',
              'https://eslint.org/docs/user-guide/getting-started',
              'https://prettier.io/docs/en/index.html',
            ],
            premium: [
              'https://www.udemy.com/course/git-and-github-masterclass/',
              'https://frontendmasters.com/courses/testing-react/',
              'https://www.pluralsight.com/courses/eslint',
              'https://egghead.io/courses/how-to-use-prettier-in-a-team',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
  {
    id: '7',
    type: NodeType.Module,
    data: {
      label: 'Module 7: Performance Optimization',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'Optimize your React apps using techniques like memoization, code splitting, and profiling. Apply React.memo, useCallback, and useMemo to reduce unnecessary re-renders. Implement lazy loading with React.lazy and Suspense, perform route-based code splitting, and use tools like Chrome DevTools and Lighthouse to analyze bundle size and enhance performance.',
      resources: {
        free: [
          'https://reactjs.org/docs/optimizing-performance.html',
          'https://web.dev/performance-scoring/',
          'https://developers.google.com/web/tools/lighthouse',
          'https://github.com/GoogleChrome/lighthouse',
        ],
        premium: [
          'https://frontendmasters.com/courses/performance-react/',
          'https://egghead.io/courses/improve-performance-of-react-applications',
          'https://www.udemy.com/course/react-performance/',
          'https://www.pluralsight.com/courses/advanced-react-performance',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '7.1 Preventing Re-renders',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            "Optimizing React apps often starts with preventing unnecessary re-renders. This topic explores how to use `React.memo` to memoize entire components, `useCallback` to memoize functions passed as props, and `useMemo` to avoid recomputing expensive calculations. These tools help reduce computational overhead and ensure components only update when necessary. You'll also learn when memoization helps—and when it doesn't—plus best practices for profiling renders with React DevTools and identifying performance issues in real-time.",
          resources: {
            free: [
              'https://react.dev/learn/reusing-logic-with-custom-hooks#optimizing-performance',
              'https://reactjs.org/docs/react-api.html#reactmemo',
              'https://blog.logrocket.com/stop-wasting-performance-react-memoization/',
              'https://dmitripavlutin.com/dont-overuse-react-usecallback/',
            ],
            premium: [
              'https://www.udemy.com/course/react-performance/',
              'https://frontendmasters.com/courses/react-performance/',
              'https://www.pluralsight.com/courses/react-improve-performance',
              'https://egghead.io/courses/optimize-react-app-performance',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '7.2 Lazy Loading & Code Splitting',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            "Improve loading times and reduce initial bundle sizes by implementing lazy loading and code splitting in React. This topic covers how to use `React.lazy` and `Suspense` to defer component loading, enabling route-based or component-level code splitting. You'll also explore dynamic imports, error boundaries for fallback UI, and integration with tools like React Router to load routes only when needed. By splitting code efficiently, you can boost time-to-interactive (TTI) and improve core web vitals.",
          resources: {
            free: [
              'https://react.dev/reference/react/lazy',
              'https://reactjs.org/docs/code-splitting.html',
              'https://blog.bitsrc.io/lazy-loading-in-react-e16b264f3b43',
              'https://www.freecodecamp.org/news/react-code-splitting-and-lazy-loading/',
            ],
            premium: [
              'https://www.udemy.com/course/code-splitting-react-apps/',
              'https://frontendmasters.com/courses/react-performance/',
              'https://egghead.io/lessons/react-code-splitting-and-lazy-loading-in-react-v16-6',
              'https://www.linkedin.com/learning/react-performance-optimization',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '3',
        type: NodeType.Topic,
        data: {
          label: '7.3 Bundle Analysis & Profiling',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Bundle analysis and performance profiling are critical for identifying and addressing bottlenecks in React apps. Learn to use tools like `webpack-bundle-analyzer`, Chrome DevTools, and Lighthouse to inspect the size of your JavaScript bundles, identify unused code, and monitor runtime performance. This topic also covers React Profiler, flame graphs, memory leak detection, and network throttling techniques to simulate real-world usage. These tools empower developers to fine-tune performance and deliver fast, responsive UIs.',
          resources: {
            free: [
              'https://web.dev/measure/',
              'https://react.dev/learn/debugging-components',
              'https://developer.chrome.com/docs/devtools/',
              'https://www.npmjs.com/package/webpack-bundle-analyzer',
            ],
            premium: [
              'https://frontendmasters.com/courses/react-performance/',
              'https://www.udemy.com/course/react-performance/',
              'https://egghead.io/courses/performance-optimization-in-react-apps',
              'https://www.pluralsight.com/courses/react-performance-optimization',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label: 'Optimize your Task Management App for performance.',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Improve the performance of your Task Management App by applying advanced React optimization techniques. Use React.memo to prevent unnecessary re-renders of functional components, and leverage useCallback and useMemo hooks to memoize functions and values. Implement code splitting and lazy loading with React.lazy and Suspense to reduce initial load times. Use Chrome DevTools and React Profiler to identify and analyze performance bottlenecks, and optimize rendering and resource usage to enhance responsiveness and user experience.',
          resources: {
            free: [
              'https://reactjs.org/docs/react-api.html#reactmemo',
              'https://reactjs.org/docs/hooks-reference.html#usecallback',
              'https://reactjs.org/docs/code-splitting.html',
              'https://web.dev/react-performance/',
            ],
            premium: [
              'https://frontendmasters.com/courses/react-performance/',
              'https://www.udemy.com/course/react-performance-optimization/',
              'https://egghead.io/courses/react-performance-optimization',
              'https://www.pluralsight.com/courses/react-js-performance-optimization',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
  {
    id: '8',
    type: NodeType.Module,
    data: {
      label: 'Module 8: TypeScript with React',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'Add type safety to your React apps with TypeScript. Learn to declare interfaces, types, enums, and advanced unions/intersections. Type React components, hooks, event handlers, integrate validation libraries like Zod or Yup, and ensure type-safe API data handling to elevate code reliability and developer experience.',
      resources: {
        free: [
          'https://www.typescriptlang.org/docs/',
          'https://react-typescript-cheatsheet.netlify.app/',
          'https://www.freecodecamp.org/news/how-to-use-typescript-with-react/',
          'https://www.typescript-training.com/',
        ],
        premium: [
          'https://www.udemy.com/course/react-typescript/',
          'https://frontendmasters.com/courses/intermediate-react-v5/',
          'https://egghead.io/courses/building-react-applications-with-typescript',
          'https://www.pluralsight.com/courses/typescript-react',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '8.1 TypeScript Fundamentals',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'TypeScript is a strongly typed superset of JavaScript that enables static typing and powerful tooling. In this topic, you’ll learn core TypeScript features including interfaces, type aliases, enums, union and intersection types, literal types, and generics. You’ll also understand how these types help catch bugs at compile time and improve developer productivity. The topic focuses on applying these features in modern JavaScript and React workflows, such as typing component props and using strict null checks to avoid runtime errors.',
          resources: {
            free: [
              'https://www.typescriptlang.org/docs/',
              'https://www.freecodecamp.org/news/learn-typescript-beginners-guide/',
              'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
              'https://www.codecademy.com/learn/learn-typescript',
            ],
            premium: [
              'https://www.udemy.com/course/understanding-typescript/',
              'https://frontendmasters.com/courses/typescript/',
              'https://www.pluralsight.com/courses/typescript-getting-started',
              'https://www.linkedin.com/learning/learning-typescript-2',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '8.2 Advanced TS in React',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            "This topic dives into advanced TypeScript usage within React. You’ll learn to type functional components, custom hooks, refs, and event handlers effectively. It also covers default props, discriminated unions, and type narrowing strategies. You'll explore integrating runtime schema validation using tools like Zod or Yup, combining static and runtime type safety for form inputs and API responses. Advanced patterns like generics in components and utility types like `Partial`, `Pick`, and `Record` are also explored to write scalable, maintainable code.",
          resources: {
            free: [
              'https://react-typescript-cheatsheet.netlify.app/',
              'https://www.totaltypescript.com/tutorials/react',
              'https://blog.logrocket.com/using-typescript-with-react-hooks/',
              'https://zod.dev/',
            ],
            premium: [
              'https://www.udemy.com/course/react-typescript-the-practical-guide/',
              'https://frontendmasters.com/courses/advanced-typescript/',
              'https://www.pluralsight.com/courses/react-typescript-big-picture',
              'https://egghead.io/courses/advanced-patterns-with-typescript-v4',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label: 'Add TypeScript to your Task App',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Enhance your existing React Task Management App by integrating TypeScript for type safety and improved developer experience. Refactor key components, props, state, and API calls with appropriate TypeScript types and interfaces. Leverage TypeScript’s static type checking to catch errors early and improve code maintainability. Configure your build tools and editor to support TypeScript seamlessly, and use tools like ESLint with TypeScript plugins to enforce best practices.',
          resources: {
            free: [
              'https://www.typescriptlang.org/docs/handbook/react.html',
              'https://react-typescript-cheatsheet.netlify.app/',
              'https://www.freecodecamp.org/news/how-to-use-typescript-with-react/',
              'https://www.typescriptlang.org/docs/handbook/intro-to-typescript.html',
            ],
            premium: [
              'https://frontendmasters.com/courses/react-typescript/',
              'https://www.udemy.com/course/react-and-typescript/',
              'https://egghead.io/courses/typescript-in-react-applications',
              'https://www.pluralsight.com/courses/react-typescript',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
  {
    id: '9',
    type: NodeType.Module,
    data: {
      label: 'Module 9: Real-World Projects & Freelance Readiness',
      isCompleted: false,
      status: NodeStatus.NotStarted,
      description:
        'Apply your full-stack and frontend mastery to real-world projects. Build full-stack apps with authentication, CRUD, file uploads, payment integration, and admin dashboards. Create polished portfolios, contribute to open-source, write technical blogs and case studies, and prepare a freelance-ready presentation showcasing deploy‑ready projects with GitHub and blogs.',
      resources: {
        free: [
          'https://www.theodinproject.com',
          'https://github.com/firstcontributions/first-contributions',
          'https://dev.to/',
          'https://vercel.com/guides',
        ],
        premium: [
          'https://www.udemy.com/course/full-stack-open/',
          'https://frontendmasters.com/courses/fullstack-app-next/',
          'https://www.coursera.org/learn/meta-front-end-developer-capstone',
          'https://www.codecademy.com/learn/full-stack-engineer-career-path',
        ],
      },
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    topics: [
      {
        id: '1',
        type: NodeType.Topic,
        data: {
          label: '9.1 Full-Stack Projects',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Apply your full-stack development skills by building production-ready applications that include features such as user authentication (OAuth, JWT), CRUD operations with REST or GraphQL, file uploads using cloud storage (e.g., Cloudinary, S3), Stripe integration for payments, and role-based admin panels. This project-based topic focuses on planning application architecture, setting up backend and frontend interactions, managing secure user sessions, and optimizing performance and deployment strategies using services like Vercel or Render.',
          resources: {
            free: [
              'https://www.digitalocean.com/community/tutorials',
              'https://www.freecodecamp.org/news/fullstack-web-development/',
              'https://www.theodinproject.com/paths/full-stack-javascript',
              'https://dev.to/danail-bran/10-full-stack-project-ideas-for-your-portfolio-489c',
            ],
            premium: [
              'https://www.udemy.com/course/mern-stack-front-to-back/',
              'https://www.fullstackopen.com/en/',
              'https://frontendmasters.com/learn/fullstack/',
              'https://www.codecademy.com/learn/full-stack-engineer-career-path',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
      {
        id: '2',
        type: NodeType.Topic,
        data: {
          label: '9.2 Portfolio & Open Source',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Creating a professional developer portfolio is key to standing out in the job market. This topic focuses on designing and deploying a personal portfolio that highlights your best work, blog posts, and GitHub contributions. You’ll learn how to present case studies, write project documentation, and effectively showcase problem-solving skills. You’ll also explore open source contributions, from picking beginner-friendly issues to creating pull requests and engaging in community discussions—critical skills for collaboration and career growth.',
          resources: {
            free: [
              'https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio-website/',
              'https://www.digitalocean.com/community/tutorial_series/how-to-contribute-to-open-source',
              'https://opensource.guide/how-to-contribute/',
              'https://github.com/firstcontributions/first-contributions',
            ],
            premium: [
              'https://www.udemy.com/course/git-a-web-developer-job-masterclass/',
              'https://frontendmasters.com/courses/portfolio-projects/',
              'https://egghead.io/courses/building-a-developer-portfolio-with-next-js-and-tailwind-css',
              'https://www.linkedin.com/learning/learning-personal-branding-as-a-developer',
            ],
          },
        },
        width: TOPIC.WIDTH,
        height: TOPIC.HEIGHT,
      },
    ],
    assignments: [
      {
        id: '1',
        type: NodeType.Assignment,
        data: {
          label: 'Launch a Freelance-ready Portfolio with GitHub Projects',
          isCompleted: false,
          status: NodeStatus.NotStarted,
          description:
            'Build and deploy a professional portfolio website designed to attract freelance clients. Showcase your technical skills through detailed project case studies, full-stack applications, and active GitHub contributions. Include a blog section to share your learning journey and insights. Ensure your portfolio is responsive, visually appealing, and includes clear calls to action for potential clients or employers. Deploy your site using platforms like GitHub Pages, Vercel, or Netlify for easy sharing and professional presence online.',
          resources: {
            free: [
              'https://pages.github.com/',
              'https://vercel.com/docs/concepts/deployments',
              'https://www.netlify.com/blog/2020/04/28/how-to-create-a-portfolio-website/',
              'https://css-tricks.com/how-to-write-technical-blogs/',
            ],
            premium: [
              'https://www.udemy.com/course/build-a-professional-portfolio-website/',
              'https://frontendmasters.com/courses/portfolio/',
              'https://www.pluralsight.com/courses/web-portfolio-building',
              'https://egghead.io/courses/how-to-create-a-personal-website-using-react',
            ],
          },
        },
        width: ASSIGNMENT.WIDTH,
        height: ASSIGNMENT.HEIGHT,
      },
    ],
  },
];

const getLayoutedElements = (innerWidth: number) => {
  const nodes: NodeItem[] = [];
  const edges: NodeEdge[] = [];
  const lastMinCoords = { l: MODULE.HEIGHT, r: MODULE.HEIGHT };

  nodes.push({
    id: 'mod-empty',
    type: NodeType.Root,
    data: {
      label: '',
      description: '',
      isCompleted: false,
      status: NodeStatus.NotStarted,
    },
    width: MODULE.WIDTH,
    height: 15,
    position: { x: innerWidth / 2 - MODULE.WIDTH / 2, y: 0 },
  });

  nodes.push({
    id: 'mod-root',
    type: NodeType.Root,
    data: {
      label: 'Front-end',
      description: '',
      isCompleted: false,
      status: NodeStatus.NotStarted,
    },
    width: MODULE.WIDTH,
    height: MODULE.HEIGHT,
    position: {
      x: innerWidth / 2 - MODULE.WIDTH / 2,
      y: MODULE.HEIGHT,
    },
  });

  rawNodes.forEach((node, index) => {
    const { id, type, data, width, height, topics, assignments } = node;
    const modPositionX = innerWidth / 2 - width / 2;
    const modPositionY = (index + 1) * (height * 2 + SPACE.y);
    const modId = `mod-${id}`;
    const moduleNode = {
      id: modId,
      type,
      data,
      width,
      height,
      position: {
        x: modPositionX,
        y: modPositionY,
      },
    };
    if (index !== 0) {
      edges.push({
        id: `e-mod-${index}`,
        source: `mod-${rawNodes[index - 1].id}`,
        target: modId,
        style: { stroke: '#2b78e4', strokeWidth: 1.5 },
      });
    } else {
      edges.push(
        {
          id: `e-mod-empty-root`,
          source: `mod-empty`,
          target: 'mod-root',
          style: {
            stroke: '#2b78e4',
            strokeWidth: 1.5,
            strokeDasharray: '2,1.75',
          },
        },
        {
          id: `e-mod-root-${index}`,
          source: `mod-root`,
          target: modId,
          style: { stroke: '#2b78e4', strokeWidth: 1.5 },
        }
      );
    }

    nodes.push(
      moduleNode,
      ...topics.map((topic, topicIndex) => {
        const { id, type, data, width, height } = topic;
        edges.push({
          id: `e-mod-${index}-${id}`,
          ...(index % 2 !== 0
            ? {
                source: `top-${index}-${id}`,
                target: modId,
                sourceHandle: 'left',
                targetHandle: 'left',
              }
            : {
                source: modId,
                target: `top-${index}-${id}`,
                sourceHandle: 'right',
                targetHandle: 'left',
              }),
          style: {
            stroke: '#2b78e4',
            strokeWidth: 1.5,
            strokeDasharray: '2,1.75',
          },
        });
        return {
          id: `top-${index}-${id}`,
          type,
          data:
            index % 2 !== 0 ? ({ ...data, dir: 'R' } as NodeItemData) : data,
          width,
          height,
          position: {
            x:
              index % 2 === 0
                ? modPositionX + (MODULE.WIDTH + SPACE.x)
                : modPositionX - (MODULE.WIDTH + SPACE.x),
            y: (() => {
              const newY =
                topicIndex * (height + 10) + (modPositionY + MODULE.HEIGHT);
              const direction = index % 2 === 0 ? 'l' : 'r';
              const lastMin = Math.max(
                lastMinCoords[direction] + (height + 10),
                topics.length > 3
                  ? modPositionY - MODULE.HEIGHT
                  : topics.length > 2
                    ? modPositionY - MODULE.HEIGHT * 0.675
                    : modPositionY - MODULE.HEIGHT * 0.25
              );
              const finalY = Math.min(lastMin, newY);
              // console.log(
              //   "direction",
              //   direction,
              //   lastMin,
              //   newY,
              //   "finalY",
              //   finalY
              // );
              lastMinCoords[direction] = finalY;
              return finalY;
            })(),
          },
        };
      }),
      ...assignments.map((assignment, assignmentIndex) => {
        const { id, type, data, width, height } = assignment;
        edges.push({
          id: `e-top-${index}-${id}`,
          source: modId,
          target: `ass-${index}-${id}`,
          style: {
            stroke: '#2b78e4',
            strokeWidth: 1.5,
            strokeDasharray: '2,1.75',
          },
        });
        return {
          id: `ass-${index}-${id}`,
          type,
          data:
            index % 2 === 0 ? ({ ...data, dir: 'R' } as NodeItemData) : data,
          width,
          height,
          position: {
            x:
              index % 2 !== 0
                ? innerWidth / 2 -
                  TOPIC.WIDTH / 2 +
                  (MODULE.WIDTH * 2 + SPACE.x)
                : innerWidth / 2 -
                  TOPIC.WIDTH / 2 -
                  (MODULE.WIDTH * 2 + SPACE.x),
            y:
              assignmentIndex * (height + 10) +
              (modPositionY + MODULE.HEIGHT * 1.125),
          },
        };
      })
    );
  });
  return { nodes, edges };
};

type SelectedNode = NodeItemData & { id: string; type: NodeItemType };

export default function RoadmapPage() {
  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [edges, setEdges] = useState<NodeEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const scrollBounds = useMemo(() => {
    if (nodes.length === 0) return { minY: 0, maxY: 0 };

    let minY = Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
      const top = node.position.y;
      const bottom = node.position.y + node.height;

      if (top < minY) minY = top;
      if (bottom > maxY) maxY = bottom;
    });

    const padding = 100;

    const innerHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Because viewport.y scrolls negative downward, invert values:
    return {
      // minY: -(maxY + padding), // negative max scroll offset (bottom)
      minY: -(maxY + padding) + innerHeight,
      maxY: 0, // zero = top scroll limit
    };
  }, [nodes]);

  const { setViewport } = useReactFlow();

  const handleMove: OnMove = useCallback(
    (_event, nextViewport) => {
      const { minY, maxY } = scrollBounds;

      const clampedY = Math.max(Math.min(nextViewport.y, maxY), minY);

      if (nextViewport.x !== 0 || nextViewport.y !== clampedY) {
        setViewport({
          x: 0,
          y: clampedY,
          zoom: nextViewport.zoom,
        });
      }
    },
    [scrollBounds, setViewport]
  );
  const handleStatusChange = (
    e: ChangeEvent<HTMLSelectElement>,
    nodeId: string
  ) => {
    if (!nodeId || !selectedNode || nodes.length === 0) return;

    const { value } = e.target;
    // console.log("NodeStatus changed to:", value, "for nodeId:", nodeId);

    setSelectedNode(prev => ({
      ...prev!,
      status: value as NodeItemStatus,
    }));

    setNodes(prevNodes =>
      prevNodes.map(node => {
        if (node.id === nodeId) {
          const isCompleted = value === NodeStatus.Completed;

          return {
            ...node,
            data: {
              ...node.data,
              isCompleted,
              status: value as NodeItemStatus,
            },
          };
        }
        return node;
      })
    );
  };

  useEffect(() => {
    const { nodes, edges } = getLayoutedElements(
      window.innerWidth || document.documentElement.clientWidth
    );

    setNodes(nodes);
    setEdges(edges);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#fbf9fa] text-black text-center">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(e, node) => {
          e.stopPropagation();

          if (node.type !== 'root') {
            setSelectedNode({ id: node.id, type: node.type, ...node.data });
          }
        }}
        // fitView={true}
        panOnScroll={true}
        zoomOnScroll={false}
        panOnDrag={false}
        onMove={handleMove}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {selectedNode && (
        <AnimatePresence mode="wait">
          <motion.div
            onClick={() => setSelectedNode(null)}
            className="fixed z-[1000] right-0 top-0 w-full h-full overflow-y-auto bg-black/30 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { type: 'tween' } }}
            exit={{ opacity: 0, transition: { type: 'tween' } }}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              className="fixed z-[1000] right-0 top-0 w-full md:w-[40%] h-full overflow-y-auto bg-white p-6 shadow-lg rounded-l-lg"
              initial={{ opacity: 0, x: '100%' }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { type: 'tween' },
              }}
              exit={{ opacity: 0, x: '100%' }}
            >
              {/* Header */}
              <div className="flex items-center justify-end gap-2 mb-4">
                {(selectedNode.type === 'topic' ||
                  selectedNode.type === 'assignment') && (
                  <select
                    value={selectedNode?.status || 'Not Started'}
                    onChange={e => handleStatusChange(e, selectedNode.id)}
                    className="p-1 px-2 text-sm border rounded-md border-gray-300 bg-transparent"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                )}

                <div
                  onClick={() => setSelectedNode(null)}
                  className="flex items-center shrink-0 aspect-square gap-1.5 rounded-lg bg-gray-200 px-1.5 py-1 text-xs text-black hover:bg-gray-300 hover:text-gray-900"
                >
                  <X className="size-4" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {selectedNode.label}
              </h3>

              {/* Description */}
              <p className="text-gray-700 text-base mb-6 leading-relaxed whitespace-pre-line">
                {selectedNode.description}
              </p>

              {/* Resources */}
              {selectedNode.resources && (
                <div className="mt-6 space-y-6">
                  <div className="relative">
                    <div className="relative pl-3 mb-2">
                      <div className="absolute -z-10 left-0 top-1/2 -translate-y-1/2 w-full h-px bg-green-600 rounded-full" />
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-white border border-green-600 text-green-600 rounded-md">
                        <Heart className="size-[1.8ch]" fill="currentColor" />
                        <span>Free Resources</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mt-4 pl-3 text-base font-medium">
                      {selectedNode.resources.free.map((url, index) => (
                        <li
                          key={`free-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <span className="inline-block capitalize px-1.5 py-0.5 text-xs font-medium bg-yellow-300 text-gray-800 rounded-sm">
                            Course
                          </span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-1 font-medium text-gray-800 hover:text-gray-900 cursor-pointer"
                          >
                            {new URL(url).hostname}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative">
                    <div className="relative pl-3 mb-2">
                      <div className="absolute -z-10 left-0 top-1/2 -translate-y-1/2 w-full h-px bg-purple-600 rounded-full" />
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-white border border-purple-600 text-purple-600 rounded-md">
                        <Star className="size-[1.8ch]" fill="currentColor" />
                        <span>Premium Resources</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mt-4 pl-3 text-base font-medium">
                      {selectedNode.resources.premium.map((url, index) => (
                        <li
                          key={`premium-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <span className="inline-block capitalize px-1.5 py-0.5 text-xs font-medium bg-yellow-300 text-gray-800 rounded-sm">
                            Video
                          </span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-1 font-medium text-gray-800 hover:text-gray-900 cursor-pointer"
                          >
                            {new URL(url).hostname}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
