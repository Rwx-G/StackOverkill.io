import { promises as fs } from 'fs';
import path from 'path';
import type { LeaderboardEntry } from '@stackoverkill/shared';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '..', '..', 'data');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

export class LeaderboardService {
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  private async readLeaderboard(): Promise<LeaderboardEntry[]> {
    await this.ensureDataDir();
    try {
      const data = await fs.readFile(LEADERBOARD_FILE, 'utf-8');
      return JSON.parse(data) as LeaderboardEntry[];
    } catch {
      // File doesn't exist yet
      return [];
    }
  }

  private async writeLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  }

  async add(entry: LeaderboardEntry): Promise<void> {
    const entries = await this.readLeaderboard();
    entries.push(entry);

    // Sort by creation date (newest first) for fresh data rotation
    entries.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Keep only the 1000 most recent entries (oldest gets ejected)
    const trimmed = entries.slice(0, 1000);
    await this.writeLeaderboard(trimmed);
  }

  async getTop(limit: number = 50): Promise<LeaderboardEntry[]> {
    const entries = await this.readLeaderboard();
    return entries.slice(0, limit);
  }

  async getPaginated(limit: number, offset: number): Promise<{ entries: LeaderboardEntry[]; total: number }> {
    const allEntries = await this.readLeaderboard();
    const entries = allEntries.slice(offset, offset + limit);
    return { entries, total: allEntries.length };
  }

  async getPaginatedSorted(
    pageSize: number,
    page: number,
    sort: 'overkill' | 'balanced' | 'underkill',
    highlightNickname?: string
  ): Promise<{
    entries: LeaderboardEntry[];
    total: number;
    page: number;
    totalPages: number;
    highlightPage?: number;
  }> {
    const allEntries = await this.readLeaderboard();

    // Sort based on the requested order
    const sortedEntries = [...allEntries].sort((a, b) => {
      const gapA = a.scoreInfra - a.scoreApp;
      const gapB = b.scoreInfra - b.scoreApp;

      switch (sort) {
        case 'overkill':
          // Highest gap at top (most overkill first)
          return gapB - gapA;
        case 'underkill':
          // Lowest gap at top (most underkill first)
          return gapA - gapB;
        case 'balanced':
          // Closest to 0 at top
          return Math.abs(gapA) - Math.abs(gapB);
        default:
          return gapB - gapA;
      }
    });

    const total = sortedEntries.length;
    const totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;
    const entries = sortedEntries.slice(offset, offset + pageSize);

    // Find which page the highlighted user is on
    let highlightPage: number | undefined;
    if (highlightNickname) {
      const highlightIndex = sortedEntries.findIndex(e => e.nickname === highlightNickname);
      if (highlightIndex !== -1) {
        highlightPage = Math.floor(highlightIndex / pageSize) + 1;
      }
    }

    return { entries, total, page, totalPages, highlightPage };
  }

  async getByVerdict(verdict: string, limit: number = 20): Promise<LeaderboardEntry[]> {
    const entries = await this.readLeaderboard();
    return entries.filter((e) => e.verdict === verdict).slice(0, limit);
  }

  /**
   * Calculate percentile for a given gap (scoreInfra - scoreApp)
   * Returns the percentage of entries with a LOWER gap than the given one
   * E.g., if gap=50 is higher than 84% of entries, returns 84
   */
  async getPercentile(gap: number): Promise<{ percentile: number; total: number }> {
    const entries = await this.readLeaderboard();
    const total = entries.length;

    if (total === 0) {
      return { percentile: 50, total: 0 }; // Default to middle if no data
    }

    // Count entries with a lower gap
    const lowerCount = entries.filter(e => {
      const entryGap = e.scoreInfra - e.scoreApp;
      return entryGap < gap;
    }).length;

    // Percentile = percentage of entries below this gap
    const percentile = Math.round((lowerCount / total) * 100);

    return { percentile, total };
  }
}
