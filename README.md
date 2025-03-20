
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0b9aa85e-89c0-49d1-9178-ae8af9babdbb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0b9aa85e-89c0-49d1-9178-ae8af9babdbb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Capacitor (for iOS/Android builds)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0b9aa85e-89c0-49d1-9178-ae8af9babdbb) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Build Docker Image

1. Build docker image (locally).
```
docker build -t cheers-counter .
```
2. Run container to test if the image works. Navigate to [http://localhost:8080](http://localhost:8080).
```
docker run -d -p 8080:80 cheers-counter
```
3. List all running containers with `docker ps -a`. Stop and delete container.
```
docker stop <container-id>
docker container rm <container-id>
```
4. Tag and push image to Docker Hub.
```
docker tag <image-id> nibir/cheers-counter:<tag-name>
docker push nibir/cheers-counter:<tagname>
```

## iOS Development with Capacitor

To build and run this project on iOS:

1. Export the project to your own GitHub repository via the "Export to GitHub" button
2. Git pull the project to your local machine
3. Install the dependencies:
   ```
   npm install
   ```
4. Build the web app:
   ```
   npm run build
   ```
5. Add iOS platform:
   ```
   npx cap add ios
   ```
6. Sync the web build with the iOS project:
   ```
   npx cap sync ios
   ```
7. Open the project in Xcode:
   ```
   npx cap open ios
   ```
8. Use Xcode to run the app on a simulator or physical device

After making changes to the web app, always rebuild and sync:
```
npm run build
npx cap sync ios
```

## References

- https://www.bacancytechnology.com/blog/prepare-your-ios-app-for-development-and-distribution
