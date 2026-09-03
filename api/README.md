# ElCorrecto API

Azure Functions API for uploading a resume PDF, extracting its text with Azure Document Intelligence, and comparing it with a job description using Azure Foundry.

## Local configuration

`local.settings.json` contains local secrets and is excluded from Git. Use [local.settings.example.json](local.settings.example.json) as a template:

```bash
cp local.settings.example.json local.settings.json
```

Replace every placeholder in `local.settings.json` with values from your Azure resources. The storage connection string can be used for both `AzureWebJobsStorage` and `BLOB_CONNECTION_STRING`. Create a Blob container named `resumes` and set `BLOB_CONTAINER_NAME` accordingly.

Do not commit `local.settings.json` or share its keys. For Azure deployment, configure the same values under the Function App's environment variables instead.

## Run locally

From the repository root:

```bash
npm start
```

The API is available at `http://localhost:7071/api/analyze-resume`.

## Request

Send a `POST` request as `multipart/form-data` with:

- `resume`: a PDF file
- `jobDescription`: the job description text

Example:

```bash
curl -X POST http://localhost:7071/api/analyze-resume \
  -F "resume=@resume.pdf" \
  -F "jobDescription=Senior TypeScript developer with Azure experience"
```
