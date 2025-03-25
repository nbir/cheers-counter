
# Cheers Counter

[beermetwice.nibir.xyz](http://beermetwice.nibir.xyz/), an app to track daily drinks! 🍻

iOS app [BeerMeTwice](https://apps.apple.com/us/app/beermetwice/id6743499695) on App Store.

## Instructions

### Local Development

Ensure Node.js & npm are installed. The install dependencies and run development server (supports auto-reloading).
```
npm i
npm run dev
```

### Build Docker Image

Build docker image (locally) with a tag and publish to Docker Hub (registry). Tag with the 7 character commit sha or `:debug`.
```
docker build -t nibir/cheers-counter:<tag> .
docker push nibir/cheers-counter:<tag>
```

(Optional) Tag an image if it wasn't built with a tag, or if a new tag needs to be assigned.
```
docker tag <image-id> nibir/cheers-counter:<tag>
```

Run container to test if the image works. Then, navigate to [http://localhost:8080](http://localhost:8080).
```
docker run -d -p 8080:80 nibir/cheers-counter:<tag>
```

Stop and delete container to cleanup.
```
docker ps -a
docker stop <container-id>
docker container rm <container-id>
```

### iOS Development with Capacitor

Build the web app as static assets, then generate the iOS project and sync.
```
npm run build

npx cap add ios
npx cap sync ios
npx cap open ios
```

After making changes to the web app, rebuild and sync:
```
npm run build
npx cap sync ios
```

## Release a New iOS App Version

1. Bump version in App > Targets.
2. Product > Archive then Validate App. Once validation passes Distribute App.
3. App Store Connect > Apps then select app. Click the "+" button next to iOS App.
4. Fill out details, select build, then Add for Review > Submit to App Review.

## References

Cheers Counter is a Single Page App (SPA) built with Vite, TypeScript, React, shadcn-ui, Tailwind CSS, Capacitor (for iOS/Android builds).

[Prepare your iOS App for Distribution](https://www.bacancytechnology.com/blog/prepare-your-ios-app-for-development-and-distribution) enlists steps required to launch a iOS app (for first timers).

This project is built using [lovable.dev](https://lovable.dev) with minimal coding. ❤️
