# Pakistan legal library

## Authoring

Create Markdown files in `src/content/legal-pk/`, or use the **Pakistan legal documents** collection in Pages CMS. The filename becomes the URL: `example-services-agreement.md` → `/legal-pk/example-services-agreement`.

Required frontmatter: `title`, `description`, `version` (quoted string), `status` (`example`, `active`, or `archived`), and `updatedDate` (quoted `YYYY-MM-DD`). Active documents also require `effectiveDate`. Set `draft: false` to publish; omitted draft values default to true. `order` controls library ordering, then titles sort alphabetically.

Use `##` for numbered clauses and `###` for subsections. The page supplies the only H1 and automatically creates contents links in a collapsed disclosure. Prefer plain Markdown, meaningful link labels, and accessible tables. Do not add executable scripts or untrusted HTML. Heading text determines fragment URLs; keep headings stable when preserving incoming links matters.

Example documents receive a prominent non-binding notice in the reader and print output. Do not mark the sample active. Have actual terms reviewed by qualified Pakistani counsel; do not imply IP detection establishes contractual jurisdiction or acceptance.

Update dates and versions explicitly, not on every build. Preserve agreed versions as separately named files marked `archived` where appropriate; do not overwrite the only public record of agreed terms. Removing a published route breaks its incoming links. Do not publish private client data, signatures, secrets, or confidential agreements. Draft exclusion is not repository privacy: files may still be visible on GitHub.

## Country gate

Both routes automatically request `https://free.freeipapi.com/api/v1/json`, once per page load (and again on browser back/forward cache restoration). Only a valid `countryCode: "PK"` reveals content. Other countries, invalid responses, HTTP errors, timeouts after 8 seconds, and disabled JavaScript leave documents hidden. No retries, manual overrides, persistent storage, or fallback provider are used. The request omits credentials and referrer; the provider still receives the visitor IP and returns additional fields, which this application neither stores nor uses.

The inline country-check message discloses the provider. There is no collection of contractual acceptance. Visitors can copy links and print/save PDF after verification. Before verification, print output must not reveal hidden documents.

**This is UI gating, not access control.** The generated HTML and repository remain public. `noindex` and sitemap exclusion are not security measures. VPNs and IP databases can produce incorrect location results.

## Verification and release prerequisite

Run `npm run build` (or the repository's equivalent Bun command). Check both legal routes and ensure drafts are absent from generated routes and the index. Confirm no legal routes appear in sitemap output.

Test desktop/mobile, keyboard navigation, headings and contents links, copy failure, print, disabled JavaScript, PK/non-PK results, malformed responses, HTTP errors, network failures, timeouts, and back/forward restoration. Controlled API responses test the gate but do not verify the live provider.

**Live provider verification remains required before release.** The research service returned a response, but direct HTTPS requests from the implementation workspace failed during TLS connection. Verify a real browser can fetch the endpoint from both the preview and production origin, that CORS permits it, and that a Pakistani connection returns PK. Do not silently replace the provider.

Provider reference: https://freeipapi.com/ — free commercial use and browser examples. Published free limits: 60 requests/minute (10 per 10 seconds); free infrastructure has no uptime guarantee established here. Review current provider terms/privacy and availability before release.

### Automated checks

After building, run `node --test tests/legal-pk.test.mjs`. The tests execute the built country-gate script with controlled DOM/network doubles using only Node built-ins; they are not browser integration tests. Rebuild after source changes before running them. Fifteen checks cover reveal/deny decisions, malformed payloads and JSON, HTTP/network failures, timeout, back/forward restoration, late responses, request privacy options, malformed fragments, hidden initial HTML, simplified reader markup, and SEO output. Draft exclusion was also checked by temporarily adding a draft Markdown fixture and rebuilding.

The implementation build, gate TypeScript check, and automated checks passed. Installing Chromium for visual/browser tests failed during TLS download, so responsive rendering, keyboard/screen-reader behavior, clipboard integration, and print output still require real-browser verification.
