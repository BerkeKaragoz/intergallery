# Intergallery, Media Storage and Management Tool
- Save and serve media, focused for self-hosting

![image](https://user-images.githubusercontent.com/34271483/171039949-7ddf2704-ff6c-47fe-a307-4dfb1bead75b.png)


Host the media with the server included and/or upload the media to the content server, and access them through the web UI.

Designed to be extensible, so that it can be used for any purpose.

**Watch the video:** [youtu.be/F5Cwo4eiJpk](https://youtu.be/F5Cwo4eiJpk)

[![Watch the video](https://img.youtube.com/vi/F5Cwo4eiJpk/mqdefault.jpg)](https://youtu.be/F5Cwo4eiJpk)

## Repository Structure

|`intergallery-`| Description | Technologies |
|--------|----|-|
| The monorepo | Follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) | [Turborepo](https://turborepo.org/), [pnpm](https://pnpm.io/), [ESLint](https://eslint.org/) |
| [`web-ui`](#web-ui) | The interface of the project | [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/), [MUI](https://mui.com/), [Redux](https://redux.js.org/) (+[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)), [Formik](https://formik.org/), [Playwright](https://playwright.dev/) (e2e testing), [Figma](https://www.figma.com/) (initial design) |
| [`server`](#server) | Direct communication with UI and DB | [NestJS](https://nestjs.com/) (w/ [Express.js](https://expressjs.com/) platform), [TypeScript](https://www.typescriptlang.org/), [TypeORM](https://typeorm.io/), [Passport.js](https://www.passportjs.org/), [Swagger](https://swagger.io/), [FFMPEG](https://ffmpeg.org/), [Docker](https://www.docker.com/) |
| [`content-server`](#content-server) | Micro service to serve content from different places | [Express.js](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [sharp](https://sharp.pixelplumbing.com/), [Docker](https://www.docker.com/) |
| [`proto-web-ui-angular`](#prototype-angular-web-ui) | The prototype frontend with Angular | [TypeScript](https://www.typescriptlang.org/), [Angular](https://angular.io/), [SASS](https://sass-lang.com/), [Angular Material](https://material.angular.io/), [RxJS](https://rxjs.dev/) |

**Browse the source code here:** [github.**dev**/BerkeKaragoz/intergallery](https://github.dev/BerkeKaragoz/intergallery)

## Web UI
<div align="center">
  <img src="https://user-images.githubusercontent.com/34271483/171040569-5df21b68-1518-4813-a88c-c95502461cd9.png" alt="Intergallery browsing screen"/>
</div>

### The frontend structure
```
  src/
    components/ - shared components
    hooks/ 
    lib/
    modules/ - Auth, Browse, Media, Source, User (includes views)
    redux/ - Has slices including the RTK Query API slice
    App.tsx - Creates the theme, provides the error boundary, mounts routes according to the app state
    index.tsx
    RoutesAuth.tsx - Routes to mount when the user is authenticated
    RoutesNonAuth.tsx - Routes to mount when there is no authentication
    theme.ts
  test/
    e2e/
    fixtures/
    global-setup.ts - Storage state is generated here
    test-consts.ts - Mostly for string constants
```

- [Vite](https://vitejs.dev/): Handles the bundling the application, along with a proxy
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [MUI](https://mui.com/): Theming, components, styling. All used according to the material design system.
- [Redux](https://redux.js.org/) (+[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)): Redux-Toolkit handles the user transactions. RTK Query handles fetching the media to show with a good structure. It can handle caching with invalidation and data states.
- [Formik](https://formik.org/): Formik is an important part of this application along with [Yup](https://github.com/jquense/yup). Most inputs leverage Formik's system with proper validation.
- [Playwright](https://playwright.dev/): End to end testing in various browsers.
- [Figma](https://www.figma.com/): Made the initial design with it

### Screenshots
Starting with the initial Figma design:
<div align="center">
  <img src="https://user-images.githubusercontent.com/34271483/171049307-5412d080-e203-47ac-b41a-a0e70d15dc5a.png" alt="Initial Intergallery Figma design"/>
  <img src="https://user-images.githubusercontent.com/34271483/171038501-f216a2b6-45ee-404a-81d7-be88dc574439.png" alt="Intergallery edit media"/>
  <img src="https://user-images.githubusercontent.com/34271483/171038399-8d9c5b80-202b-4df7-b338-c95cb56dc1ab.png" alt="Intergallery delete media"/>
  <img src="https://user-images.githubusercontent.com/34271483/171038697-f6f4c865-0629-4724-af46-fcecabdeaab3.png" alt="Intergallery adding media with drag and drop"/>
  <img src="https://user-images.githubusercontent.com/34271483/171044794-272e47ae-d3c5-4b2e-82c7-f0fa5165a53b.png" alt="Intergallery end to end testing"/>
</div>

[Back to top](#repository-structure)

## Server
![image](https://user-images.githubusercontent.com/34271483/171041172-e4656195-c398-43a0-9f4a-4d8f969f2ce2.png)

### The backend structure
```
src/
  auth/ - Authentication module that includes guards and strategies
  core/ - Shared decorators and DTOs
  file/ - File module that handles generating thumbnails, symlinks and files
  media/ - Media CRUD
  model/ - Database entities for TypeORM: media, session, source and user
  user/ - User module
  app.{controller,module,service}.ts - The main module. Connects configuration, TypeORM and other modules
  main.ts - Initializes the app, creates the cookies and sessions, instantiates Swagger API documentations
ormconfig.ts - TypeORM configurations: one for sessions and one for the application data
```

- [NestJS](https://nestjs.com/) (w/ [Express.js](https://expressjs.com/) platform): The framework, provides a great structure and a CLI that can help creating modules
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/): The ORM for TypeScript, can translate to most databases. Made with PostgreSQL in mind, currently using sqlite3 for development purposes.
- [Passport.js](https://www.passportjs.org/): A great authentication middleware
- [Swagger](https://swagger.io/): API documentation
- [FFMPEG](https://ffmpeg.org/): Processing video files
- [Docker](https://www.docker.com/)

![image](https://user-images.githubusercontent.com/34271483/171047200-f9dc8a0d-bd0e-4783-87dd-0b2822701c25.png)

[Back to top](#repository-structure)

## Content Server
A small service to serve your content. Provides a simple API: `/file/*path*` for file serving, `/thumb/*path*` for thumbnails.

- [Express.js](https://expressjs.com/): Standard and minimalistic backend framework
- [TypeScript](https://www.typescriptlang.org/)
- [sharp](https://sharp.pixelplumbing.com/): For image processing
- [Docker](https://www.docker.com/): Deploy anywhere

[Back to top](#repository-structure)

## Prototype Angular Web UI
I made this UI to test out Angular. After trying out NestJS and knowing that its structure was inspired by Angular, I had to try it.

```
src/app/
    components/ - shared components, by according to atomic design
    core/
      api/ - shared DTOs
      auth/ - guards, resolver and services
      consts/
      form/ - Validators
      media/ - Media service
      user/
    pages/ - View modules
    styles/ - SASS styles
  base.scss
```

<div align="center">
  <img src="https://user-images.githubusercontent.com/34271483/151972500-79a4f984-3e01-405c-8dd9-9fc08c22824a.png" alt="Intergallery Prototype browsing screen"/>
  <img src="https://user-images.githubusercontent.com/34271483/151973123-6940e55a-0981-46f9-98af-621edb73f7e6.png" alt="Intergallery Prototype mobile view"/>
</div>

[Back to top](#repository-structure)
