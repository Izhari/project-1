# Project Instructions

## Communication

- Respond to the user in Indonesian unless they explicitly request another language.
- Write repository content—including source comments, identifiers, instructions, configuration text, commit-facing documentation, and Markdown—in professional, natural English or Indonesian, as appropriate to its audience.
- Use English for code identifiers and technical APIs; use a consistent language within each document or user-facing flow unless bilingual wording is explicitly useful.
- Avoid slang, overly casual wording, awkwardly literal translations, and unnecessarily stiff or verbose language.
- Keep responses concise, factual, and focused on the current request.

## Project Scope

- This is a Node.js command-line listener for public TikTok LIVE events, with short local audio alerts.
- The listener currently handles viewer joins, gifts, chat comments, and likes. It does not provide TTS, a dashboard, or a guaranteed broadcast-audio route.
- TikTok LIVE connectivity uses the unofficial `tiktok-live-connector` package and may break when TikTok changes its Webcast protocol. Do not describe it as an official or production-guaranteed API.
- The connector is licensed AGPL-3.0-only. Consider license obligations before proposing redistribution or copying its code.

## Implementation Conventions

- Use the existing JavaScript ES module structure under `src/`; keep event ingestion in `src/listener.js` and alert playback in `src/sound.js`.
- TikTok chat message text is provided as `content` by the installed connector; preserve support for `comment` as a fallback.
- Serialize alert playback so sounds never overlap or cut off an active clip. Coalesce viewer-join sounds to at most one per five-second window; preserve one queued alert per comment; prioritize gifts and comments over joins and likes; rate-limit likes; and report queue overflow explicitly.
- The custom viewer-join audio is the local-only `assets/sounds/view.mp3`; do not remove its ignore rule or copy it into tracked artifacts.
- Do not add credentials, cookies, session tokens, or other secrets. Reading public live events must not require asking the user for TikTok credentials.
- Make focused changes and avoid unrelated refactors.

## Context Management

- Use the configured context-mode tools when they materially improve work with large files, extensive command output, or broad repository context; prefer concise in-tool summaries and targeted retrieval over dumping large raw content into chat.
- Do not invoke context-mode for simple requests or small, directly readable files when it adds overhead without a clear benefit.
- Treat context-mode as an optional aid, not a substitute for inspecting the relevant source, validating changes, or reporting uncertainty.
- Never send secrets, credentials, private user data, or other sensitive repository content to external services or index them into shared stores.

## Windows Usage and Validation

- The Windows working copy is `C:\Users\izhar\project-1`.
- Unless the user explicitly says otherwise, synchronize every relevant repository change—including source files, instructions, configuration, and documentation—to the matching relative path in the Windows working copy.
- Before synchronizing, inspect the target and preserve unrelated Windows-only files or edits; do not overwrite user changes or copy machine-specific secrets, dependencies, caches, or generated output.
- PowerShell treats an unquoted `@username` specially. Quote usernames in examples and invocations, for example:
  `npm start -- "@sugar.kevin"`.
- After synchronizing changes, run at least the smallest relevant check on Windows; for the current project, use `npm.cmd run check` from `C:\Users\izhar\project-1`. Install dependencies with `npm.cmd install` only when required.
- If Windows execution or validation is unavailable, state that explicitly instead of claiming the check passed.
- When asked to test a live account, use only the provided public username, report which events were actually observed, and stop the exact listener process after the test. Do not leave background listeners or audio playback running.
- If a requested public test account is offline, consult `.local/live-test-usernames.txt` and try its public usernames in order until a live account connects; add newly approved test accounts to that local list, not to tracked documentation.
- Distinguish a successful PowerShell beep command from a sound verified as audible through the user's physical or broadcast audio device.
- State clearly when Windows playback or broadcast routing cannot be physically verified from the current environment.
