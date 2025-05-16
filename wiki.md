# Amplify config

**Build commands:**

```
version: 1
frontend:
phases:
    preBuild:
    commands:
        - yarn
    build:
    commands:
        - yarn build
artifacts:
    # IMPORTANT - Please verify your build output directory
    baseDirectory: /dist
    files:
    - '**/*'
cache:
    paths:
    - node_modules/**/*
```

**Env vars:**

Same as in .env

**Rewrites and redirects:**

```
[
    {
        "source": "/<*>",
        "target": "/index.html",
        "status": "404-200",
        "condition": null
    },
    {
        "source": "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>",
        "target": "/",
        "status": "200",
        "condition": null
    }
]
```

**Cognito callback urls:**
Similar for all amplify apps. An example:
https://dev.d23v4dl1my9ypb.amplifyapp.com/auth/signin/callback
https://dev.d23v4dl1my9ypb.amplifyapp.com/auth/signin

# Notes

Environment variables are set up both in Amplify and locally, separately. If you change them in the .env file remember to also change them in Amplify.