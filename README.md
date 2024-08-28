# DVLA Emerging Tech Lab Generative AI

This project provides the frontend for the generative AI experiments which can be used in conjunction with the [lab-gen-api](https://github.com/dvla/lab-gen) backend.

## Getting Started

## Prerequisites
Install the packages
```bash
npm install
```

### Quick Start

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/dvla/lab-gen-ui)

[![Open in VS Code Dev Containers](https://img.shields.io/static/v1?style=for-the-badge&label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/dvla/lab-gen-ui)

Create ```.env.local``` file in the project root, with the following - 

```bash
AZURE_APP_HOST={BACKEND_URL}
AZURE_APP_API_KEY={MUST_MATCH_THE_BACKEND_API_KEY}
AUTH_SECRET={CREATE_RANDOM_SECRET}
AUTH_URL={http://localhost:3000 or your codespaces URL eg. https://candy-bus-jwvrg.github.dev}
```

#### Local Development

For local development, you can use a local password for authentication by setting the AUTH_LOCAL_PASSWORD environment variable in your ```.env.local``` file:

```bash
AUTH_LOCAL_PASSWORD=passw0rd
```
 
This will allow you to sign in with the local credentials provider using the password you set. **This should only be used for local development**.

#### Production

For production, you should use AWS Cognito for authentication. Set the following environment variables for the AWS Cognito authorization. These can be configured in an AWS console.

```bash
AUTH_COGNITO_CLIENT_ID=123
AUTH_COGNITO_CLIENT_SECRET=123
AUTH_COGNITO_ISSUER=https://cognito.eu-west-2.amazonaws.com/eu-west-2_12345678
```

You can then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

This uses the [govuk-react](https://github.com/govuk-react/govuk-react) framework. The [storyboard](https://govuk-react.github.io/govuk-react/?path=/docs/welcome--docs) has examples of components you can use.

More details of the components can be found in the [Components Guide](/components.md).

## License
The MIT License (MIT)

Copyright (c) 2024 DVLA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.