export type ProviderType = "github" | "gitlab"
export type StorageType = "s3" | "r2"
export type IntegrationType = "github" | "gitlab" | "s3" | "r2"
export type IntegrationStatus = "active" | "inactive" | "expired" | "error"
export type TrackedRepoStatus = "active" | "paused" | "syncing" | "error"
export type SyncMode = "webhook" | "daily"

export interface RepoSource {
  externalId: string
  name: string
  fullName: string
  ownerLogin: string
  defaultBranch: string
  private: boolean
  htmlUrl: string
}

export interface TrackedRepo {
  id: string
  userId: string
  integrationId: string
  storageIntegrationId: string
  providerType: ProviderType
  storageType: StorageType
  syncMode: SyncMode
  status: TrackedRepoStatus
  source: RepoSource
  lastSyncedAt: string | null
  storagePath: string
  createdAt: string
  updatedAt: string
}

export interface IntegrationMetadata {
  username: string | null
  avatarUrl: string | null
  email: string | null
  serverUrl: string | null
}

export interface Integration {
  id: string
  userId: string
  type: IntegrationType
  status: IntegrationStatus
  metadata: IntegrationMetadata
  createdAt: string
  updatedAt: string
}

export interface TrackRepoPayload {
  integrationId: string
  storageIntegrationId: string
  externalRepoId: string
  syncMode: SyncMode
}

export interface UpdateRepoPayload {
  repoId: string
  syncMode?: SyncMode
  status?: TrackedRepoStatus
}

export interface AvailableRepo {
  id: string
  name: string
  fullName: string
  description: string | null
  owner: { id: string; login: string; avatarUrl: string }
  defaultBranch: string
  private: boolean
  cloneUrl: string
  htmlUrl: string
}

export type SyncJobStatus = "pending" | "cloning" | "bundling" | "uploading" | "completed" | "failed"
export type SyncTrigger = "webhook" | "manual" | "scheduled"

export interface SyncJobContext {
  userId: string
  trackedRepoId: string
  integrationId: string
  storageIntegrationId: string
  providerType: ProviderType
  storageType: StorageType
  repoFullName: string
  ownerLogin: string
  repoName: string
  defaultBranch: string
  storagePath: string
  cloneUrl: string
}

export interface SyncJobResult {
  bundlePath: string
  storageKey: string
  sizeBytes: number
  checksum: string
  durationMs: number
}

export interface SyncJob {
  id: string
  status: SyncJobStatus
  trigger: SyncTrigger
  context: SyncJobContext
  metadata: {
    commitSha: string | null
    branch: string
    commitMessage: string | null
    commitAuthor: string | null
    timestamp: string
  } | null
  result: SyncJobResult | null
  error: string | null
  attempts: number
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ConnectStoragePayload {
  endpoint: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}
