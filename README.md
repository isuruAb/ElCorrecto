# ElCorrecto

ElCorrecto is a resume-to-role analysis application. Upload a CV as a PDF, paste a job description, and receive an AI-powered comparison showing the match score, matched skills, missing skills, and suggested improvements.

The application uses a React and TypeScript frontend with Ant Design and Tailwind CSS. Its Azure Functions backend uploads the resume to Azure Blob Storage, extracts text with Azure Document Intelligence, and sends the extracted resume and job description to Azure Foundry for analysis.

## Project structure

```text
api/       Azure Functions API and Azure service integrations
frontend/  React, TypeScript, Vite, Ant Design, and Tailwind UI
bruno/     Bruno collection for testing the API
```

## How it works

1. The user drops a PDF resume into the frontend.
2. The user pastes the target job description.
3. The frontend sends both fields as `multipart/form-data` with Axios.
4. The Azure Function stores the PDF in Blob Storage.
5. Document Intelligence extracts the resume text.
6. Azure Foundry compares the resume with the job description.
7. The frontend displays the structured analysis.

## Setup

Install dependencies in both workspaces:

```bash
npm install --prefix api
npm install --prefix frontend
```

Copy the API settings template and add your Azure credentials:

```bash
cp api/local.settings.example.json api/local.settings.json
```

The frontend Function URL is configured in `frontend/.env`. Use `frontend/.env.example` as a template when setting up another environment. Never commit real secrets or local settings files.

Required Azure services:

- Azure Storage Account with a `resumes` Blob container
- Azure Document Intelligence resource
- Azure AI Foundry model deployment
- Azure Function App

## Run locally

Start the Azure Functions API from the project root:

```bash
npm start
```

The API runs at `http://localhost:7071/api/analyze-resume`.

Start the frontend in a second terminal:

```bash
npm run start:frontend
```

Open `http://localhost:5173/` in your browser.

## Build and checks

Build both applications:

```bash
npm run build
```

Run frontend checks:

```bash
npm --prefix frontend run lint
npm --prefix frontend run format:check
```

Format the frontend with Prettier:

```bash
npm --prefix frontend run format
```

## API request

The API expects a `POST` request with `multipart/form-data`:

- `resume`: PDF file
- `jobDescription`: job description text

The deployed Function endpoint is:

```text
https://analyze-resume-ebgeb5bkaubjchhu.westus3-01.azurewebsites.net/api/analyze-resume
```

A Bruno request is available in [bruno](bruno). The API-specific setup notes are in [api/README.md](api/README.md).
