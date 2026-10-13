# Project Instructions

## Communication

- Respond to the user in Indonesian unless they explicitly request another language.
- Write project instructions and code documentation in clear, professional English.
- Keep responses concise, factual, and focused on the current request.

## Project Scope

- This is a Node.js command-line listener for public TikTok LIVE events, with short local audio alerts.
- The listener currently handles viewer joins, gifts, chat comments, and likes. It does not provide TTS, a dashboard, or a guaranteed broadcast-audio route.
- TikTok LIVE connectivity uses the unofficial `tiktok-live-connector` package and may break when TikTok changes its Webcast protocol. Do not describe it as an official or production-guaranteed API.
- The connector is licensed AGPL-3.0-only. Consider license obligations before proposing redistribution or copying its code.

## Implementation Conventions

- Use the existing JavaScript ES module structure under `src/`; keep event ingestion in `src/listener.js` and alert playback in `src/sound.js`.
- TikTok chat message text is provided as `content` by the installed connector; preserve support for `comment` as a fallback.
- Keep alert sounds short and rate-limited so busy rooms do not flood or overlap audio. Ensure active child audio processes stop when the listener exits.
- Do not add credentials, cookies, session tokens, or other secrets. Reading public live events must not require asking the user for TikTok credentials.
- Make focused changes and avoid unrelated refactors.

## Windows Usage and Validation

- The Windows working copy is `C:\Users\izhar\project-1`; when that copy is the target, keep its application files in sync with the workspace source.
- PowerShell treats an unquoted `@username` specially. Quote usernames in examples and invocations, for example:
  `npm start -- "@sugar.kevin"`.
- Install dependencies with `npm install`; run the project's syntax check with `npm run check`.
- When asked to test a live account, use only the provided public username, report which events were actually observed, and stop the exact listener process after the test. Do not leave background listeners or audio playback running.
- Distinguish a successful PowerShell beep command from a sound verified as audible through the user's physical or broadcast audio device.
- State clearly when Windows playback or broadcast routing cannot be physically verified from the current environment.
