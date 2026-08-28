# PanCAD.ai auth.md

## Agent access

The PanCAD.ai public site health API is a read-only public endpoint. It does not require an account, registration, OAuth authorization, bearer token, API key, or other credential.

## Public endpoint

- `GET https://www.pancad.ai/api/health.json`
- Purpose: verify that the public PanCAD.ai website is available.
- Supported method: unauthenticated HTTP GET.
- Response: JSON with `status`, `service`, and `description`.

## Agent registration and provisioning

Agent registration is not currently supported. There is no agent account-registration endpoint and no credential-provisioning endpoint for the public site API. The supported registration method is none; agents should use the public unauthenticated health endpoint directly and must not create an account. Do not submit credentials or personal data to the health endpoint.

## API documentation

- API catalog: `https://www.pancad.ai/.well-known/api-catalog`
- OpenAPI description: `https://www.pancad.ai/api/health.openapi.json`
- Human-readable documentation: `https://www.pancad.ai/api/health-doc.html`

The internal CRM and contact-processing services are not public agent APIs and are not advertised here.

## agent_auth

```yaml
skill: auth.md
audience: autonomous agents using the public site health API
register_uri: null
registration_method: none
credential_type: none
credential_use: no credentials are required or accepted
```

This explicit `none` registration declaration means that agents must not attempt account creation or credential issuance for this public endpoint.
