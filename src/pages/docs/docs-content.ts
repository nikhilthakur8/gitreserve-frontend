export interface DocSection {
  slug: string
  title: string
  category: string
  content: string
}

export const DOC_CATEGORIES = [
  "Getting Started",
  "Setup Guides",
  "Core Concepts",
  "Integrations",
  "Storage",
  "Advanced",
] as const

export const DOCS: DocSection[] = [
  {
    slug: "introduction",
    title: "Introduction",
    category: "Getting Started",
    content: `
# Introduction

GitReserve automatically mirrors your Git repositories to S3-compatible object storage. Every push triggers a backup — no manual intervention required.

## Why GitReserve?

Your code is your most valuable asset. While GitHub and GitLab are reliable, having an independent backup gives you:

- **Disaster recovery** — Restore repos even if your Git provider goes down
- **Compliance** — Meet data retention requirements with your own storage
- **Portability** — Your backups live in your cloud, not someone else's
- **Peace of mind** — Know your code is always safe, no matter what

## How it works

1. Connect your GitHub or GitLab account via OAuth
2. Choose which repositories to watch
3. Point to your S3-compatible storage (AWS S3, Cloudflare R2, MinIO)
4. GitReserve registers a webhook and backs up on every push

That's it. Push and forget.
    `,
  },
  {
    slug: "quickstart",
    title: "Quick Start",
    category: "Getting Started",
    content: `
# Quick Start

Get your first backup running in under 5 minutes.

## Step 1: Create an account

Sign up at GitReserve with your email or use Google/GitHub OAuth for one-click signup.

## Step 2: Connect a Git provider

Go to **Integrations** and connect your GitHub or GitLab account. GitReserve uses OAuth — we never store your password.

## Step 3: Add storage

Add your S3-compatible storage credentials. See our detailed setup guides for each provider:

- **AWS S3** — See [Setting up AWS S3](/docs/setup-aws-s3)
- **Cloudflare R2** — See [Setting up Cloudflare R2](/docs/setup-cloudflare-r2)

## Step 4: Track a repository

Go to **Repositories → Add Repository**, select your provider, pick a repo, and choose your storage destination.

## Step 5: Push something

Make a commit and push. GitReserve will automatically create a backup in your storage bucket.

\`\`\`bash
git add .
git commit -m "trigger backup"
git push origin main
\`\`\`

Check the **Activity** page to see your backup status.
    `,
  },
  {
    slug: "setup-aws-s3",
    title: "Setting up AWS S3",
    category: "Setup Guides",
    content: `
# Setting up AWS S3

This guide walks you through creating an S3 bucket and IAM credentials for GitReserve.

---

## Step 1: Create an S3 Bucket

1. Log in to the [AWS Management Console](https://console.aws.amazon.com)
2. Navigate to **S3** → **Create bucket**
3. Enter a bucket name (e.g. \`gitreserve-backups\`)
4. Select your preferred **AWS Region** (e.g. \`us-east-1\`)
5. Leave **Block all public access** enabled (recommended)
6. Click **Create bucket**

:::tip
Choose a region close to your GitReserve server for faster uploads. If you're unsure, \`us-east-1\` is a good default.
:::

---

## Step 2: Create an IAM Policy

Create a policy with minimal permissions for GitReserve.

1. Go to **IAM** → **Policies** → **Create policy**
2. Switch to the **JSON** tab and paste:

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:HeadObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::gitreserve-backups",
        "arn:aws:s3:::gitreserve-backups/*"
      ]
    }
  ]
}
\`\`\`

3. Replace \`gitreserve-backups\` with your actual bucket name
4. Name the policy \`GitReserveS3Access\` and click **Create policy**

:::warning
Never use \`s3:*\` or \`*\` resource. Always scope permissions to the specific bucket.
:::

---

## Step 3: Create an IAM User

1. Go to **IAM** → **Users** → **Create user**
2. Enter a username (e.g. \`gitreserve-service\`)
3. Select **Attach policies directly**
4. Search for and select the \`GitReserveS3Access\` policy you created
5. Click **Create user**

---

## Step 4: Generate Access Keys

1. Click on the user you just created
2. Go to **Security credentials** tab
3. Under **Access keys**, click **Create access key**
4. Select **Third-party service** as the use case
5. Click **Create access key**
6. **Copy both the Access Key ID and Secret Access Key** — you won't be able to see the secret again

:::warning
Store these credentials securely. Never commit them to version control or share them publicly.
:::

---

## Step 5: Add to GitReserve

1. Go to **Integrations** in your GitReserve dashboard
2. Click **Add Storage** → **AWS S3**
3. Fill in the form:

| Field | Value |
|-------|-------|
| **Bucket Name** | \`gitreserve-backups\` |
| **Region** | \`us-east-1\` (your bucket's region) |
| **Access Key ID** | Your IAM access key |
| **Secret Access Key** | Your IAM secret key |

4. Click **Verify & Save** — GitReserve will test the connection

---

## Optional: Enable Bucket Versioning

For extra safety, enable versioning so previous backups aren't permanently overwritten:

1. Go to your S3 bucket → **Properties**
2. Under **Bucket Versioning**, click **Edit**
3. Select **Enable** and save

This lets you recover older backups even after they're replaced.

---

## Optional: Enable Server-Side Encryption

1. Go to your S3 bucket → **Properties**
2. Under **Default encryption**, click **Edit**
3. Select **SSE-S3** (Amazon S3 managed keys)
4. Save changes

All uploaded backups will now be encrypted at rest automatically.

---

## Troubleshooting

**"Access Denied" error when verifying:**
- Double-check your Access Key ID and Secret Access Key
- Ensure the IAM policy is attached to the user
- Verify the bucket name and region match exactly

**"Bucket not found" error:**
- Confirm the bucket exists in the correct region
- Check for typos in the bucket name

**Slow uploads:**
- Choose a region closer to the GitReserve server
- Large repositories may take longer on the first sync
    `,
  },
  {
    slug: "setup-cloudflare-r2",
    title: "Setting up Cloudflare R2",
    category: "Setup Guides",
    content: `
# Setting up Cloudflare R2

Cloudflare R2 is S3-compatible with zero egress fees — ideal for backups. This guide walks you through the full setup.

---

## Step 1: Create an R2 Bucket

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **R2 Object Storage** in the sidebar
3. Click **Create bucket**
4. Enter a bucket name (e.g. \`gitreserve-backups\`)
5. Select a location hint (optional — \`Automatic\` works for most cases)
6. Click **Create bucket**

:::tip
R2 has no egress fees, so downloading your backups is free. This makes it great for disaster recovery where you might need to pull many repos at once.
:::

---

## Step 2: Get Your Account ID

1. In the Cloudflare dashboard, click on any domain or go to the **Overview** page
2. Your **Account ID** is shown in the right sidebar under **API**
3. Copy it — you'll need it for the endpoint URL

Your R2 endpoint URL follows this pattern:

\`\`\`
https://<account-id>.r2.cloudflarestorage.com
\`\`\`

---

## Step 3: Create an API Token

1. Go to **R2 Object Storage** → **Overview**
2. Click **Manage R2 API Tokens** in the top right
3. Click **Create API token**
4. Configure the token:

| Setting | Value |
|---------|-------|
| **Token name** | \`gitreserve-access\` |
| **Permissions** | Object Read & Write |
| **Specify bucket(s)** | Select \`gitreserve-backups\` |
| **TTL** | Optional — set an expiry or leave blank |

5. Click **Create API Token**
6. **Copy the Access Key ID and Secret Access Key** — you can't view the secret again

:::warning
Scope the token to only the bucket you need. Avoid using tokens with account-wide access.
:::

---

## Step 4: Add to GitReserve

1. Go to **Integrations** in your GitReserve dashboard
2. Click **Add Storage** → **Cloudflare R2**
3. Fill in the form:

| Field | Value |
|-------|-------|
| **Bucket Name** | \`gitreserve-backups\` |
| **Endpoint** | \`https://<account-id>.r2.cloudflarestorage.com\` |
| **Region** | \`auto\` |
| **Access Key ID** | Your R2 token access key |
| **Secret Access Key** | Your R2 token secret key |

4. Click **Verify & Save** — GitReserve will test the connection

---

## Why choose R2 over S3?

| Feature | AWS S3 | Cloudflare R2 |
|---------|--------|---------------|
| **Egress fees** | $0.09/GB | Free |
| **Storage cost** | $0.023/GB/month | $0.015/GB/month |
| **S3 compatible** | Native | Yes |
| **Global distribution** | Per-region | Automatic |

R2 is typically 30-40% cheaper for backup workloads, especially if you frequently download backups.

---

## Troubleshooting

**"Access Denied" when verifying:**
- Ensure the API token has **Object Read & Write** permissions
- Verify the token is scoped to the correct bucket
- Double-check the Access Key ID and Secret Access Key

**"Invalid endpoint" error:**
- The endpoint must include your Account ID
- Format: \`https://<account-id>.r2.cloudflarestorage.com\`
- Don't include the bucket name in the endpoint

**"Bucket not found":**
- Confirm the bucket name matches exactly (case-sensitive)
- Ensure the bucket was created in the same account
    `,
  },
  {
    slug: "setup-github",
    title: "Connecting GitHub",
    category: "Setup Guides",
    content: `
# Connecting GitHub

This guide walks you through connecting your GitHub account to GitReserve.

---

## Step 1: Navigate to Integrations

1. Log in to your GitReserve dashboard
2. Click **Integrations** in the sidebar
3. Find the **GitHub** card

---

## Step 2: Start OAuth Flow

1. Click the **Connect** button on the GitHub card
2. You'll be redirected to GitHub's authorization page
3. Review the permissions GitReserve is requesting:

| Permission | Why it's needed |
|------------|----------------|
| **repo** | Access to read public and private repositories |
| **admin:repo_hook** | Create and manage webhooks for push events |

4. Click **Authorize GitReserve**

---

## Step 3: Verify Connection

After authorization, you'll be redirected back to GitReserve. The GitHub integration should now show as **Active** with a green status badge.

---

## What happens next?

Once connected, you can:

- **Browse your repositories** from the Add Repository page
- **Track repositories** to start automatic backups
- GitReserve **registers webhooks** on tracked repos for push events

---

## Revoking Access

To disconnect GitHub:

1. Go to **Integrations** in GitReserve
2. Click the **Disconnect** button on the GitHub card

To fully revoke from GitHub's side:

1. Go to GitHub → **Settings** → **Applications** → **Authorized OAuth Apps**
2. Find GitReserve and click **Revoke**

:::tip
Disconnecting in GitReserve removes the integration but leaves webhooks intact. Revoking on GitHub removes everything including OAuth access.
:::

---

## Troubleshooting

**Integration shows "error" status:**
- Your OAuth token may have expired or been revoked
- Click **Reconnect** to start a fresh OAuth flow

**Can't see organization repos:**
- Ensure you've granted access to the organization during OAuth
- Go to GitHub → Settings → Applications → find GitReserve → Grant org access

**Webhook not triggering:**
- Check the webhook exists: Go to your repo → Settings → Webhooks
- Verify the webhook URL points to your GitReserve instance
- Check the "Recent Deliveries" tab for errors
    `,
  },
  {
    slug: "setup-gitlab",
    title: "Connecting GitLab",
    category: "Setup Guides",
    content: `
# Connecting GitLab

This guide walks you through connecting your GitLab account to GitReserve.

---

## Step 1: Navigate to Integrations

1. Log in to your GitReserve dashboard
2. Click **Integrations** in the sidebar
3. Find the **GitLab** card

---

## Step 2: Start OAuth Flow

1. Click the **Connect** button on the GitLab card
2. You'll be redirected to GitLab's authorization page
3. Review the requested permissions and click **Authorize**

---

## Step 3: Verify Connection

After authorization, you'll be redirected back to GitReserve. The GitLab integration should now show as **Active**.

---

## Supported Repository Types

- **Personal projects** — All projects you own
- **Group projects** — Projects where you have Maintainer access or higher
- **Public projects** — Any public project you have access to

---

## Self-managed GitLab

GitReserve currently supports **GitLab.com** only. Support for self-managed GitLab instances is planned for a future release.

---

## Troubleshooting

**Integration shows "error" status:**
- Your OAuth token may have expired
- Click **Reconnect** to authorize again

**Missing projects in the list:**
- Ensure you have at least **Maintainer** role for group projects
- Private projects require explicit access

**Webhook errors:**
- Go to your GitLab project → Settings → Webhooks
- Check the webhook URL and recent delivery status
    `,
  },
  {
    slug: "credentials-guide",
    title: "Managing Credentials",
    category: "Setup Guides",
    content: `
# Managing Credentials

A complete guide to understanding and managing all the credentials GitReserve needs.

---

## Overview of Required Credentials

GitReserve needs two types of credentials to function:

| Credential Type | Purpose | How it's obtained |
|----------------|---------|-------------------|
| **Git Provider OAuth** | Access your repos & manage webhooks | OAuth flow (automatic) |
| **Storage Access Keys** | Upload backups to S3/R2 | Manually created in provider console |

---

## Git Provider Credentials

### GitHub OAuth

When you click **Connect GitHub**, GitReserve uses OAuth 2.0 — you authorize on GitHub's site and we receive a token. We never see your password.

**Scopes requested:**
- \`repo\` — Read access to public and private repos
- \`admin:repo_hook\` — Create/delete webhooks

**Token lifecycle:**
- Tokens don't expire unless you revoke them
- Revoking on GitHub immediately stops GitReserve from accessing your repos
- You can reconnect anytime from the Integrations page

### GitLab OAuth

Same OAuth 2.0 flow as GitHub. GitReserve requests:
- \`api\` scope — Required for repository access and webhook management

---

## Storage Credentials

Storage credentials are **manually created** in your cloud provider's console and entered into GitReserve.

### What you need

Every S3-compatible storage requires these four values:

| Field | Example | Where to find it |
|-------|---------|-----------------|
| **Endpoint** | \`https://s3.us-east-1.amazonaws.com\` | Provider docs / console |
| **Access Key ID** | \`AKIA...\` | IAM console or API token page |
| **Secret Access Key** | \`wJalrXU...\` | Shown once at creation time |
| **Bucket Name** | \`gitreserve-backups\` | You choose when creating |

:::warning
The Secret Access Key is only shown once when you create it. Copy it immediately and store it in a password manager. If you lose it, you'll need to create a new access key.
:::

---

## Security Best Practices

1. **Use dedicated credentials** — Create a separate IAM user or API token just for GitReserve
2. **Principle of least privilege** — Only grant the permissions GitReserve needs (PutObject, GetObject, ListBucket, DeleteObject, HeadObject)
3. **Never share credentials** — Don't commit them to git, send via Slack, or paste in docs
4. **Rotate periodically** — Create new keys and update GitReserve, then delete the old ones
5. **Enable MFA** — Add MFA to your AWS/Cloudflare account for extra protection

---

## Rotating Credentials

To rotate your storage credentials without downtime:

1. Create a **new** access key in your provider's console
2. Go to GitReserve → **Integrations** → Edit your storage integration
3. Update the Access Key ID and Secret Access Key
4. Click **Verify & Save** to test the new credentials
5. Once verified, delete the **old** access key in your provider's console

:::tip
Always verify the new credentials work before deleting the old ones. This prevents any backup interruption.
:::

---

## Troubleshooting Credential Issues

**"Invalid credentials" error:**
- Double-check for extra spaces or line breaks when pasting
- Ensure the access key is active (not disabled or deleted)
- Verify the correct key pair — don't mix keys from different users/tokens

**"Access Denied" after credentials worked before:**
- The IAM policy may have been modified
- The access key may have been deactivated
- Check if the bucket still exists

**OAuth token expired:**
- Go to Integrations → Click **Reconnect** on the affected provider
- Re-authorize on GitHub/GitLab
    `,
  },
  {
    slug: "setup-minio",
    title: "Setting up MinIO",
    category: "Setup Guides",
    content: `
# Setting up MinIO

MinIO is a self-hosted, S3-compatible object storage. Perfect if you want to keep backups entirely on your own infrastructure.

---

## Step 1: Install MinIO

### Docker (recommended)

\`\`\`bash
docker run -d \\
  --name minio \\
  -p 9000:9000 \\
  -p 9001:9001 \\
  -v /data/minio:/data \\
  -e MINIO_ROOT_USER=minioadmin \\
  -e MINIO_ROOT_PASSWORD=minioadmin \\
  minio/minio server /data --console-address ":9001"
\`\`\`

### Binary

\`\`\`bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
./minio server /data --console-address ":9001"
\`\`\`

The MinIO Console will be available at \`http://localhost:9001\`.

:::warning
Change the default \`MINIO_ROOT_USER\` and \`MINIO_ROOT_PASSWORD\` in production. Use strong, unique credentials.
:::

---

## Step 2: Create a Bucket

1. Open the MinIO Console at \`http://localhost:9001\`
2. Log in with your root credentials
3. Go to **Buckets** → **Create Bucket**
4. Name it \`gitreserve-backups\`
5. Click **Create Bucket**

---

## Step 3: Create a Service Account

1. In the MinIO Console, go to **Identity** → **Service Accounts**
2. Click **Create Service Account**
3. Optionally restrict the policy to your bucket:

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:HeadObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::gitreserve-backups",
        "arn:aws:s3:::gitreserve-backups/*"
      ]
    }
  ]
}
\`\`\`

4. Click **Create** and **copy the Access Key and Secret Key**

---

## Step 4: Add to GitReserve

1. Go to **Integrations** in your GitReserve dashboard
2. Click **Add Storage** → **S3 Compatible**
3. Fill in the form:

| Field | Value |
|-------|-------|
| **Bucket Name** | \`gitreserve-backups\` |
| **Endpoint** | \`http://your-server:9000\` |
| **Region** | \`us-east-1\` (default for MinIO) |
| **Access Key ID** | Your service account access key |
| **Secret Access Key** | Your service account secret key |

4. Click **Verify & Save**

:::tip
If MinIO and GitReserve run on the same server, use \`http://localhost:9000\` as the endpoint. For Docker-to-Docker communication, use the container name or Docker network IP.
:::

---

## Enabling TLS

For production, always enable TLS:

1. Place your TLS certificate and key in \`~/.minio/certs/\`
2. Files must be named \`public.crt\` and \`private.key\`
3. Restart MinIO — it will automatically use HTTPS
4. Update your GitReserve endpoint to \`https://your-server:9000\`

---

## Troubleshooting

**"Connection refused" error:**
- Verify MinIO is running: \`docker ps\` or \`curl http://localhost:9000/minio/health/live\`
- Check firewall rules allow port 9000

**"Access Denied":**
- Verify the service account credentials
- Check the policy allows access to the correct bucket

**Slow uploads:**
- Check network bandwidth between GitReserve and MinIO servers
- Consider placing them in the same network/datacenter
    `,
  },
  {
    slug: "webhooks",
    title: "Webhooks",
    category: "Core Concepts",
    content: `
# Webhooks

GitReserve uses webhooks to trigger backups in real-time. When you track a repository, GitReserve automatically registers a webhook on your Git provider.

## How webhooks work

1. You push code to your repository
2. GitHub/GitLab sends a webhook event to GitReserve
3. GitReserve verifies the webhook signature
4. A backup job is queued and processed
5. Your repo is archived and uploaded to storage

## Webhook security

Every webhook request is verified using HMAC signatures:

- **GitHub** — Uses \`X-Hub-Signature-256\` header with SHA-256 HMAC
- **GitLab** — Uses \`X-Gitlab-Token\` header with a secret token

GitReserve generates a unique secret for each tracked repository. Unverified webhooks are rejected.

## Webhook events

GitReserve only listens to **push events**. Other events (pull requests, issues, etc.) are ignored.

## Retry behavior

If a backup fails, GitReserve does not automatically retry from the webhook. You can manually trigger a sync from the repository detail page.
    `,
  },
  {
    slug: "sync-modes",
    title: "Sync Modes",
    category: "Core Concepts",
    content: `
# Sync Modes

GitReserve supports two sync modes for tracked repositories.

## Webhook (default)

Backups are triggered automatically on every push via Git provider webhooks. This is the recommended mode for most use cases.

**Pros:**
- Real-time backups
- No manual intervention
- Efficient — only syncs when changes occur

## Manual

Backups are only triggered manually from the GitReserve dashboard. Useful for repositories where you don't need continuous backups.

**When to use manual mode:**
- Repos with very frequent pushes where you only need periodic backups
- Testing and experimentation
- Repos where you want full control over backup timing

## Switching modes

You can switch between modes at any time from the repository settings. When switching from manual to webhook, GitReserve will register a new webhook on your provider.
    `,
  },
  {
    slug: "backup-format",
    title: "Backup Format",
    category: "Core Concepts",
    content: `
# Backup Format

GitReserve stores backups as **Git bundles** — a portable format that contains the complete repository history.

## What is a Git bundle?

A Git bundle is an official Git format that packages repository data (objects, refs, and history) into a single file. It can be used to clone or restore a repository without needing access to the original remote.

## Restoring from a backup

Download the backup from the GitReserve dashboard or directly from your storage bucket, then:

\`\`\`bash
# Clone from the bundle
git clone repo-archive.bundle my-repo

# Or add as a remote to an existing repo
git remote add backup repo-archive.bundle
git fetch backup
\`\`\`

## Storage structure

Backups are stored with the following path pattern:

\`\`\`
{userId}/{provider}/{owner}/{repo}/latest.bundle
\`\`\`

Each backup replaces the previous one. GitReserve keeps only the latest backup per repository.

:::tip
If you need version history of backups (not just the latest), enable **Bucket Versioning** on your S3/R2 storage. This keeps every backup version even after it's overwritten.
:::
    `,
  },
  {
    slug: "downloading-backups",
    title: "Downloading Backups",
    category: "Core Concepts",
    content: `
# Downloading Backups

How to download your repository backups from GitReserve or directly from your storage bucket.

---

## Method 1: From the GitReserve Dashboard

The easiest way to download a backup:

1. Go to **Repositories** in your dashboard
2. Click on the repository you want to download
3. Click the **Download Backup** button
4. The \`.bundle\` file will download to your machine

---

## Method 2: From the Activity Log

Every successful backup appears in your Activity log with a download link:

1. Go to **Activity** in the sidebar
2. Find the backup event for your repository
3. Click the **download icon** next to the entry
4. The backup file downloads directly

:::tip
The Activity page shows the full history of all backup events — successful, failed, and in-progress. Use the filters to narrow down by repository or status.
:::

---

## Method 3: Directly from S3/R2

You can download backups directly from your storage bucket using the AWS CLI or any S3-compatible tool.

### Using AWS CLI

\`\`\`bash
# List your backups
aws s3 ls s3://gitreserve-backups/ --recursive

# Download a specific backup
aws s3 cp s3://gitreserve-backups/{userId}/{provider}/{owner}/{repo}/latest.bundle ./backup.bundle
\`\`\`

### Using rclone

\`\`\`bash
# Configure rclone for your storage (one-time)
rclone config

# List backups
rclone ls myremote:gitreserve-backups/

# Download a backup
rclone copy myremote:gitreserve-backups/{userId}/github/myorg/myrepo/latest.bundle ./
\`\`\`

### Using Cloudflare R2 (wrangler)

\`\`\`bash
# List objects in bucket
npx wrangler r2 object list gitreserve-backups

# Download a backup
npx wrangler r2 object get gitreserve-backups/{userId}/github/myorg/myrepo/latest.bundle
\`\`\`

---

## Method 4: Using curl with presigned URLs

If your storage supports presigned URLs, you can generate a temporary download link:

\`\`\`bash
# Generate a presigned URL (valid for 1 hour)
aws s3 presign s3://gitreserve-backups/{userId}/github/myorg/myrepo/latest.bundle --expires-in 3600

# Download using the presigned URL
curl -o backup.bundle "https://your-presigned-url-here"
\`\`\`

---

## Understanding the Storage Path

Backups are organized in a predictable folder structure:

\`\`\`
{userId}/{provider}/{owner}/{repo}/latest.bundle
\`\`\`

| Segment | Example | Description |
|---------|---------|-------------|
| **userId** | \`64a7f...\` | Your GitReserve user ID |
| **provider** | \`github\` or \`gitlab\` | Git provider name |
| **owner** | \`acme-corp\` | Repo owner or organization |
| **repo** | \`backend-api\` | Repository name |
| **file** | \`latest.bundle\` | The backup file |

---

## Bulk Download

To download all your backups at once:

\`\`\`bash
# Download everything from your storage bucket
aws s3 sync s3://gitreserve-backups/ ./all-backups/

# Download only GitHub repos
aws s3 sync s3://gitreserve-backups/{userId}/github/ ./github-backups/
\`\`\`

:::warning
Bulk downloads from AWS S3 incur egress fees. If you're on Cloudflare R2, downloads are free.
:::
    `,
  },
  {
    slug: "restoring-repos",
    title: "Restoring a Repository",
    category: "Core Concepts",
    content: `
# Restoring a Repository

How to convert a GitReserve backup file back into a fully working Git repository.

---

## Quick Restore

The fastest way to restore — clone directly from the bundle:

\`\`\`bash
git clone backup.bundle my-repo
cd my-repo
\`\`\`

That's it. You now have a complete repository with full commit history, branches, and tags.

---

## Step-by-Step Restore

### Step 1: Download the backup

Download the \`.bundle\` file using any method from the [Downloading Backups](/docs/downloading-backups) guide.

\`\`\`bash
# Example: download from S3
aws s3 cp s3://gitreserve-backups/{userId}/github/myorg/myrepo/latest.bundle ./myrepo.bundle
\`\`\`

### Step 2: Verify the bundle

Before restoring, verify the bundle is valid:

\`\`\`bash
git bundle verify myrepo.bundle
\`\`\`

This checks that:
- The bundle file is not corrupted
- All required objects are present
- The refs (branches, tags) are valid

You should see output like:

\`\`\`
The bundle contains this ref:
abc1234 refs/heads/main
The bundle records a complete history.
myrepo.bundle is okay
\`\`\`

### Step 3: Clone from the bundle

\`\`\`bash
git clone myrepo.bundle my-restored-repo
cd my-restored-repo
\`\`\`

### Step 4: Set up the remote

After cloning from a bundle, the \`origin\` remote points to the bundle file. Update it to point to your actual remote:

\`\`\`bash
# Remove the bundle as origin
git remote remove origin

# Add your real remote
git remote add origin git@github.com:myorg/myrepo.git

# Verify
git remote -v
\`\`\`

### Step 5: Push to a new remote (optional)

If you're restoring to a new repository:

\`\`\`bash
# Create a new repo on GitHub/GitLab first, then:
git push -u origin --all
git push origin --tags
\`\`\`

:::tip
\`--all\` pushes all branches, and \`--tags\` pushes all tags. This fully replicates the original repo.
:::

---

## Restore to an Existing Repository

If you want to merge the backup into an existing repo (e.g., to recover lost commits):

\`\`\`bash
cd existing-repo

# Add the bundle as a remote
git remote add backup ../myrepo.bundle

# Fetch all data from the bundle
git fetch backup

# See what branches are available
git branch -r | grep backup/

# Cherry-pick or merge what you need
git merge backup/main
# or
git cherry-pick <commit-hash>

# Clean up
git remote remove backup
\`\`\`

---

## Listing Bundle Contents

To see what's inside a bundle without restoring it:

\`\`\`bash
# List all refs (branches/tags) in the bundle
git bundle list-heads myrepo.bundle
\`\`\`

Output:

\`\`\`
abc1234def567890 refs/heads/main
def4567abc890123 refs/heads/develop
789abc0123456def refs/tags/v1.0.0
\`\`\`

---

## Disaster Recovery Checklist

If your Git provider is down and you need to restore from GitReserve backups:

1. **Download all backups** from your S3/R2 bucket
2. **Verify each bundle** with \`git bundle verify\`
3. **Clone each bundle** to a local directory
4. **Set up a new remote** (new GitHub org, GitLab instance, or self-hosted)
5. **Push all branches and tags** to the new remote
6. **Update CI/CD, deploy keys, and webhooks** to point to the new remote
7. **Notify your team** of the new repository URLs

\`\`\`bash
# Example: bulk restore all backups
for bundle in ./all-backups/**/*.bundle; do
  repo_name=$(basename $(dirname "$bundle"))
  echo "Restoring $repo_name..."
  git clone "$bundle" "./restored/$repo_name"
done
\`\`\`

:::warning
After restoring, remember to re-track the repositories in GitReserve with the new remote URLs so backups continue.
:::

---

## Troubleshooting

**"not a bundle" error:**
- The file may be corrupted or incomplete
- Re-download from your storage bucket
- Check the file size matches what's in the bucket

**"missing prerequisite commits" error:**
- The bundle may be an incremental backup (not full)
- GitReserve creates full bundles by default — this shouldn't happen unless the bundle was manually modified

**Clone succeeds but repo seems empty:**
- Check which branch you're on: \`git branch -a\`
- The default branch might differ: \`git checkout main\` or \`git checkout master\`

**Large bundle taking long to clone:**
- Git bundles contain full history — large repos with long history will take time
- This is normal; the clone is decompressing all objects locally
    `,
  },
  {
    slug: "activity-logs",
    title: "Activity & Logs",
    category: "Core Concepts",
    content: `
# Activity & Logs

The Activity page is your central hub for monitoring all backup operations in GitReserve.

---

## Accessing Activity Logs

1. Click **Activity** in the sidebar
2. You'll see a chronological feed of all backup events

---

## Event Types

| Status | Icon | Meaning |
|--------|------|---------|
| **Success** | Green checkmark | Backup completed and uploaded to storage |
| **Failed** | Red X | Backup failed — see error details |
| **In Progress** | Spinning indicator | Backup currently running |
| **Queued** | Clock icon | Backup waiting to be processed |

---

## Event Details

Each activity entry shows:

- **Repository name** — Which repo was backed up
- **Provider** — GitHub or GitLab
- **Trigger** — What caused the backup (push event, manual sync)
- **Timestamp** — When it happened
- **Duration** — How long the backup took
- **File size** — Size of the uploaded bundle
- **Commit** — The HEAD commit hash that was backed up

Click on any entry to see the full details including error messages for failed backups.

---

## Filtering Logs

Use the filters at the top to narrow down:

- **By repository** — Select a specific repo
- **By status** — Show only failed, success, etc.
- **By date range** — Filter to a specific time period
- **By provider** — GitHub only, GitLab only

---

## Understanding Failed Backups

When a backup fails, the activity log shows the error reason. Common failures:

**Storage errors:**
- \`AccessDenied\` — Your storage credentials may have been revoked or expired
- \`NoSuchBucket\` — The storage bucket was deleted
- \`RequestTimeout\` — Network timeout during upload (large repos)

**Provider errors:**
- \`401 Unauthorized\` — OAuth token expired, reconnect the integration
- \`404 Not Found\` — Repository was deleted or you lost access
- \`403 Forbidden\` — Insufficient permissions on the repo

**System errors:**
- \`ENOSPC\` — Server ran out of disk space during download
- \`ETIMEDOUT\` — Network connectivity issue

:::tip
For failed backups, you can click **Retry** to trigger the backup again manually. If the error persists, check the specific credential or integration.
:::

---

## Exporting Logs

To export your activity logs:

1. Go to **Activity**
2. Apply any filters you need
3. Click the **Export** button (top right)
4. Choose format: **CSV** or **JSON**

This is useful for compliance reporting or debugging patterns in backup failures.

---

## Log Retention

GitReserve keeps activity logs for **90 days** by default. After that, older entries are automatically cleaned up. The actual backup files in your storage bucket are not affected — only the log entries in GitReserve are removed.

:::warning
If you need longer log retention for compliance, export your logs regularly or configure your storage bucket's access logs as an additional audit trail.
:::
    `,
  },
  {
    slug: "github",
    title: "GitHub",
    category: "Integrations",
    content: `
# GitHub Integration

Connect your GitHub account to back up repositories hosted on GitHub.

## Required permissions

GitReserve requests the following OAuth scopes:

- \`repo\` — Access to public and private repositories
- \`admin:repo_hook\` — Create and manage webhooks

## Supported repository types

- Public repositories
- Private repositories (that your account has access to)
- Organization repositories (if you have admin access)

## Webhook registration

When you track a GitHub repository, GitReserve creates a webhook via the GitHub API. The webhook:

- Listens to \`push\` events only
- Uses a unique HMAC secret per repository
- Points to GitReserve's webhook endpoint

For the full setup guide, see [Connecting GitHub](/docs/setup-github).
    `,
  },
  {
    slug: "gitlab",
    title: "GitLab",
    category: "Integrations",
    content: `
# GitLab Integration

Connect your GitLab account to back up repositories hosted on GitLab.

## Supported repository types

- Public projects
- Private projects (that your account has access to)
- Group projects (if you have maintainer access or higher)

## Webhook registration

When you track a GitLab repository, GitReserve creates a project webhook via the GitLab API. The webhook:

- Listens to \`push\` events only
- Uses a secret token for verification
- Points to GitReserve's webhook endpoint

## Self-managed GitLab

GitReserve currently supports GitLab.com. Support for self-managed GitLab instances is planned.

For the full setup guide, see [Connecting GitLab](/docs/setup-gitlab).
    `,
  },
  {
    slug: "aws-s3",
    title: "AWS S3",
    category: "Storage",
    content: `
# AWS S3

Store your backups in Amazon S3, the most widely used object storage service.

## Configuration

| Field | Description |
|-------|-------------|
| **Bucket** | Your S3 bucket name |
| **Region** | AWS region (e.g. \`us-east-1\`) |
| **Access Key ID** | IAM user access key |
| **Secret Access Key** | IAM user secret key |

## Best practices

- Use a dedicated bucket for GitReserve backups
- Enable bucket versioning for additional safety
- Use a dedicated IAM user with minimal permissions
- Consider enabling server-side encryption (SSE-S3)

For the full step-by-step guide, see [Setting up AWS S3](/docs/setup-aws-s3).
    `,
  },
  {
    slug: "cloudflare-r2",
    title: "Cloudflare R2",
    category: "Storage",
    content: `
# Cloudflare R2

Cloudflare R2 is an S3-compatible object storage with zero egress fees — ideal for backups you may need to download frequently.

## Configuration

| Field | Description |
|-------|-------------|
| **Bucket** | Your R2 bucket name |
| **Endpoint** | \`https://<account-id>.r2.cloudflarestorage.com\` |
| **Region** | \`auto\` |
| **Access Key ID** | R2 API token access key |
| **Secret Access Key** | R2 API token secret key |

## Why R2?

- **Zero egress fees** — Download your backups without extra charges
- **S3-compatible API** — Works with any S3 client
- **Global distribution** — Data is stored across Cloudflare's network
- **Cost-effective** — Competitive storage pricing

For the full step-by-step guide, see [Setting up Cloudflare R2](/docs/setup-cloudflare-r2).
    `,
  },
  {
    slug: "security",
    title: "Security",
    category: "Advanced",
    content: `
# Security

GitReserve is designed with security as a priority.

## Authentication

- User passwords are hashed with bcrypt
- JWT tokens are used for API authentication
- OAuth tokens are stored encrypted in the database

## Webhook verification

Every incoming webhook is verified:

- **GitHub**: HMAC SHA-256 signature verification
- **GitLab**: Secret token header verification

Unverified requests are rejected with a 401 status.

## Storage credentials

Your S3/R2 credentials are stored encrypted in the database. They are only decrypted when a backup job needs to upload or download files.

## Data in transit

All communication happens over HTTPS:

- OAuth flows with GitHub/GitLab
- Webhook events from providers
- Uploads to S3/R2 storage

## Best practices

- Use strong, unique passwords
- Rotate your storage access keys periodically
- Use dedicated IAM users with minimal permissions
- Enable MFA on your Git provider accounts
    `,
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    category: "Advanced",
    content: `
# Troubleshooting

Common issues and how to resolve them.

## Backup not triggering

**Check the webhook status:**
- Go to repository detail page and verify the webhook is active
- Check your Git provider's webhook delivery logs for errors

**Common causes:**
- Webhook was deleted manually on the provider
- OAuth token expired — reconnect the integration
- Push was to a non-default branch (GitReserve backs up the default branch)

## Storage upload failed

**Check your credentials:**
- Verify your access key and secret key are correct
- Ensure the IAM user has the required permissions
- Check that the bucket exists and is accessible

**Check the bucket region:**
- Make sure the region matches your bucket's actual region

## Integration shows "error" status

This usually means the OAuth token has been revoked or expired. Go to **Integrations** and reconnect the affected provider.

## Download not working

- Ensure at least one successful sync has completed
- Check that your storage integration is still active
- Verify the backup file exists in your storage bucket
    `,
  },
]
