export type BranchStatus = 'active' | 'merged' | 'archived' | 'draft';
export type CommitCategory = 'feature' | 'hotfix' | 'content' | 'config' | 'security' | 'docs' | 'merge';
export type ChangeType = 'added' | 'modified' | 'deleted';
export type PRStatus = 'open' | 'merged' | 'closed' | 'conflicted';

export interface CommitAuthor {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface FileChange {
  path: string;
  component: string;
  type: ChangeType;
  oldContent?: string;
  newContent?: string;
  diffSummary?: string;
  additions: number;
  deletions: number;
}

export interface Commit {
  id: string; // short hash, e.g. "a1b2c3d"
  fullHash: string;
  branchId: string;
  branchName: string;
  message: string;
  description?: string;
  author: CommitAuthor;
  timestamp: number;
  parentCommitIds: string[];
  tags?: string[];
  category: CommitCategory;
  stats: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
  changes: FileChange[];
  snapshotData?: Record<string, any>;
  isRevert?: boolean;
  revertedCommitId?: string;
}

export interface Branch {
  id: string;
  name: string;
  description: string;
  isProtected: boolean;
  isDefault: boolean;
  headCommitId: string;
  createdAt: number;
  updatedAt: number;
  author: string;
  color: string;
  status: BranchStatus;
  aheadCount?: number;
  behindCount?: number;
}

export interface MergeConflict {
  file: string;
  component: string;
  description: string;
  currentContent: string;
  incomingContent: string;
  resolved: boolean;
  resolution?: 'current' | 'incoming' | 'both' | 'custom';
  resolvedContent?: string;
}

export interface SafetyChecklist {
  syntaxValid: boolean;
  noBreakingChanges: boolean;
  backupCreated: boolean;
  integrityVerified: boolean;
}

export interface PullRequest {
  id: string; // e.g. "PR-101"
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
  author: CommitAuthor;
  status: PRStatus;
  createdAt: number;
  updatedAt: number;
  mergedAt?: number;
  mergedBy?: string;
  commits: string[]; // commit IDs
  stats: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
  safetyChecks: SafetyChecklist;
  conflicts: MergeConflict[];
  changes: FileChange[];
}

export interface ReleaseTag {
  id: string;
  tag: string; // e.g. "v2.5.0-asrar"
  title: string;
  description: string;
  changelog: string[];
  commitId: string;
  branchName: string;
  createdAt: number;
  author: string;
  isProduction: boolean;
  downloadPayload?: string;
}

export interface VersionControlState {
  currentBranchId: string;
  branches: Branch[];
  commits: Commit[];
  pullRequests: PullRequest[];
  releases: ReleaseTag[];
  workingTreeChanges: FileChange[];
  lastSyncTimestamp: number;
}
