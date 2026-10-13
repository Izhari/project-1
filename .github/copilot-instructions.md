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

- Prefer the configured context-mode MCP server for context-heavy investigation and analysis so large raw inputs stay out of the conversation.
- Use context-mode by default when a task involves three or more related reads or commands, multiple files/logs, large or unpredictable command output, repository-wide exploration, or analysis that requires filtering, counting, parsing, or comparing substantial data.
- Choose the matching workflow: use `ctx_execute` or `ctx_execute_file` to summarize/filter/derive from command output or files; use `ctx_batch_execute` to run three or more related I/O-bound commands and query their combined results; use `ctx_fetch_and_index` for multi-page web research, and `ctx_index` followed by `ctx_search` when documentation or reference material needs repeated lookup.
- Keep results concise: print only the facts, excerpts, or calculations needed for the task. Do not dump whole large files, logs, search results, or API responses into chat when an in-tool summary or targeted retrieval will do.
- For a simple request, one small file, or a known short output, use the direct file/tool workflow instead; context-mode must reduce overhead or context use, not add ceremony.
- Treat context-mode as an analysis aid, not a substitute for inspecting relevant source before edits, running the required tests, or disclosing uncertainty. Do not claim to have used it if the tools are unavailable.
- Never index or expose credentials, cookies, session tokens, private user data, ignored local files, or other sensitive content. Keep context-mode session data under `.github/context-mode/` ignored by Git.
- Keep `.vscode/mcp.json` and `.github/hooks/context-mode.json` tracked as shareable, secret-free project setup. Do not put machine-specific paths, credentials, or private configuration in them.

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
