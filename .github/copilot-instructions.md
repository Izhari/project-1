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

- Route substantial analysis through the configured context-mode tools; do not read large raw inputs into chat when a sandbox summary or targeted retrieval can answer the question.
- Use `ctx_execute_file` to analyze a specific file and `ctx_execute` to filter, count, compare, parse, or summarize command output or other in-memory data. Print only the relevant findings.
- Use `ctx_batch_execute` for three or more related reads or I/O-bound commands, broad repository investigations, or outputs whose size is large or unpredictable. Include focused queries in the same batch when useful, and use `ctx_search` for targeted follow-up against indexed results.
- For web pages and external documentation, use `ctx_fetch_and_index` followed by `ctx_search`; use `ctx_index` when local reference material will need repeated retrieval.
- Do not use direct reads or raw command output for large-file analysis, log review, bulk search results, multi-file comparison, or data derivation when a context-mode sandbox workflow can keep the raw content out of chat. Never mentally compute over substantial raw output; perform the derivation in code and print the answer.
- Direct tools remain appropriate for edits, navigation, a single small file, a short known output, or when context-mode is unavailable. Do not add context-mode calls to simple tasks merely to increase usage.
- Context-mode is an analysis aid, not a substitute for reviewing the exact code being changed, validating the requested behavior, or disclosing uncertainty. Never claim a context-mode workflow ran unless it actually did.
- Never send credentials, cookies, session tokens, private user data, secrets, or ignored local files to context-mode, external services, or shared indexes. Context-mode runtime data may be stored outside the repository according to the active host configuration. Do not assume `.vscode/mcp.json` changes that storage location. The ignored `.github/context-mode/sessions/` directory is only for local session data when context-mode is explicitly configured to use it.
- The workspace configures the context-mode MCP server in `.vscode/mcp.json` and its Copilot hooks in `.github/hooks/context-mode.json`. After configuration changes, restart VS Code/Copilot Chat and verify availability with `ctx stats`.
- Keep `.vscode/mcp.json` and `.github/hooks/context-mode.json` tracked as shareable, secret-free project setup. Do not put machine-specific paths, credentials, or private configuration in them.

## Windows Usage and Validation

- Make changes directly in the active workspace. Do not assume a separate WSL or Windows checkout needs to be synchronized.
- Use PowerShell and Windows-compatible paths when operating in a Windows workspace. Resolve the repository root from the active workspace; do not hardcode a user's home directory or machine-specific project path in tracked instructions.
- PowerShell treats an unquoted `@username` specially. Quote usernames in examples and invocations, for example:
  `npm start -- "@sugar.kevin"`.
- After changing code, run the smallest relevant check from the repository root. On Windows, use `npm.cmd run check`; install dependencies with `npm.cmd install` only when required.
- If Windows execution or validation is unavailable, state that explicitly instead of claiming the check passed.
- When asked to test a live account, use only the provided public username, report which events were actually observed, and stop the exact listener process after the test. Do not leave background listeners or audio playback running.
- If a requested public test account is offline, consult `.local/live-test-usernames.txt` and try its public usernames in order until a live account connects; add newly approved test accounts to that local list, not to tracked documentation.
- Distinguish a successful PowerShell beep command from a sound verified as audible through the user's physical or broadcast audio device.
- State clearly when Windows playback or broadcast routing cannot be physically verified from the current environment.
